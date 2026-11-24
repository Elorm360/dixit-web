"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/admin";

export type TeamFormState = { error?: string; ok?: string } | null;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function addTeamMember(_prev: TeamFormState, formData: FormData): Promise<TeamFormState> {
  const { supabase } = await requireSuperAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "staff");
  if (!EMAIL.test(email)) return { error: "Enter a valid email address." };
  if (role !== "staff" && role !== "super_admin") return { error: "Choose a role." };

  const { error } = await supabase.rpc("grant_staff", { p_email: email, p_role: role });
  if (error) {
    if (error.message.includes("no_account")) {
      return { error: "There’s no account with that email yet. Create it first in Supabase (see the steps on this page), then add it here." };
    }
    return { error: error.message || "Could not add that person." };
  }
  revalidatePath("/admin/team");
  return { ok: `${email} now has ${role === "super_admin" ? "super admin" : "staff"} access.` };
}

export async function changeRole(email: string, role: "staff" | "super_admin") {
  const { supabase } = await requireSuperAdmin();
  await supabase.rpc("grant_staff", { p_email: email, p_role: role });
  revalidatePath("/admin/team");
}

export async function removeTeamMember(userId: string) {
  const { supabase } = await requireSuperAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(userId)) return;
  await supabase.rpc("revoke_staff", { p_user_id: userId });
  revalidatePath("/admin/team");
}
