"use client";

import { useActionState, useRef, useState, type ReactNode } from "react";
import { adminButtonOutline, adminButtonPrimary } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/client";

type Action = (prev: { ok?: boolean; error?: string } | null, fd: FormData) => Promise<{ ok?: boolean; error?: string } | null>;

/** A form with its own Save button and "Saved" / error message. */
export function SectionForm({ action, children, saveLabel = "Save" }: { action: Action; children: ReactNode; saveLabel?: string }) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className="space-y-5">
      {children}
      <div className="flex items-center gap-4 border-t border-kd-black/10 pt-5">
        <button type="submit" disabled={pending} className={adminButtonPrimary}>{pending ? "Saving…" : saveLabel}</button>
        {state?.ok && !pending && <span className="text-sm text-emerald-700" role="status">Saved — live on the website now.</span>}
        {state?.error && <span className="text-sm text-red-700" role="alert">{state.error}</span>}
      </div>
    </form>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="kd-label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-kd-gray">{hint}</span>}
    </label>
  );
}

const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/**
 * Uploads a photo to the "site" bucket and stores its path in a hidden input.
 * `fallback` is shown (and kept) when no photo has been uploaded.
 */
export function PhotoField({
  name,
  folder,
  label,
  hint,
  initialPath,
  storageBase,
  fallback,
  aspect = "aspect-[4/5]",
}: {
  name: string;
  folder: "hero" | "founder" | "journal";
  label: string;
  hint?: string;
  initialPath: string;
  storageBase: string;
  fallback?: string;
  aspect?: string;
}) {
  const [path, setPath] = useState(initialPath);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const src = path ? `${storageBase}/${path}` : fallback;

  async function upload(file: File | undefined) {
    if (!file) return;
    setError("");
    if (!TYPES.includes(file.type)) return setError("Use a JPG, PNG, WebP or AVIF photo.");
    if (file.size > 10 * 1024 * 1024) return setError("That photo is over 10 MB.");
    setBusy(true);
    const ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
    const next = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await createClient().storage.from("site").upload(next, file, { contentType: file.type, cacheControl: "31536000" });
    setBusy(false);
    if (input.current) input.current.value = "";
    if (upErr) return setError("Upload failed. Check your connection and try again.");
    setPath(next);
  }

  return (
    <div>
      <span className="kd-label">{label}</span>
      <input type="hidden" name={name} value={path} />
      <div className="flex flex-wrap items-end gap-4">
        <div className={`relative w-40 overflow-hidden border border-kd-black/10 bg-kd-cream ${aspect}`}>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element -- preview of a just-uploaded file
            <img src={src} alt="" className="h-full w-full object-cover object-top" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center p-3 text-center text-xs text-kd-gray">No photo</span>
          )}
          {busy && <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-xs">Uploading…</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label className={`${adminButtonOutline} cursor-pointer`}>
            {path ? "Replace photo" : "Upload photo"}
            <input ref={input} type="file" accept={TYPES.join(",")} className="sr-only" disabled={busy} onChange={(e) => upload(e.target.files?.[0])} />
          </label>
          {path && (
            <button type="button" onClick={() => setPath("")} className="text-left text-xs text-red-700 hover:underline">
              {fallback ? "Use the default photo" : "Remove photo"}
            </button>
          )}
        </div>
      </div>
      {hint && <p className="mt-2 text-xs text-kd-gray">{hint}</p>}
      {error && <p className="mt-2 text-sm text-red-700" role="alert">{error}</p>}
      {path !== initialPath && !busy && <p className="mt-2 text-xs text-amber-800">Remember to save to put the new photo live.</p>}
    </div>
  );
}
