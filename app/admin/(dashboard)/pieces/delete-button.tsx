"use client";

import { adminButtonOutline } from "@/components/admin/ui";

export function DeleteButton({ action }: { action: () => Promise<void> }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this piece and its photos? This can’t be undone.")) e.preventDefault();
      }}
    >
      <button className={`${adminButtonOutline} text-red-700 hover:border-red-700`}>Delete</button>
    </form>
  );
}
