/**
 * Journal posts. The Journal link is hidden from the menu while this list is empty.
 *
 * Add a post like this (newest first). `image` is optional — place it in
 * public/journal/ and reference it as "/journal/your-image.jpg".
 *
 *   {
 *     slug: "dressing-for-an-outdooring",
 *     title: "Dressing for an outdooring",
 *     date: "2026-12-01",
 *     excerpt: "A short summary shown on the Journal page.",
 *     image: "/journal/outdooring.jpg",
 *     body: ["First paragraph.", "Second paragraph."],
 *   },
 */
export type JournalPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image?: string;
  body: string[];
};

export const posts: JournalPost[] = [];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function formatPostDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
