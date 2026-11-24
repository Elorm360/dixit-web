import Image from "next/image";
import Link from "next/link";
import { PageHeader, Panel, adminButtonOutline, adminButtonPrimary } from "@/components/admin/ui";
import { formatPrice } from "@/config/site";
import { collectionCategories } from "@/data/collections";
import { requireStaff } from "@/lib/admin";
import { getFolderPieces, storageUrl } from "@/lib/pieces";
import { PieceBoard, type BoardPiece } from "./piece-board";

export const metadata = { title: "Pieces" };

type Row = { id: string; collection: string; slug: string; name: string; price: number | null; images: string[]; published: boolean; featured: boolean };

export default async function PiecesPage({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string; added?: string }> }) {
  const { supabase } = await requireStaff();
  const { saved, deleted, added } = await searchParams;
  const { data, error } = await supabase
    .from("pieces")
    .select("id, collection, slug, name, price, images, published, featured")
    .order("sort_order")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Row[];

  const live = rows.filter((r) => r.published).length;
  const featured = rows.filter((r) => r.featured && r.published).length;
  const notice = saved
    ? "Piece saved. The website updates within a few seconds."
    : deleted
      ? "Piece deleted."
      : added
        ? `${added} draft piece${added === "1" ? "" : "s"} added. They stay hidden until you publish them.`
        : null;

  return (
    <>
      <PageHeader
        eyebrow="Collections manager"
        title="Pieces"
        actions={
          <>
            <Link href="/admin/pieces/bulk" className={adminButtonOutline}>Bulk upload</Link>
            <Link href="/admin/pieces/new" className={adminButtonPrimary}>+ Add a piece</Link>
          </>
        }
      />

      {error && (
        <p className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
          Could not load pieces. If the database was just updated, run the latest migration (see README) and refresh.
        </p>
      )}
      {notice && <p className="mb-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900" role="status">{notice}</p>}

      <dl className="mb-8 grid grid-cols-3 gap-3">
        {[
          ["In dashboard", rows.length],
          ["Live on site", live],
          ["Featured on home", featured],
        ].map(([label, value]) => (
          <div key={label} className="border border-kd-black/10 bg-kd-white px-5 py-4">
            <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-kd-gray">{label}</dt>
            <dd className="font-display mt-1 text-4xl">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="space-y-8">
        {collectionCategories.map((c) => {
          const pieces = rows.filter((r) => r.collection === c.slug);
          const folder = getFolderPieces(c.slug).filter((f) => !pieces.some((p) => p.slug === f.slug));
          const board: BoardPiece[] = pieces.map((p) => ({
            id: p.id,
            name: p.name,
            priceLabel: formatPrice(p.price),
            cover: p.images[0] ? storageUrl(p.images[0]) : null,
            photoCount: p.images.length,
            published: p.published,
            featured: p.featured,
          }));
          return (
            <Panel key={c.slug}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-kd-black/10 px-6 py-4">
                <div className="flex items-baseline gap-3">
                  <h2 className="font-display text-2xl">{c.name}</h2>
                  <span className="text-xs text-kd-gray">{pieces.filter((p) => p.published).length} live · {pieces.length + folder.length} total</span>
                </div>
                <div className="flex gap-4">
                  <Link href={`/admin/pieces/bulk?collection=${c.slug}`} className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-kd-gray hover:text-kd-black">+ Photos</Link>
                  <Link href={`/collections/${c.slug}`} target="_blank" className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-kd-gold-dark">View on site ↗</Link>
                </div>
              </div>
              {pieces.length === 0 && folder.length === 0 ? (
                <Link href={`/admin/pieces/bulk?collection=${c.slug}`} className="m-6 flex flex-col items-center justify-center border-2 border-dashed border-kd-black/15 px-6 py-10 text-center transition-colors hover:border-kd-gold-dark hover:bg-kd-cream">
                  <span className="font-display text-xl">No pieces yet</span>
                  <span className="mt-1 text-xs text-kd-gray">Upload photos to start the {c.name} collection</span>
                </Link>
              ) : (
                <>
                  {board.length > 0 && <PieceBoard collection={c.slug} pieces={board} />}
                  {folder.length > 0 && (
                    <ul className="divide-y divide-kd-black/10 border-t border-kd-black/10">
                      {folder.map((p) => (
                        <li key={p.slug} className="flex items-center gap-4 px-6 py-3 opacity-80">
                          <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-kd-cream">
                            <Image src={p.images[0]} alt="" fill sizes="48px" className="object-cover object-top" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{p.name}</p>
                            <p className="text-xs text-kd-gray">{formatPrice(p.price)} · from the photo folder (edit in code)</p>
                          </div>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-emerald-900">Live</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </Panel>
          );
        })}
      </div>
    </>
  );
}
