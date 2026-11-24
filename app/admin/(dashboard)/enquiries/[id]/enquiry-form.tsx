"use client";

import { useActionState } from "react";
import { adminButtonPrimary } from "@/components/admin/ui";
import { ENQUIRY_STATUSES } from "@/lib/enquiry-status";
import { updateEnquiry } from "../actions";

export function EnquiryForm({ id, status, notes, consultationAt }: { id: string; status: string; notes: string; consultationAt: string }) {
  const [state, action, pending] = useActionState(updateEnquiry.bind(null, id), null);

  return (
    <form action={action} className="space-y-5">
      <label className="block">
        <span className="kd-label">Status</span>
        <select name="status" defaultValue={status} className="kd-input">
          {ENQUIRY_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="kd-label">Confirmed consultation (Accra time)</span>
        <input name="consultation_at" type="datetime-local" defaultValue={consultationAt} className="kd-input" />
        <span className="mt-1 block text-xs text-kd-gray">Set once you’ve agreed a time with the client. It appears on the calendar, and the status moves to “Consultation booked”. Clear it to cancel.</span>
      </label>
      <label className="block">
        <span className="kd-label">Internal notes</span>
        <textarea name="notes" defaultValue={notes} rows={7} className="kd-input resize-y" placeholder="Measurements, fabric choices, quotes, follow-ups… (only visible to staff)" />
      </label>
      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className={adminButtonPrimary}>{pending ? "Saving…" : "Save changes"}</button>
        {state?.ok && !pending && <span className="text-sm text-emerald-700" role="status">Saved</span>}
        {state?.error && <span className="text-sm text-red-700" role="alert">{state.error}</span>}
      </div>
    </form>
  );
}
