import { cache } from "react";
import { contact as defaultContact, pricing as defaultPricing } from "@/config/site";
import { founder as defaultFounder } from "@/data/founder";
import { posts as defaultPosts } from "@/data/journal";
import { testimonials as defaultTestimonials } from "@/data/testimonials";

/** Cache tag for everything edited under Dashboard → Website content. */
export const CONTENT_TAG = "site-content";

export type ContactDetails = {
  whatsapp: string;
  email: string;
  phone: string;
  instagram: string;
  address: string[];
  city: string;
  hours: string;
};

export type BespokePricing = { bespokeStartingFrom: number | null; bespokeLeadTime: string };

export type FounderStory = { name: string; role: string; photo: string; story: string[]; quote: string };

export type HomepageCopy = { eyebrow: string; headline: string; headlineAccent: string; intro: string; heroImage: string };

export type Testimonial = { quote: string; name: string; detail?: string };

export type JournalPost = { slug: string; title: string; date: string; excerpt: string; image?: string; body: string[] };

export type SiteContent = {
  contact: ContactDetails;
  pricing: BespokePricing;
  founder: FounderStory;
  homepage: HomepageCopy;
};

export const DEFAULT_HERO_IMAGE = "/brand/dixit-hero.jpg";

export const defaultContent: SiteContent = {
  contact: { ...defaultContact, address: [...defaultContact.address] },
  pricing: { bespokeStartingFrom: defaultPricing.bespokeStartingFrom, bespokeLeadTime: defaultPricing.bespokeLeadTime },
  founder: { ...defaultFounder, story: [...defaultFounder.story] },
  homepage: {
    eyebrow: "A Modern Fashion House",
    headline: "Style is a",
    headlineAccent: "statement.",
    intro: "Bespoke craft. Ready-to-wear expression. A wardrobe shaped around individuality.",
    heroImage: "",
  },
};

/** Public URL of a photo in the "site" storage bucket (hero, founder, journal). */
export function sitePhotoUrl(path: string) {
  return `${(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "")}/storage/v1/object/public/site/${path}`;
}

/** Stored photo paths look like "journal/<uuid>.jpg"; anything starting with "/" is a file in /public. */
function resolvePhoto(path: string) {
  if (!path) return "";
  return path.startsWith("/") ? path : sitePhotoUrl(path);
}

async function rest<T>(query: string): Promise<T | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${query}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "force-cache",
      next: { tags: [CONTENT_TAG] },
    });
    // Before the content migration is applied the tables don't exist: fall back to defaults.
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function pick<T extends object>(defaults: T, value: unknown): T {
  if (!value || typeof value !== "object") return defaults;
  const out = { ...defaults };
  for (const k of Object.keys(defaults) as (keyof T)[]) {
    const v = (value as Record<string, unknown>)[k as string];
    if (v === undefined) continue;
    const d = defaults[k];
    if (Array.isArray(d) ? Array.isArray(v) : d === null || typeof v === typeof d) out[k] = v as T[keyof T];
  }
  return out;
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const rows = await rest<{ key: keyof SiteContent; value: unknown }[]>("site_content?select=key,value");
  const byKey = new Map((rows ?? []).map((r) => [r.key, r.value]));
  const founder = pick(defaultContent.founder, byKey.get("founder"));
  const homepage = pick(defaultContent.homepage, byKey.get("homepage"));
  const pricing = pick(defaultContent.pricing, byKey.get("pricing"));
  if (pricing.bespokeStartingFrom !== null && typeof pricing.bespokeStartingFrom !== "number") pricing.bespokeStartingFrom = null;
  return {
    contact: pick(defaultContent.contact, byKey.get("contact")),
    pricing,
    founder: { ...founder, photo: resolvePhoto(founder.photo) },
    homepage: { ...homepage, heroImage: resolvePhoto(homepage.heroImage) || DEFAULT_HERO_IMAGE },
  };
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const rows = await rest<{ quote: string; name: string; detail: string | null }[]>(
    "testimonials?published=eq.true&select=quote,name,detail&order=sort_order.asc,created_at.asc",
  );
  if (!rows) return defaultTestimonials;
  return rows.map((r) => ({ quote: r.quote, name: r.name, detail: r.detail ?? undefined }));
});

type PostRow = { slug: string; title: string; excerpt: string; body: string; image: string | null; published_on: string };

function toPost(r: PostRow): JournalPost {
  return {
    slug: r.slug,
    title: r.title,
    date: r.published_on,
    excerpt: r.excerpt,
    image: r.image ? sitePhotoUrl(r.image) : undefined,
    // Paragraphs are separated by a blank line.
    body: r.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
  };
}

export const getJournalPosts = cache(async (): Promise<JournalPost[]> => {
  const rows = await rest<PostRow[]>("journal_posts?published=eq.true&select=slug,title,excerpt,body,image,published_on&order=published_on.desc,created_at.desc");
  return rows ? rows.map(toPost) : defaultPosts;
});

export async function getJournalPost(slug: string) {
  return (await getJournalPosts()).find((p) => p.slug === slug);
}

export function whatsappHref(number: string, message?: string) {
  if (!number) return null;
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export function getNavigation(hasJournal: boolean) {
  return [
    { label: "Collections", href: "/collections" },
    { label: "Bespoke", href: "/bespoke" },
    { label: "The House", href: "/our-story" },
    ...(hasJournal ? [{ label: "Journal", href: "/journal" }] : []),
    { label: "Contact", href: "/contact" },
  ];
}

export type NavItem = ReturnType<typeof getNavigation>[number];
