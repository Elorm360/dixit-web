import fs from "node:fs";
import path from "node:path";
import { collectionCategories } from "@/data/collections";
import { pieces as pieceInfo } from "@/data/pieces";

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;
const EXTRA_SUFFIX = /--\d+$/;
export const PIECES_TAG = "pieces";

export type Piece = {
  slug: string;
  collection: string;
  name: string;
  description?: string;
  details: string[];
  price: number | null;
  images: string[];
};

function titleFromSlug(slug: string) {
  return slug.replace(/^\d+-/, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function storageUrl(objectPath: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, "")}/storage/v1/object/public/pieces/${objectPath}`;
}

/** Pieces from photos dropped into public/collections/<collection>/. */
export function getFolderPieces(collection: string): Piece[] {
  const dir = path.join(process.cwd(), "public", "collections", collection);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => IMAGE_EXT.test(f)).sort();
  const groups = new Map<string, string[]>();
  for (const file of files) {
    const base = file.replace(IMAGE_EXT, "");
    const slug = base.replace(EXTRA_SUFFIX, "").toLowerCase();
    const list = groups.get(slug) ?? [];
    // The main photo (no --N suffix) always goes first.
    if (EXTRA_SUFFIX.test(base)) list.push(file);
    else list.unshift(file);
    groups.set(slug, list);
  }

  return [...groups].map(([slug, images]) => {
    const info = pieceInfo[`${collection}/${images[0]}`] ?? {};
    return {
      slug,
      collection,
      name: info.name ?? titleFromSlug(slug),
      description: info.description,
      details: info.details ?? [],
      price: info.price ?? null,
      images: images.map((f) => `/collections/${collection}/${f}`),
    };
  });
}

type PieceRow = {
  collection: string;
  slug: string;
  name: string;
  description: string | null;
  details: string[];
  price: string | number | null;
  images: string[];
};

/** Published pieces added from the admin dashboard. Cached until a piece is changed. */
async function getDatabasePieces(): Promise<Piece[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];

  try {
    const res = await fetch(
      `${url.replace(/\/$/, "")}/rest/v1/pieces?published=eq.true&select=collection,slug,name,description,details,price,images&order=sort_order.asc,created_at.desc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "force-cache", next: { tags: [PIECES_TAG] } },
    );
    if (!res.ok) return [];
    const rows: PieceRow[] = await res.json();
    return rows
      .filter((r) => r.images.length > 0)
      .map((r) => ({
        slug: r.slug,
        collection: r.collection,
        name: r.name,
        description: r.description ?? undefined,
        details: r.details,
        price: r.price == null ? null : Number(r.price),
        images: r.images.map(storageUrl),
      }));
  } catch {
    return [];
  }
}

export async function getPieces(collection: string): Promise<Piece[]> {
  const fromDb = (await getDatabasePieces()).filter((p) => p.collection === collection);
  const dbSlugs = new Set(fromDb.map((p) => p.slug));
  return [...fromDb, ...getFolderPieces(collection).filter((p) => !dbSlugs.has(p.slug))];
}

export async function getAllPieces() {
  return (await Promise.all(collectionCategories.map((c) => getPieces(c.slug)))).flat();
}
