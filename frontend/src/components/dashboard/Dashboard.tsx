"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { ReminderCard } from "../reminder/ReminderCard";
import { EmptyReminders } from "../ui/empty-states/EmptyReminders";
import { ReminderFormDialog } from "../reminder/ReminderFormDialog";
import { DeleteReminderDialog } from "../reminder/DeleteReminderDialog";
import { ReminderFilterSort } from "./ReminderFilterTabs";
import { Reminder } from "../../types/reminder";
import { fetchReminders, createReminder, deleteReminder } from "../../lib/api";
import { NavArrowLeft, NavArrowRight } from "iconoir-react";

type FilterType = "all" | "scheduled" | "completed" | "failed";
type SortType = "ascending" | "descending" | "-";

interface DashboardState {
  filter: FilterType;
  sort: SortType;
  currentPage: number;
  showDialog: boolean;
  showQuickCreateDialog: boolean;
  showEditDialog: boolean;
  editingReminder: Reminder | null;
  showDeleteDialog: boolean;
  deletingReminder: Reminder | null;
}

const INITIAL_STATE: DashboardState = {
  filter: "all",
  sort: "-",
  currentPage: 1,
  showDialog: false,
  showQuickCreateDialog: false,
  showEditDialog: false,
  editingReminder: null,
  showDeleteDialog: false,
  deletingReminder: null,
};

const PER_PAGE = 25;

export function Dashboard() {
  const queryClient = useQueryClient();
  const remindersContainerRef = useRef<HTMLDivElement>(null);

  // Unified UI State
  const [state, setState] = useState<DashboardState>(INITIAL_STATE);

  // Reset page when filter or sort changes
  useEffect(() => {
    setState(prev => ({ ...prev, currentPage: 1 }));
  }, [state.filter, state.sort]);

  // Query for fetching reminders with 15-second polling
  const { data, isLoading, error } = useQuery({
    queryKey: ["reminders", state.filter, state.sort, state.currentPage, PER_PAGE],
    queryFn: () => fetchReminders(state.filter, state.currentPage, PER_PAGE, state.sort === "-" ? undefined : state.sort),
    refetchInterval: 15000, // Poll every 15 seconds
  });

  // Scroll to top when data finishes loading (not during loading state)
  useEffect(() => {
    if (!isLoading && remindersContainerRef.current) {
      remindersContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isLoading]);

  // Mutation for creating reminders
  const createMutation = useMutation({
    mutationFn: createReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      setState(prev => ({ ...prev, showDialog: false, showQuickCreateDialog: false }));
    },
  });

  // Mutation for editing reminders (TODO: implement updateReminder API)
  const editMutation = useMutation({
    mutationFn: async (_data: any) => {
      // TODO: Implement update reminder API call
      // return updateReminder(editingReminder?.id, _data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      setState(prev => ({ ...prev, showEditDialog: false, editingReminder: null }));
    },
  });

  // Mutation for deleting reminders
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReminder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      setState(prev => ({ ...prev, showDeleteDialog: false, deletingReminder: null }));
    },
  });

  const reminders = data?.items ?? [];
  const totalItems = data?.total_items ?? 0;
  const totalPages = Math.ceil(totalItems / PER_PAGE);

  function handleFilterChange(newFilter: string) {
    setState(prev => ({ ...prev, filter: newFilter as FilterType }));
  }

  function handleSortChange(newSort: string) {
    setState(prev => ({ ...prev, sort: newSort as SortType }));
  }

  function handleEditClick(reminder: Reminder) {
    setState(prev => ({ ...prev, editingReminder: reminder, showEditDialog: true }));
  }

  function handleDeleteClick(reminder: Reminder) {
    setState(prev => ({ ...prev, deletingReminder: reminder, showDeleteDialog: true }));
  }

  function handleDeleteConfirm() {
    if (state.deletingReminder) {
      deleteMutation.mutate(state.deletingReminder.id);
    }
  }

  return (
    <section className="relative bg-background py-20">
      {/* Subtle gradient transition from hero */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Reminders Dashboard</h2>
            {totalItems > 0 && (
              <p className="text-sm text-muted-foreground mt-1">Total reminders: {totalItems}</p>
            )}
          </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setState(prev => ({ ...prev, showQuickCreateDialog: true }))}>
            Quick Create (1 min)
          </Button>
          <Button onClick={() => setState(prev => ({ ...prev, showDialog: true }))}>Create Reminder</Button>
        </div>
      </div>
      <ReminderFilterSort
        value={state.filter}
        onChange={handleFilterChange}
        sort={state.sort}
        onSortChange={handleSortChange}
      />
      <div ref={remindersContainerRef} className="mt-6 grid gap-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading reminders...</div>
        ) : error ? (
          <div className="text-center text-destructive">{error instanceof Error ? error.message : "Failed to load reminders"}</div>
        ) : reminders.length === 0 ? (
          <EmptyReminders filter={state.filter} />
        ) : (
          reminders.map((r: Reminder) => <ReminderCard key={r.id} reminder={r} onEdit={handleEditClick} onDelete={handleDeleteClick} />)
        )}
      </div>

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="mt-8 border-t pt-6">
          <div className="flex flex-col gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {reminders.length === 0 ? 0 : (state.currentPage - 1) * PER_PAGE + 1} to {Math.min(state.currentPage * PER_PAGE, totalItems)} of {totalItems} reminders
            </div>
            {totalPages > 1 && (
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setState(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
                  disabled={state.currentPage === 1 || isLoading}
                >
                  <NavArrowLeft width={16} height={16} />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={page === state.currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setState(prev => ({ ...prev, currentPage: page }))}
                      disabled={isLoading}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setState(prev => ({ ...prev, currentPage: Math.min(totalPages, prev.currentPage + 1) }))}
                  disabled={state.currentPage === totalPages || isLoading}
                >
                  Next
                  <NavArrowRight width={16} height={16} />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <ReminderFormDialog
        open={state.showDialog}
        onClose={() => setState(prev => ({ ...prev, showDialog: false }))}
        onSubmit={(data) => createMutation.mutate(data)}
      />
      <ReminderFormDialog
        open={state.showQuickCreateDialog}
        onClose={() => setState(prev => ({ ...prev, showQuickCreateDialog: false }))}
        onSubmit={(data) => createMutation.mutate(data)}
        quickCreate={true}
        title="Quick Create Reminder (1 minute)"
      />
      <ReminderFormDialog
        open={state.showEditDialog}
        onClose={() => setState(prev => ({ ...prev, showEditDialog: false, editingReminder: null }))}
        onSubmit={(data) => editMutation.mutate(data)}
        initial={state.editingReminder}
        title="Edit Reminder"
      />
        <DeleteReminderDialog
          open={state.showDeleteDialog}
          onClose={() => setState(prev => ({ ...prev, showDeleteDialog: false, deletingReminder: null }))}
          onConfirm={handleDeleteConfirm}
          reminder={state.deletingReminder}
          isDeleting={deleteMutation.isPending}
        />
      </div>
    </section>
  );
}
