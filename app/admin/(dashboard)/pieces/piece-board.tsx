"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { reorderPieces, toggleFeatured, togglePublished } from "./actions";

export type BoardPiece = {
  id: string;
  name: string;
  priceLabel: string;
  cover: string | null;
  photoCount: number;
  published: boolean;
  featured: boolean;
};

/** One collection's pieces as a grid: drag (or use the arrows) to reorder, one click to publish or feature. */
export function PieceBoard({ collection, pieces: initial }: { collection: string; pieces: BoardPiece[] }) {
  const router = useRouter();
  const [pieces, setPieces] = useState(initial);
  const [dragId, setDragId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, startSaving] = useTransition();

  // Keep in sync when the server sends fresh data (e.g. after a save elsewhere).
  const [lastInitial, setLastInitial] = useState(initial);
  if (initial !== lastInitial) {
    setLastInitial(initial);
    setPieces(initial);
  }

  function saveOrder(next: BoardPiece[]) {
    setPieces(next);
    setError("");
    startSaving(async () => {
      const res = await reorderPieces(collection, next.map((p) => p.id));
      if (res.error) {
        setError(res.error);
        setPieces(initial);
      }
      router.refresh();
    });
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= pieces.length || from === to) return;
    const next = [...pieces];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    saveOrder(next);
  }

  function flip(id: string, field: "published" | "featured") {
    const piece = pieces.find((p) => p.id === id);
    if (!piece) return;
    const value = !piece[field];
    setPieces((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    startSaving(async () => {
      await (field === "published" ? togglePublished(id, value) : toggleFeatured(id, value));
      router.refresh();
    });
  }

  return (
    <div className="p-4 md:p-6">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6" aria-label="Pieces — drag to reorder">
        {pieces.map((p, i) => (
          <li
            key={p.id}
            draggable
            onDragStart={(e) => {
              setDragId(p.id);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={() => setDragId(null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const from = pieces.findIndex((x) => x.id === dragId);
              if (from !== -1) move(from, i);
              setDragId(null);
            }}
            className={`group flex cursor-grab flex-col border bg-kd-white transition active:cursor-grabbing ${dragId === p.id ? "border-kd-gold opacity-50" : "border-kd-black/10 hover:border-kd-black/30"}`}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-kd-cream">
              {p.cover ? (
                <Image src={p.cover} alt="" fill sizes="(min-width: 1536px) 15vw, (min-width: 1024px) 22vw, 45vw" className="pointer-events-none object-cover object-top" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-xs text-kd-gray">No photo</span>
              )}
              <span className="absolute left-2 top-2 bg-kd-black/80 px-2 py-0.5 text-[0.6rem] font-semibold text-kd-white">{i + 1}</span>
              <button
                type="button"
                onClick={() => flip(p.id, "featured")}
                aria-pressed={p.featured}
                title={p.featured ? "Featured on the home page — click to remove" : "Feature on the home page"}
                className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-base transition-colors ${p.featured ? "bg-kd-gold text-kd-black" : "bg-kd-black/50 text-white/80 hover:bg-kd-black/80"}`}
              >
                <span aria-hidden="true">{p.featured ? "★" : "☆"}</span>
                <span className="sr-only">{p.featured ? "Unfeature" : "Feature"} {p.name}</span>
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-3">
              <Link href={`/admin/pieces/${p.id}`} className="min-w-0">
                <p className="truncate text-sm font-medium hover:underline">{p.name}</p>
                <p className="truncate text-xs text-kd-gray">{p.priceLabel} · {p.photoCount} photo{p.photoCount === 1 ? "" : "s"}</p>
              </Link>
              <div className="mt-auto flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => flip(p.id, "published")}
                  disabled={!p.published && p.photoCount === 0}
                  title={!p.published && p.photoCount === 0 ? "Add a photo first" : p.published ? "Live — click to hide" : "Hidden — click to publish"}
                  className={`rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.1em] disabled:opacity-40 ${p.published ? "bg-emerald-100 text-emerald-900" : "bg-neutral-200 text-neutral-700"}`}
                >
                  {p.published ? "Live" : "Hidden"}
                </button>
                <div className="flex gap-1 text-xs">
                  <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className="border border-kd-black/15 px-2 py-0.5 disabled:opacity-30" aria-label={`Move ${p.name} earlier`}>←</button>
                  <button type="button" onClick={() => move(i, i + 1)} disabled={i === pieces.length - 1} className="border border-kd-black/15 px-2 py-0.5 disabled:opacity-30" aria-label={`Move ${p.name} later`}>→</button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 h-4 text-xs text-kd-gray" role="status">
        {error ? <span className="text-red-700">{error}</span> : saving ? "Saving…" : pieces.length > 1 ? "Drag pieces (or use the arrows) to change the order on the website." : ""}
      </p>
    </div>
  );
}
