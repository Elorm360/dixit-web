"use client";

import { adminButtonOutline } from "@/components/admin/ui";

export function DeleteButton({ action, confirmText = "Delete this piece and its photos? This can’t be undone." }: { action: () => Promise<void>; confirmText?: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <button className={`${adminButtonOutline} text-red-700 hover:border-red-700`}>Delete</button>
    </form>
  );
}
