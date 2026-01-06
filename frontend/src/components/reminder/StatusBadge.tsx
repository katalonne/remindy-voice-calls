import { Badge } from "../ui/badge";
import { ReminderStatus } from "../../types/reminder";

const statusMap: Record<ReminderStatus, { label: string; color: string }> = {
  scheduled: { label: "Scheduled", color: "bg-blue-500" },
  completed: { label: "Completed", color: "bg-green-500" },
  failed: { label: "Failed", color: "bg-red-500" },
};

export function ReminderStatusBadge({ status }: { status: ReminderStatus }) {
  const { label, color } = statusMap[status];
  return (
    <Badge className={`${color} text-white`}>{label}</Badge>
  );
}
