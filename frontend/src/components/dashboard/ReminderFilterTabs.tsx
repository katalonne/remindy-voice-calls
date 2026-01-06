import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const filters = [
  { value: "all", label: "All" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

export function ReminderFilterTabs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Tabs value={value} onValueChange={onChange} className="w-full">
      <TabsList>
        {filters.map(f => (
          <TabsTrigger key={f.value} value={f.value}>{f.label}</TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
