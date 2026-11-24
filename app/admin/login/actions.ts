"use server";

import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export async function signIn(_prev: { error: string } | null, formData: FormData) {
  if (!supabaseConfigured()) return { error: "Supabase is not configured for this site yet." };

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Those details don’t match a DIXIT staff account." };

  const { data: isStaff } = await supabase.rpc("is_staff");
  if (!isStaff) {
    await supabase.auth.signOut();
    return { error: "This account doesn’t have dashboard access. Ask an administrator to add you." };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
