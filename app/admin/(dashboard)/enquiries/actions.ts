"use server";

import { revalidatePath } from "next/cache";
import { fromDateTimeLocal, isMissingColumn, requireStaff } from "@/lib/admin";
import { ENQUIRY_STATUSES } from "@/lib/enquiry-status";

export async function updateEnquiry(id: string, _prev: { ok?: boolean; error?: string } | null, formData: FormData) {
  const { supabase } = await requireStaff();
  let status = String(formData.get("status") ?? "");
  const notes = String(formData.get("notes") ?? "").slice(0, 10000);
  const bookingRaw = String(formData.get("consultation_at") ?? "").trim();
  if (!ENQUIRY_STATUSES.some((s) => s.value === status)) return { error: "Choose a valid status." };

  const consultationAt = bookingRaw ? fromDateTimeLocal(bookingRaw) : null;
  if (bookingRaw && !consultationAt) return { error: "Enter a valid consultation date and time." };
  // Booking a time moves a new/contacted enquiry to "Consultation booked".
  if (consultationAt && (status === "new" || status === "contacted")) status = "scheduled";

  const base = { status, notes: notes || null, updated_at: new Date().toISOString() };
  let { error } = await supabase.from("consultation_requests").update({ ...base, consultation_at: consultationAt }).eq("id", id);
  if (isMissingColumn(error)) {
    if (consultationAt) return { error: "Booking times need a quick database update first (see the setup notes). Status and notes were not saved." };
    ({ error } = await supabase.from("consultation_requests").update(base).eq("id", id));
  }
  if (error) return { error: "Could not save. Please try again." };

  revalidatePath("/admin", "layout");
  return { ok: true };
}
