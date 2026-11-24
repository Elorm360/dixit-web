"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { collectionCategories } from "@/data/collections";
import { requireStaff } from "@/lib/admin";
import { PIECES_TAG } from "@/lib/pieces";

export type PieceFormState = { error?: string } | null;

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const IMAGE_PATH = /^[a-z-]+\/[0-9a-f-]{36}\.(jpe?g|png|webp|avif)$/;

function refreshSite(...collections: string[]) {
  updateTag(PIECES_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/collections/[slug]", "page");
  revalidatePath("/collections/[slug]/[piece]", "page");
  for (const c of collections) revalidatePath(`/collections/${c}`);
}

export async function savePiece(id: string | null, _prev: PieceFormState, formData: FormData): Promise<PieceFormState> {
  const { supabase } = await requireStaff();

  const collection = String(formData.get("collection") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const details = String(formData.get("details") ?? "").split("\n").map((d) => d.trim()).filter(Boolean).slice(0, 20);
  const priceRaw = String(formData.get("price") ?? "").replace(/,/g, "").trim();
  const price = priceRaw ? Number(priceRaw) : null;
  const published = formData.get("published") === "on";
  const sortOrder = Number.parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0;
  let images: string[];
  try {
    images = JSON.parse(String(formData.get("images") ?? "[]"));
  } catch {
    images = [];
  }

  if (!collectionCategories.some((c) => c.slug === collection)) return { error: "Choose a collection." };
  if (!name || name.length > 120) return { error: "Give the piece a name (up to 120 characters)." };
  if (!SLUG.test(slug)) return { error: "The web address can only use lowercase letters, numbers and single hyphens." };
  if (description.length > 2000) return { error: "The description is too long." };
  if (price != null && (!Number.isFinite(price) || price < 0)) return { error: "Enter the price as a number, or leave it empty for “Price on request”." };
  if (!Array.isArray(images) || images.some((p) => typeof p !== "string" || !IMAGE_PATH.test(p))) return { error: "Something went wrong with the photos. Please re-upload them." };
  if (published && images.length === 0) return { error: "Add at least one photo before publishing." };

  const row = { collection, name, slug, description: description || null, details, price, published, sort_order: sortOrder, images, updated_at: new Date().toISOString() };

  let previous: { collection: string; images: string[] } | null = null;
  if (id) {
    const { data } = await supabase.from("pieces").select("collection, images").eq("id", id).maybeSingle();
    previous = data;
  }

  const { error } = id
    ? await supabase.from("pieces").update(row).eq("id", id)
    : await supabase.from("pieces").insert(row);
  if (error) {
    if (error.code === "23505") return { error: "Another piece in this collection already uses that web address." };
    return { error: "Could not save the piece. Please try again." };
  }

  // Remove photos that were taken off the piece.
  const removed = previous?.images.filter((p) => !images.includes(p)) ?? [];
  if (removed.length) await supabase.storage.from("pieces").remove(removed);

  refreshSite(collection, ...(previous && previous.collection !== collection ? [previous.collection] : []));
  redirect("/admin/pieces?saved=1");
}

export async function deletePiece(id: string) {
  const { supabase } = await requireStaff();
  const { data } = await supabase.from("pieces").select("collection, images").eq("id", id).maybeSingle();
  if (!data) redirect("/admin/pieces");

  await supabase.from("pieces").delete().eq("id", id);
  if (data.images.length) await supabase.storage.from("pieces").remove(data.images);

  refreshSite(data.collection);
  redirect("/admin/pieces?deleted=1");
}

const UUID = /^[0-9a-f-]{36}$/i;

export async function toggleFeatured(id: string, featured: boolean) {
  const { supabase } = await requireStaff();
  if (!UUID.test(id)) return;
  const { data } = await supabase.from("pieces").select("collection").eq("id", id).maybeSingle();
  if (!data) return;
  await supabase.from("pieces").update({ featured, updated_at: new Date().toISOString() }).eq("id", id);
  refreshSite(data.collection);
}

/** Saves the order staff dragged pieces into. `ids` is the full list for one collection, in display order. */
export async function reorderPieces(collection: string, ids: string[]): Promise<{ error?: string }> {
  const { supabase } = await requireStaff();
  if (!collectionCategories.some((c) => c.slug === collection)) return { error: "Unknown collection." };
  if (!Array.isArray(ids) || ids.length > 500 || ids.some((id) => typeof id !== "string" || !UUID.test(id))) return { error: "Invalid order." };

  const results = await Promise.all(
    ids.map((id, i) => supabase.from("pieces").update({ sort_order: (i + 1) * 10 }).eq("id", id).eq("collection", collection)),
  );
  if (results.some((r) => r.error)) return { error: "Could not save the new order. Please refresh and try again." };
  refreshSite(collection);
  return {};
}

export type DraftPiece = { name: string; slug: string; images: string[] };

/** Creates hidden draft pieces from a bulk photo upload. Slugs that clash get a number added. */
export async function createDraftPieces(collection: string, drafts: DraftPiece[]): Promise<{ error?: string; created?: number }> {
  const { supabase } = await requireStaff();
  if (!collectionCategories.some((c) => c.slug === collection)) return { error: "Choose a collection." };
  if (!Array.isArray(drafts) || drafts.length === 0 || drafts.length > 200) return { error: "Nothing to add." };
  for (const d of drafts) {
    if (typeof d?.name !== "string" || !d.name.trim() || d.name.length > 120) return { error: "A piece name is missing or too long." };
    if (typeof d.slug !== "string" || !SLUG.test(d.slug)) return { error: `“${d.name}” has an invalid web address.` };
    if (!Array.isArray(d.images) || d.images.length === 0 || d.images.some((p) => typeof p !== "string" || !IMAGE_PATH.test(p) || !p.startsWith(`${collection}/`))) {
      return { error: `Photos for “${d.name}” did not upload correctly.` };
    }
  }

  const { data: existing } = await supabase.from("pieces").select("slug, sort_order").eq("collection", collection);
  const taken = new Set((existing ?? []).map((r) => r.slug));
  let order = Math.max(0, ...(existing ?? []).map((r) => r.sort_order)) + 10;

  const rows = drafts.map((d) => {
    let slug = d.slug;
    for (let n = 2; taken.has(slug); n++) slug = `${d.slug}-${n}`;
    taken.add(slug);
    const row = { collection, name: d.name.trim(), slug, images: d.images, published: false, sort_order: order };
    order += 10;
    return row;
  });

  const { error } = await supabase.from("pieces").insert(rows);
  if (error) return { error: "Could not create the pieces. Please try again." };
  refreshSite(collection);
  return { created: rows.length };
}

export async function togglePublished(id: string, published: boolean) {
  const { supabase } = await requireStaff();
  const { data } = await supabase.from("pieces").select("collection, images").eq("id", id).maybeSingle();
  if (!data || (published && data.images.length === 0)) return;
  await supabase.from("pieces").update({ published, updated_at: new Date().toISOString() }).eq("id", id);
  refreshSite(data.collection);
}
