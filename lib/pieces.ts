import fs from "node:fs";
import path from "node:path";
import { collectionCategories } from "@/data/collections";
import { pieces as pieceInfo } from "@/data/pieces";

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;
const EXTRA_SUFFIX = /--\d+$/;

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
  return slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getPieces(collection: string): Piece[] {
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

export function getPiece(collection: string, slug: string) {
  return getPieces(collection).find((p) => p.slug === slug);
}

export function getAllPieces() {
  return collectionCategories.flatMap((c) => getPieces(c.slug));
}
