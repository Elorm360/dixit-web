export const collectionCategories = [
  {
    slug: "womenswear",
    name: "Womenswear",
    number: "01",
    description: "Distinctive silhouettes and considered pieces shaped for modern expression.",
  },
  {
    slug: "menswear",
    name: "Menswear",
    number: "02",
    description: "Confident wardrobe essentials, refined tailoring, and contemporary forms.",
  },
  {
    slug: "signature",
    name: "Signature Collections",
    number: "03",
    description: "The evolving DIXIT point of view, expressed through curated seasonal edits.",
  },
  {
    slug: "bespoke",
    name: "Bespoke",
    number: "04",
    description: "Individual garments developed around your proportions, preferences, and occasion.",
  },
  {
    slug: "ready-to-wear",
    name: "Ready to Wear",
    number: "05",
    description: "Considered pieces designed to move effortlessly from everyday to occasion.",
  },
  {
    slug: "occasion-wear",
    name: "Occasion Wear",
    number: "06",
    description: "Distinctive dressing for celebrations, ceremonies, and significant moments.",
  },
] as const;

export type CollectionCategory = (typeof collectionCategories)[number];

export function getCollectionCategory(slug: string) {
  return collectionCategories.find((category) => category.slug === slug);
}
