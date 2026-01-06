"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { ReminderCard } from "../reminder/ReminderCard";
import { EmptyReminders } from "../ui/empty-states/EmptyReminders";
import { ReminderFormDialog } from "../reminder/ReminderFormDialog";
import { DeleteReminderDialog } from "../reminder/DeleteReminderDialog";
import { ReminderFilterTabs } from "./ReminderFilterTabs";
import { Reminder } from "../../types/reminder";
import { fetchReminders, createReminder, deleteReminder } from "../../lib/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

type FilterType = "all" | "scheduled" | "completed" | "failed";

const PER_PAGE = 25;

export function Dashboard() {
  const queryClient = useQueryClient();

  // UI State
  const [filter, setFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [showQuickCreateDialog, setShowQuickCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingReminder, setDeletingReminder] = useState<Reminder | null>(null);

  // Query for fetching reminders
  const { data, isLoading, error } = useQuery({
    queryKey: ["reminders", filter, currentPage, PER_PAGE],
    queryFn: () => fetchReminders(filter, currentPage, PER_PAGE),
  });

  // Mutation for creating reminders
  const createMutation = useMutation({
    mutationFn: createReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      setShowDialog(false);
      setShowQuickCreateDialog(false);
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
      setShowEditDialog(false);
      setEditingReminder(null);
    },
  });

  // Mutation for deleting reminders
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReminder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      setShowDeleteDialog(false);
      setDeletingReminder(null);
    },
  });

  const reminders = data?.items ?? [];
  const totalItems = data?.total_items ?? 0;
  const totalPages = Math.ceil(totalItems / PER_PAGE);

  function handleFilterChange(newFilter: string) {
    setFilter(newFilter as FilterType);
    setCurrentPage(1);
  }

  function handleEditClick(reminder: Reminder) {
    setEditingReminder(reminder);
    setShowEditDialog(true);
  }

  function handleDeleteClick(reminder: Reminder) {
    setDeletingReminder(reminder);
    setShowDeleteDialog(true);
  }

  function handleDeleteConfirm() {
    if (deletingReminder) {
      deleteMutation.mutate(deletingReminder.id);
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
          <Button variant="outline" onClick={() => setShowQuickCreateDialog(true)}>
            Quick Create (1 min)
          </Button>
          <Button onClick={() => setShowDialog(true)}>Create Reminder</Button>
        </div>
      </div>
      <ReminderFilterTabs
        value={filter}
        onChange={handleFilterChange}
      />
      <div className="mt-6 grid gap-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading reminders...</div>
        ) : error ? (
          <div className="text-center text-destructive">{error instanceof Error ? error.message : "Failed to load reminders"}</div>
        ) : reminders.length === 0 ? (
          <EmptyReminders filter={filter} />
        ) : (
          reminders.map((r: Reminder) => <ReminderCard key={r.id} reminder={r} onEdit={handleEditClick} onDelete={handleDeleteClick} />)
        )}
      </div>

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="mt-8 border-t pt-6">
          <div className="flex flex-col gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {reminders.length === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1} to {Math.min(currentPage * PER_PAGE, totalItems)} of {totalItems} reminders
            </div>
            {totalPages > 1 && (
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isLoading}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      disabled={isLoading}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || isLoading}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <ReminderFormDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onSubmit={(data) => createMutation.mutate(data)}
      />
      <ReminderFormDialog
        open={showQuickCreateDialog}
        onClose={() => setShowQuickCreateDialog(false)}
        onSubmit={(data) => createMutation.mutate(data)}
        quickCreate={true}
        title="Quick Create Reminder (1 minute)"
      />
      <ReminderFormDialog
        open={showEditDialog}
        onClose={() => { setShowEditDialog(false); setEditingReminder(null); }}
        onSubmit={(data) => editMutation.mutate(data)}
        initial={editingReminder}
        title="Edit Reminder"
      />
        <DeleteReminderDialog
          open={showDeleteDialog}
          onClose={() => { setShowDeleteDialog(false); setDeletingReminder(null); }}
          onConfirm={handleDeleteConfirm}
          reminder={deletingReminder}
          isDeleting={deleteMutation.isPending}
        />
      </div>
    </section>
  );
}
