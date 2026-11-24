"use client";

import { useActionState, useEffect, useRef } from "react";
import { adminButtonPrimary } from "@/components/admin/ui";
import { changePassword } from "./actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) form.current?.reset();
  }, [state]);

  return (
    <form ref={form} action={action} className="max-w-md space-y-5">
      <label className="block">
        <span className="kd-label">Current password</span>
        <input name="current" type="password" required autoComplete="current-password" className="kd-input" />
      </label>
      <label className="block">
        <span className="kd-label">New password</span>
        <input name="password" type="password" required minLength={10} autoComplete="new-password" className="kd-input" />
        <span className="mt-1 block text-xs text-kd-gray">At least 10 characters. A short phrase is easier to remember than random symbols.</span>
      </label>
      <label className="block">
        <span className="kd-label">Confirm new password</span>
        <input name="confirm" type="password" required minLength={10} autoComplete="new-password" className="kd-input" />
      </label>
      {state?.error && <p className="text-sm text-red-700" role="alert">{state.error}</p>}
      {state?.ok && <p className="text-sm text-emerald-800" role="status">Password changed. Use the new one next time you sign in.</p>}
      <button type="submit" disabled={pending} className={adminButtonPrimary}>{pending ? "Saving…" : "Change password"}</button>
    </form>
  );
}
