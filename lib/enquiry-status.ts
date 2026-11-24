export const ENQUIRY_STATUSES = [
  { value: "new", label: "New", tone: "bg-kd-gold text-kd-black" },
  { value: "contacted", label: "Contacted", tone: "bg-sky-100 text-sky-900" },
  { value: "scheduled", label: "Consultation booked", tone: "bg-violet-100 text-violet-900" },
  { value: "in_progress", label: "In progress", tone: "bg-amber-100 text-amber-900" },
  { value: "completed", label: "Completed", tone: "bg-emerald-100 text-emerald-900" },
  { value: "archived", label: "Archived", tone: "bg-neutral-200 text-neutral-700" },
] as const;

export function statusMeta(value: string) {
  return ENQUIRY_STATUSES.find((s) => s.value === value) ?? { value, label: value, tone: "bg-neutral-200 text-neutral-700" };
}
