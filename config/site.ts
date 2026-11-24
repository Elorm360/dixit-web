import { posts } from "@/data/journal";

/**
 * DIXIT site settings — the one place to update contact details.
 *
 * Leave a value as an empty string ("") while it is pending. The site hides
 * buttons and links whose details have not been provided yet, so nothing
 * broken or empty is shown to visitors.
 */
export const contact = {
  /** WhatsApp number in international format, digits only. e.g. "233241234567" */
  whatsapp: "",
  /** Public enquiries email shown on the site. e.g. "hello@dixit.com" */
  email: "",
  /** Phone number as it should be displayed. e.g. "+233 24 123 4567" */
  phone: "",
  /** Instagram handle without the @. e.g. "dixit.house" */
  instagram: "",
  /** Atelier address lines. Leave empty to show "Accra, Ghana" only. */
  address: [] as string[],
  city: "Accra, Ghana",
  /** e.g. "Mon – Sat · 10:00 – 18:00 · By appointment" */
  hours: "",
};

/**
 * Pricing display. Each piece's price is set in data/pieces.ts.
 * Pieces without a price show `priceOnRequestLabel`.
 */
export const pricing = {
  /** "GHS" (shown as GH₵) or "USD" (shown as $) */
  currency: "GHS" as "GHS" | "USD",
  priceOnRequestLabel: "Price on request",
  /** Bespoke "starting from" price shown on the Bespoke page, or null to hide. */
  bespokeStartingFrom: null as number | null,
  /** Typical bespoke turnaround, e.g. "3 – 4 weeks". Empty to hide. */
  bespokeLeadTime: "",
};

export const siteConfig = {
  name: "DIXIT",
  url: "https://dixit-web.vercel.app",
  description:
    "DIXIT is a contemporary fashion house in Accra bringing together bespoke tailoring and ready-to-wear collections.",
  navigation: [
    { label: "Collections", href: "/collections" },
    { label: "Bespoke", href: "/bespoke" },
    { label: "The House", href: "/our-story" },
    // The Journal appears in the menu once data/journal.ts has a post.
    ...(posts.length ? [{ label: "Journal", href: "/journal" }] : []),
    { label: "Contact", href: "/contact" },
  ],
  consultationHref: "/consultation",
} as const;

export function whatsappLink(message?: string) {
  if (!contact.whatsapp) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${contact.whatsapp}${text}`;
}

export function formatPrice(price: number | null | undefined) {
  if (price == null) return pricing.priceOnRequestLabel;
  const symbol = pricing.currency === "GHS" ? "GH₵" : "$";
  return `${symbol} ${price.toLocaleString("en-US")}`;
}
