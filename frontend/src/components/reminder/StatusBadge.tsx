import { Badge } from "../ui/badge";
import { ReminderStatus } from "../../types/reminder";

const statusMap: Record<ReminderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  scheduled: { label: "Scheduled", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
  failed: { label: "Failed", variant: "destructive" },
};

export function ReminderStatusBadge({ status }: { status: ReminderStatus }) {
  const { label, variant } = statusMap[status];
  return (
    <Badge variant={variant}>{label}</Badge>
  );
}
