"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { adminButtonOutline, adminButtonPrimary } from "@/components/admin/ui";
import { collectionCategories } from "@/data/collections";
import { createClient } from "@/lib/supabase/client";
import { createDraftPieces } from "../actions";

const MAX_BYTES = 10 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const EXTRA_SUFFIX = /--\d+$/;
// "01-jacket" — an optional number at the start, used only to control upload order.
const ORDER_PREFIX = /^\d+[-_ ]+/;

type Group = { key: string; name: string; files: File[] };

function slugify(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

function titleFromFile(base: string) {
  return base.replace(ORDER_PREFIX, "").replace(/[-_]+/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase()) || "Untitled piece";
}

/** Groups files into pieces: "jacket.jpg" + "jacket--2.jpg" become one piece with two photos. */
function groupFiles(files: File[]): Group[] {
  const groups = new Map<string, Group>();
  for (const file of [...files].sort((a, b) => a.name.localeCompare(b.name))) {
    const base = file.name.replace(/\.[^.]+$/, "");
    const stem = base.replace(EXTRA_SUFFIX, "");
    // "01-jacket.jpg" and "jacket--2.jpg" belong to the same piece.
    const key = slugify(stem.replace(ORDER_PREFIX, "")) || crypto.randomUUID();
    const group = groups.get(key) ?? { key, name: titleFromFile(stem), files: [] };
    if (EXTRA_SUFFIX.test(base)) group.files.push(file);
    else group.files.unshift(file);
    groups.set(key, group);
  }
  return [...groups.values()];
}

export function BulkUploader({ initialCollection }: { initialCollection: string }) {
  const router = useRouter();
  const [collection, setCollection] = useState(initialCollection);
  const [groups, setGroups] = useState<Group[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const previews = useMemo(() => new Map(groups.map((g) => [g.key, URL.createObjectURL(g.files[0])])), [groups]);
  const photoCount = groups.reduce((n, g) => n + g.files.length, 0);

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    const ok: File[] = [];
    const bad: string[] = [];
    for (const f of list) {
      if (!TYPES.includes(f.type)) bad.push(`${f.name} — use JPG, PNG, WebP or AVIF`);
      else if (f.size > MAX_BYTES) bad.push(`${f.name} — over 10 MB`);
      else ok.push(f);
    }
    setRejected(bad);
    setGroups((prev) => groupFiles([...prev.flatMap((g) => g.files), ...ok]));
    if (input.current) input.current.value = "";
  }

  async function submit() {
    if (!groups.length) return;
    setError("");
    const supabase = createClient();
    const total = photoCount;
    let done = 0;
    setProgress({ done, total });

    try {
      const drafts = [];
      for (const g of groups) {
        const images: string[] = [];
        for (const file of g.files) {
          const ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
          const path = `${collection}/${crypto.randomUUID()}.${ext}`;
          const { error: upErr } = await supabase.storage.from("pieces").upload(path, file, { contentType: file.type, cacheControl: "31536000" });
          if (upErr) throw new Error(`${file.name} failed to upload. Check your connection and try again.`);
          images.push(path);
          setProgress({ done: ++done, total });
        }
        drafts.push({ name: g.name.trim() || "Untitled piece", slug: slugify(g.name) || `piece-${drafts.length + 1}`, images });
      }
      const res = await createDraftPieces(collection, drafts);
      if (res.error) throw new Error(res.error);
      router.push(`/admin/pieces?added=${res.created}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
      setProgress(null);
    }
  }

  const busy = progress !== null;

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_20rem]">
      <section className="border border-kd-black/10 bg-kd-white p-6 md:p-8">
        <label
          className={`flex cursor-pointer flex-col items-center justify-center border-2 border-dashed px-6 py-14 text-center transition-colors ${busy ? "pointer-events-none opacity-50" : "border-kd-black/15 hover:border-kd-gold-dark hover:bg-kd-cream"}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }}
        >
          <span className="font-display text-2xl">Drop photos here</span>
          <span className="mt-2 max-w-md text-xs leading-5 text-kd-gray">
            Each photo becomes a piece named from its filename. Extra angles of one piece: name them <code>jacket.jpg</code>, <code>jacket--2.jpg</code>, <code>jacket--3.jpg</code>.
          </span>
          <input ref={input} type="file" accept={TYPES.join(",")} multiple className="sr-only" onChange={(e) => addFiles(e.target.files)} disabled={busy} />
        </label>

        {rejected.length > 0 && (
          <ul className="mt-4 space-y-1 text-sm text-red-700" role="alert">
            {rejected.map((r) => <li key={r}>Skipped {r}</li>)}
          </ul>
        )}

        {groups.length > 0 && (
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {groups.map((g) => (
              <li key={g.key} className="border border-kd-black/10">
                <div className="relative aspect-[3/4] overflow-hidden bg-kd-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local preview of a file not yet uploaded */}
                  <img src={previews.get(g.key)} alt="" className="h-full w-full object-cover object-top" />
                  {g.files.length > 1 && <span className="absolute left-2 top-2 bg-kd-black/80 px-2 py-0.5 text-[0.6rem] text-kd-white">{g.files.length} photos</span>}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setGroups((prev) => prev.filter((x) => x.key !== g.key))}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-kd-black/60 text-sm text-white hover:bg-kd-black"
                    aria-label={`Remove ${g.name}`}
                  >
                    ×
                  </button>
                </div>
                <input
                  value={g.name}
                  disabled={busy}
                  maxLength={120}
                  onChange={(e) => setGroups((prev) => prev.map((x) => (x.key === g.key ? { ...x, name: e.target.value } : x)))}
                  className="w-full border-0 border-t border-kd-black/10 px-3 py-2 text-sm outline-none focus:bg-kd-cream"
                  aria-label="Piece name"
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className="h-fit space-y-5 border border-kd-black/10 bg-kd-white p-6 xl:sticky xl:top-8">
        <label className="block">
          <span className="kd-label">Add to collection</span>
          <select value={collection} onChange={(e) => setCollection(e.target.value)} disabled={busy} className="kd-input">
            {collectionCategories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </label>
        <p className="text-sm text-kd-gray">
          {groups.length ? `${groups.length} piece${groups.length === 1 ? "" : "s"} · ${photoCount} photo${photoCount === 1 ? "" : "s"}` : "No photos chosen yet."}
          <br />
          Pieces are added as <strong>hidden drafts</strong>. Add prices and details, then publish.
        </p>
        {progress && (
          <div role="status" aria-live="polite">
            <div className="h-1.5 w-full bg-kd-cream"><div className="h-full bg-kd-gold-dark transition-[width]" style={{ width: `${(progress.done / progress.total) * 100}%` }} /></div>
            <p className="mt-2 text-xs text-kd-gray">Uploading {progress.done} of {progress.total}…</p>
          </div>
        )}
        {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
        <div className="flex gap-2">
          <button type="button" onClick={submit} disabled={busy || groups.length === 0} className={adminButtonPrimary}>
            {busy ? "Uploading…" : `Add ${groups.length || ""} piece${groups.length === 1 ? "" : "s"}`}
          </button>
          <button type="button" onClick={() => router.push("/admin/pieces")} disabled={busy} className={adminButtonOutline}>Cancel</button>
        </div>
      </aside>
    </div>
  );
}
