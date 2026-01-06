"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Reminder } from "../../types/reminder";

interface DeleteReminderDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reminder: Reminder | null;
  isDeleting?: boolean;
}

export function DeleteReminderDialog({
  open,
  onClose,
  onConfirm,
  reminder,
  isDeleting = false,
}: DeleteReminderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Reminder</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the reminder &quot;{reminder?.title}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

