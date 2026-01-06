import { Card } from "../card";

export function EmptyReminders({ filter }: { filter: string }) {
  let message = "No reminders found.";
  if (filter === "scheduled") message = "No upcoming reminders. Time to relax!";
  if (filter === "completed") message = "No completed reminders yet.";
  if (filter === "failed") message = "No failed reminders. All good!";
  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center gap-2 bg-muted/30 border-0 shadow-none">
      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mx-auto text-muted-foreground/40"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      <div className="font-medium text-muted-foreground">{message}</div>
    </Card>
  );
}
