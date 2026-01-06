import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const filters = [
  { value: "all", label: "All" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

const sortOptions = [
  { value: "-", label: "Default" },
  { value: "ascending", label: "Ascending" },
  { value: "descending", label: "Descending" },
];

export function ReminderFilterSort({
  value,
  onChange,
  sort,
  onSortChange,
}: {
  value: string;
  onChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Tabs value={value} onValueChange={onChange} className="flex-1">
        <TabsList>
          {filters.map(f => (
            <TabsTrigger key={f.value} value={f.value}>{f.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Select value={sort || "-"} onValueChange={onSortChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
