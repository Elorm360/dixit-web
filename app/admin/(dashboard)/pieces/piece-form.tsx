"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { adminButtonOutline, adminButtonPrimary } from "@/components/admin/ui";
import { collectionCategories } from "@/data/collections";
import { createClient } from "@/lib/supabase/client";
import { savePiece } from "./actions";

export type PieceDraft = {
  id: string | null;
  collection: string;
  name: string;
  slug: string;
  description: string;
  details: string[];
  price: number | null;
  images: string[];
  published: boolean;
  sort_order: number;
};

const MAX_BYTES = 10 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function slugify(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

export function PieceForm({ piece, storageBase, currencySymbol }: { piece: PieceDraft; storageBase: string; currencySymbol: string }) {
  const [state, action, pending] = useActionState(savePiece.bind(null, piece.id), null);
  const [name, setName] = useState(piece.name);
  const [slug, setSlug] = useState(piece.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(piece.id));
  const [collection, setCollection] = useState(piece.collection);
  const [images, setImages] = useState<string[]>(piece.images);
  const [uploading, setUploading] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploadError("");
    const supabase = createClient();
    const list = [...files];
    setUploading((n) => n + list.length);
    await Promise.all(
      list.map(async (file) => {
        try {
          if (!TYPES.includes(file.type)) throw new Error(`${file.name}: use JPG, PNG, WebP or AVIF.`);
          if (file.size > MAX_BYTES) throw new Error(`${file.name} is over 10 MB.`);
          const ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
          const path = `${collection}/${crypto.randomUUID()}.${ext}`;
          const { error } = await supabase.storage.from("pieces").upload(path, file, { contentType: file.type, cacheControl: "31536000" });
          if (error) throw new Error(`${file.name}: upload failed.`);
          setImages((prev) => [...prev, path]);
        } catch (e) {
          setUploadError(e instanceof Error ? e.message : "Upload failed.");
        } finally {
          setUploading((n) => n - 1);
        }
      }),
    );
    if (fileInput.current) fileInput.current.value = "";
  }

  function move(i: number, dir: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      [next[i], next[i + dir]] = [next[i + dir], next[i]];
      return next;
    });
  }

  return (
    <form action={action} className="grid gap-8 xl:grid-cols-[1.2fr_1fr]">
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <section className="border border-kd-black/10 bg-kd-white p-6 md:p-8">
        <h2 className="font-display mb-1 text-2xl">Photos</h2>
        <p className="mb-6 text-sm text-kd-gray">The first photo is the cover. Portrait (3:4) photos look best — keep the head near the top.</p>

        {images.length > 0 && (
          <ul className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((path, i) => (
              <li key={path} className="group relative">
                <div className="relative aspect-[3/4] overflow-hidden bg-kd-cream">
                  <Image src={`${storageBase}/${path}`} alt="" fill sizes="200px" className="object-cover object-top" />
                </div>
                {i === 0 && <span className="absolute left-2 top-2 bg-kd-black px-2 py-1 text-[0.55rem] uppercase tracking-[0.15em] text-kd-white">Cover</span>}
                <div className="mt-2 flex justify-between text-xs">
                  <div className="flex gap-1">
                    <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="border border-kd-black/15 px-2 py-1 disabled:opacity-30" aria-label="Move earlier">←</button>
                    <button type="button" disabled={i === images.length - 1} onClick={() => move(i, 1)} className="border border-kd-black/15 px-2 py-1 disabled:opacity-30" aria-label="Move later">→</button>
                  </div>
                  <button type="button" onClick={() => setImages((prev) => prev.filter((p) => p !== path))} className="text-red-700 hover:underline">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <label className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-kd-black/15 px-6 py-10 text-center transition-colors hover:border-kd-gold-dark hover:bg-kd-cream"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); upload(e.dataTransfer.files); }}
        >
          <span className="font-display text-xl">{uploading ? `Uploading ${uploading}…` : "Drop photos here"}</span>
          <span className="mt-1 text-xs text-kd-gray">or click to choose · JPG, PNG, WebP · up to 10 MB each</span>
          <input ref={fileInput} type="file" accept={TYPES.join(",")} multiple className="sr-only" onChange={(e) => upload(e.target.files)} />
        </label>
        {uploadError && <p className="mt-3 text-sm text-red-700" role="alert">{uploadError}</p>}
      </section>

      <section className="h-fit space-y-5 border border-kd-black/10 bg-kd-white p-6 md:p-8">
        <h2 className="font-display text-2xl">Details</h2>
        <label className="block">
          <span className="kd-label">Collection</span>
          <select name="collection" value={collection} onChange={(e) => setCollection(e.target.value)} className="kd-input" required>
            {collectionCategories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="kd-label">Name</span>
          <input name="name" value={name} maxLength={120} required className="kd-input"
            onChange={(e) => { setName(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); }} />
        </label>
        <label className="block">
          <span className="kd-label">Web address</span>
          <div className="flex items-stretch">
            <span className="flex items-center border border-r-0 border-kd-black/15 bg-kd-cream px-3 text-xs text-kd-gray">/{collection}/</span>
            <input name="slug" value={slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" className="kd-input"
              onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }} />
          </div>
        </label>
        <label className="block">
          <span className="kd-label">Price ({currencySymbol})</span>
          <input name="price" inputMode="decimal" defaultValue={piece.price ?? ""} placeholder="Leave empty for “Price on request”" className="kd-input" />
        </label>
        <label className="block">
          <span className="kd-label">Description</span>
          <textarea name="description" defaultValue={piece.description} rows={4} maxLength={2000} className="kd-input resize-y" />
        </label>
        <label className="block">
          <span className="kd-label">Details (one per line)</span>
          <textarea name="details" defaultValue={piece.details.join("\n")} rows={3} className="kd-input resize-y" placeholder={"Textured cotton blend\nMade to measure"} />
        </label>
        <label className="block">
          <span className="kd-label">Display order</span>
          <input name="sort_order" type="number" defaultValue={piece.sort_order} className="kd-input" />
          <span className="mt-1 block text-xs text-kd-gray">Lower numbers show first.</span>
        </label>
        <label className="flex items-center gap-3 border-t border-kd-black/10 pt-5">
          <input type="checkbox" name="published" defaultChecked={piece.published} className="h-5 w-5 accent-kd-gold-dark" />
          <span className="text-sm">Published — visible on the website</span>
        </label>

        {state?.error && <p className="text-sm text-red-700" role="alert">{state.error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={pending || uploading > 0} className={adminButtonPrimary}>{pending ? "Saving…" : "Save piece"}</button>
          <Link href="/admin/pieces" className={adminButtonOutline}>Cancel</Link>
        </div>
      </section>
    </form>
  );
}
