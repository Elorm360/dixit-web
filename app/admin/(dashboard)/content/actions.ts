"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/admin";
import { CONTENT_TAG, type SiteContent } from "@/lib/content";

export type FormState = { ok?: boolean; error?: string } | null;

const PHOTO = /^(hero|founder|journal)\/[0-9a-f-]{36}\.(jpe?g|png|webp|avif)$/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const UUID = /^[0-9a-f-]{36}$/i;

function refresh() {
  updateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
}

const text = (fd: FormData, name: string, max: number) => String(fd.get(name) ?? "").trim().slice(0, max);
const lines = (fd: FormData, name: string, maxLines: number, maxLen: number) =>
  String(fd.get(name) ?? "").split("\n").map((l) => l.trim().slice(0, maxLen)).filter(Boolean).slice(0, maxLines);
const paragraphs = (fd: FormData, name: string, max: number) =>
  String(fd.get(name) ?? "").slice(0, max).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
const photo = (fd: FormData, name: string) => {
  const v = text(fd, name, 200);
  return PHOTO.test(v) ? v : "";
};

async function saveSection<K extends keyof SiteContent>(key: K, value: SiteContent[K]): Promise<FormState> {
  const { supabase, userId } = await requireStaff();
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, value, updated_at: new Date().toISOString(), updated_by: userId }, { onConflict: "key" });
  if (error) {
    return { error: error.code === "42P01" || error.code === "PGRST205" ? "Website content needs a quick database update first." : "Could not save. Please try again." };
  }
  refresh();
  return { ok: true };
}

export async function saveContact(_prev: FormState, fd: FormData): Promise<FormState> {
  let whatsapp = text(fd, "whatsapp", 30).replace(/\D/g, "");
  if (whatsapp.startsWith("00")) whatsapp = whatsapp.slice(2);
  else if (whatsapp.startsWith("0")) whatsapp = `233${whatsapp.slice(1)}`;
  if (whatsapp && (whatsapp.length < 9 || whatsapp.length > 15)) return { error: "Enter the WhatsApp number with its country code, e.g. 233 24 123 4567." };

  const email = text(fd, "email", 120);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };

  const instagram = text(fd, "instagram", 60).replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/\/.*$/, "");
  if (instagram && !/^[A-Za-z0-9._]{1,30}$/.test(instagram)) return { error: "Enter just the Instagram handle, e.g. dixit.house." };

  return saveSection("contact", {
    whatsapp,
    email,
    phone: text(fd, "phone", 40),
    instagram,
    address: lines(fd, "address", 4, 120),
    city: text(fd, "city", 60) || "Accra, Ghana",
    hours: text(fd, "hours", 120),
  });
}

export async function saveHomepage(_prev: FormState, fd: FormData): Promise<FormState> {
  const headline = text(fd, "headline", 40);
  const headlineAccent = text(fd, "headlineAccent", 40);
  if (!headline || !headlineAccent) return { error: "The headline needs both lines." };
  return saveSection("homepage", {
    eyebrow: text(fd, "eyebrow", 60),
    headline,
    headlineAccent,
    intro: text(fd, "intro", 220),
    heroImage: photo(fd, "heroImage"),
  });
}

export async function saveFounder(_prev: FormState, fd: FormData): Promise<FormState> {
  const story = paragraphs(fd, "story", 6000);
  const name = text(fd, "name", 80);
  if (story.length && !name) return { error: "Add the founder’s name to go with the story." };
  return saveSection("founder", {
    name,
    role: text(fd, "role", 80) || "Founder & Creative Director",
    photo: photo(fd, "photo"),
    story,
    quote: text(fd, "quote", 300),
  });
}

export async function savePricing(_prev: FormState, fd: FormData): Promise<FormState> {
  const raw = text(fd, "bespokeStartingFrom", 20).replace(/,/g, "");
  const from = raw ? Number(raw) : null;
  if (from !== null && (!Number.isFinite(from) || from < 0)) return { error: "Enter the starting price as a number, or leave it empty." };
  return saveSection("pricing", { bespokeStartingFrom: from, bespokeLeadTime: text(fd, "bespokeLeadTime", 60) });
}

// ---- Testimonials ----

export async function saveTestimonial(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireStaff();
  const quote = text(fd, "quote", 600);
  const name = text(fd, "name", 80);
  if (!quote || !name) return { error: "Add the quote and the client’s name." };
  const row = { quote, name, detail: text(fd, "detail", 120) || null, published: fd.get("published") === "on" };
  const { error } = id && UUID.test(id) ? await supabase.from("testimonials").update(row).eq("id", id) : await supabase.from("testimonials").insert(row);
  if (error) return { error: "Could not save. Please try again." };
  refresh();
  revalidatePath("/admin/content/testimonials");
  return { ok: true };
}

export async function deleteTestimonial(id: string) {
  const { supabase } = await requireStaff();
  if (!UUID.test(id)) return;
  await supabase.from("testimonials").delete().eq("id", id);
  refresh();
  revalidatePath("/admin/content/testimonials");
}

// ---- Journal ----

export async function savePost(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireStaff();
  const title = text(fd, "title", 160);
  const slug = text(fd, "slug", 100);
  const date = text(fd, "published_on", 10);
  const image = photo(fd, "image");
  if (!title) return { error: "Give the post a title." };
  if (!SLUG.test(slug)) return { error: "The web address can only use lowercase letters, numbers and single hyphens." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Choose a date." };
  if (image && !image.startsWith("journal/")) return { error: "Please re-upload the photo." };

  const row = {
    title,
    slug,
    excerpt: text(fd, "excerpt", 400),
    body: String(fd.get("body") ?? "").slice(0, 30000),
    image: image || null,
    published_on: date,
    published: fd.get("published") === "on",
    updated_at: new Date().toISOString(),
  };
  const { error } = id && UUID.test(id) ? await supabase.from("journal_posts").update(row).eq("id", id) : await supabase.from("journal_posts").insert(row);
  if (error) return { error: error.code === "23505" ? "Another post already uses that web address." : "Could not save. Please try again." };
  refresh();
  redirect("/admin/content/journal?saved=1");
}

export async function deletePost(id: string) {
  const { supabase } = await requireStaff();
  if (!UUID.test(id)) return;
  const { data } = await supabase.from("journal_posts").select("image").eq("id", id).maybeSingle();
  await supabase.from("journal_posts").delete().eq("id", id);
  if (data?.image) await supabase.storage.from("site").remove([data.image]);
  refresh();
  redirect("/admin/content/journal?deleted=1");
}
