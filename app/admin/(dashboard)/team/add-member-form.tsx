"use client";

import { useActionState, useEffect, useRef } from "react";
import { adminButtonPrimary } from "@/components/admin/ui";
import { addTeamMember } from "./actions";

export function AddMemberForm() {
  const [state, action, pending] = useActionState(addTeamMember, null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) form.current?.reset();
  }, [state]);

  return (
    <form ref={form} action={action} className="grid gap-4 md:grid-cols-[1fr_12rem_auto] md:items-end">
      <label className="block">
        <span className="kd-label">Email</span>
        <input name="email" type="email" required autoComplete="off" className="kd-input" placeholder="name@example.com" />
      </label>
      <label className="block">
        <span className="kd-label">Role</span>
        <select name="role" defaultValue="staff" className="kd-input">
          <option value="staff">Staff</option>
          <option value="super_admin">Super admin</option>
        </select>
      </label>
      <button type="submit" disabled={pending} className={`${adminButtonPrimary} min-h-14`}>{pending ? "Adding…" : "Give access"}</button>
      {state?.error && <p className="text-sm text-red-700 md:col-span-3" role="alert">{state.error}</p>}
      {state?.ok && <p className="text-sm text-emerald-800 md:col-span-3" role="status">{state.ok}</p>}
    </form>
  );
}
