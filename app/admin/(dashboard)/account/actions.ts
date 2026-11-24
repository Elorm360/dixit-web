"use server";

import { requireStaff } from "@/lib/admin";

export type PasswordState = { error?: string; ok?: boolean } | null;

export async function changePassword(_prev: PasswordState, formData: FormData): Promise<PasswordState> {
  const { supabase, email } = await requireStaff();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 10) return { error: "Use at least 10 characters." };
  if (next !== confirm) return { error: "The new passwords don’t match." };
  if (next === current) return { error: "Choose a password different from your current one." };

  // Confirm it's really them before changing it.
  const { error: authError } = await supabase.auth.signInWithPassword({ email, password: current });
  if (authError) return { error: "Your current password is incorrect." };

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) return { error: error.message.includes("weak") ? "That password is too easy to guess. Try a longer one." : "Could not change your password. Please try again." };
  return { ok: true };
}
