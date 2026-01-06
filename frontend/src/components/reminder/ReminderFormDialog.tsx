import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { PhoneInput } from "../ui/PhoneInput";
import { timezones } from "../../constants/timezones";
import { getTimezoneOffset, format } from "date-fns-tz";

interface ReminderFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initial?: any;
  quickCreate?: boolean;
  title?: string;
}

interface FormState {
  title: string;
  message: string;
  phone: string;
  datetime: string;
  timezone: string;
  errors: Record<string, string>;
}

function findMatchingTimezone(tz: string): string {
  // Check if timezone exists in our list
  const exactMatch = timezones.find(t => t.tz === tz);
  if (exactMatch) return tz;

  // Find timezone with matching UTC offset using date-fns-tz
  const now = new Date();
  const targetOffset = getTimezoneOffset(tz, now);

  const matchingTz = timezones.find(t => {
    const tzOffset = getTimezoneOffset(t.tz, now);
    return tzOffset === targetOffset;
  });

  return matchingTz?.tz || "Europe/London";
}

function formatDatetimeForTimezone(date: Date, timezone: string): string {
  // Format date directly in the target timezone (returns "yyyy-MM-ddTHH:mm" format)
  return format(date, "yyyy-MM-dd'T'HH:mm", { timeZone: timezone });
}

function getInitialFormState(initial: any, quickCreate: boolean): FormState {
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Determine timezone
  let timezone = initial?.timezone || "";

  // If timezone is provided, find matching timezone in our list
  if (timezone) {
    timezone = findMatchingTimezone(timezone);
  } else {
    // No timezone provided, use detected timezone
    timezone = findMatchingTimezone(detected);
  }

  // Determine datetime
  let datetime = initial?.datetime || (initial?.scheduled_time ? initial.scheduled_time.slice(0, 16) : "");
  if (quickCreate && !datetime) {
    const now = new Date();
    const oneMinuteLater = new Date(now.getTime() + 60000);
    // Format datetime in the selected timezone
    datetime = formatDatetimeForTimezone(oneMinuteLater, timezone);
  }

  return {
    title: initial?.title || "",
    message: initial?.message || "",
    phone: initial?.phone || initial?.phone_number || "",
    datetime,
    timezone,
    errors: {},
  };
}

export function ReminderFormDialog({ open, onClose, onSubmit, initial, quickCreate = false, title: customTitle }: ReminderFormProps) {
  const [form, setForm] = useState<FormState>(getInitialFormState(initial, quickCreate));

  useEffect(() => {
    if (open) {
      setForm(getInitialFormState(initial, quickCreate));
    }
  }, [open, initial, quickCreate]);

  function getQuickCreateDatetime(timezone: string): string {
    const now = new Date();
    const oneMinuteLater = new Date(now.getTime() + 60000);
    return formatDatetimeForTimezone(oneMinuteLater, timezone);
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.message) errs.message = "Message required";
    if (!/^\+\d{10,15}$/.test(form.phone)) errs.phone = "Invalid phone (E.164)";
    if (!form.title) errs.title = "Title required";
    // Skip datetime validation for quickCreate (we'll set it fresh at submit time)
    if (!quickCreate && (!form.datetime || new Date(form.datetime) <= new Date())) {
      errs.datetime = "Date/time must be in the future";
    }
    if (!form.timezone) errs.timezone = "Timezone required";
    setForm(prev => ({ ...prev, errors: errs }));
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    // For quickCreate, always use fresh datetime (1 min from now) at submit time
    const datetime = quickCreate ? getQuickCreateDatetime(form.timezone) : form.datetime;
    onSubmit({ title: form.title, message: form.message, phone: form.phone, datetime, timezone: form.timezone });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{customTitle || (initial ? "Edit Reminder" : "Create Reminder")}</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input placeholder="Title" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} />
          {form.errors.title && <div className="text-red-500 text-xs">{form.errors.title}</div>}
          <Input placeholder="Message" value={form.message} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))} />
          {form.errors.message && <div className="text-red-500 text-xs">{form.errors.message}</div>}
          <PhoneInput
            value={form.phone}
            onChange={(data: { phone: string }) => setForm(prev => ({ ...prev, phone: data.phone }))}
          />
          {form.errors.phone && <div className="text-red-500 text-xs">{form.errors.phone}</div>}

          {!quickCreate && (
            <>
              <Input type="datetime-local" value={form.datetime} onChange={e => setForm(prev => ({ ...prev, datetime: e.target.value }))} />
              {form.errors.datetime && <div className="text-red-500 text-xs">{form.errors.datetime}</div>}
              <select
                className="border rounded-md px-3 py-2 text-base focus-visible:border-ring focus-visible:ring-ring/50 w-full"
                value={form.timezone}
                onChange={e => setForm(prev => ({ ...prev, timezone: e.target.value }))}
              >
                {timezones.map(tz => (
                  <option key={tz.tz} value={tz.tz}>{tz.label}</option>
                ))}
              </select>
              {form.errors.timezone && <div className="text-red-500 text-xs">{form.errors.timezone}</div>}
            </>
          )}

          <Button type="submit" className="mt-2">{initial ? "Save" : "Create"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
