"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/admin";
import { ENQUIRY_STATUSES } from "@/lib/enquiry-status";

export async function updateEnquiry(id: string, _prev: { ok?: boolean; error?: string } | null, formData: FormData) {
  const { supabase } = await requireStaff();
  const status = String(formData.get("status") ?? "");
  const notes = String(formData.get("notes") ?? "").slice(0, 10000);
  if (!ENQUIRY_STATUSES.some((s) => s.value === status)) return { error: "Choose a valid status." };

  const { error } = await supabase
    .from("consultation_requests")
    .update({ status, notes: notes || null, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: "Could not save. Please try again." };

  revalidatePath("/admin", "layout");
  return { ok: true };
}
