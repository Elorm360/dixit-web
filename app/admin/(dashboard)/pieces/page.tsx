import Image from "next/image";
import Link from "next/link";
import { PageHeader, Panel, adminButtonPrimary } from "@/components/admin/ui";
import { formatPrice } from "@/config/site";
import { collectionCategories } from "@/data/collections";
import { requireStaff } from "@/lib/admin";
import { getFolderPieces, storageUrl } from "@/lib/pieces";
import { togglePublished } from "./actions";

export const metadata = { title: "Pieces" };

type Row = { id: string; collection: string; slug: string; name: string; price: number | null; images: string[]; published: boolean };

export default async function PiecesPage({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const { supabase } = await requireStaff();
  const { saved, deleted } = await searchParams;
  const { data } = await supabase
    .from("pieces")
    .select("id, collection, slug, name, price, images, published")
    .order("sort_order")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Row[];

  return (
    <>
      <PageHeader eyebrow={`${rows.length} in dashboard`} title="Pieces" actions={<Link href="/admin/pieces/new" className={adminButtonPrimary}>+ Add a piece</Link>} />
      {(saved || deleted) && (
        <p className="mb-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900" role="status">
          {saved ? "Piece saved. The website updates within a few seconds." : "Piece deleted."}
        </p>
      )}

      <div className="space-y-8">
        {collectionCategories.map((c) => {
          const pieces = rows.filter((r) => r.collection === c.slug);
          const folder = getFolderPieces(c.slug).filter((f) => !pieces.some((p) => p.slug === f.slug));
          return (
            <Panel key={c.slug}>
              <div className="flex items-center justify-between border-b border-kd-black/10 px-6 py-4">
                <h2 className="font-display text-2xl">{c.name}</h2>
                <Link href={`/collections/${c.slug}`} target="_blank" className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-kd-gold-dark">View on site ↗</Link>
              </div>
              {pieces.length === 0 && folder.length === 0 ? (
                <p className="px-6 py-6 text-sm text-kd-gray">No pieces yet.</p>
              ) : (
                <ul className="divide-y divide-kd-black/10">
                  {pieces.map((p) => (
                    <li key={p.id} className="flex items-center gap-4 px-6 py-3">
                      <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-kd-cream">
                        {p.images[0] && <Image src={storageUrl(p.images[0])} alt="" fill sizes="48px" className="object-cover object-top" />}
                      </div>
                      <Link href={`/admin/pieces/${p.id}`} className="min-w-0 flex-1">
                        <p className="truncate font-medium hover:underline">{p.name}</p>
                        <p className="text-xs text-kd-gray">{formatPrice(p.price)} · {p.images.length} photo{p.images.length === 1 ? "" : "s"}</p>
                      </Link>
                      <form action={togglePublished.bind(null, p.id, !p.published)}>
                        <button
                          disabled={!p.published && p.images.length === 0}
                          title={!p.published && p.images.length === 0 ? "Add a photo first" : undefined}
                          className={`rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.1em] disabled:opacity-40 ${p.published ? "bg-emerald-100 text-emerald-900" : "bg-neutral-200 text-neutral-700"}`}
                        >
                          {p.published ? "Live" : "Hidden"}
                        </button>
                      </form>
                    </li>
                  ))}
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
            </Panel>
          );
        })}
      </div>
    </>
  );
}
