export const collectionCategories = [
  {
    slug: "bespoke",
    name: "Bespoke",
    number: "01",
    description: "Individual garments shaped through consultation, silhouette, fabric, and precision tailoring.",
  },
  {
    slug: "signature",
    name: "Signature Collections",
    number: "02",
    description: "Distinct KOFFY DODZI expressions developed around the house's evolving design language.",
  },
  {
    slug: "suits",
    name: "Suits",
    number: "03",
    description: "Tailored suiting considered around proportion, presence, occasion, and personal style.",
  },
  {
    slug: "traditional-fusion",
    name: "Traditional / Fusion",
    number: "04",
    description: "Contemporary menswear that creates space for African identity within a modern wardrobe.",
  },
  {
    slug: "smart-casual",
    name: "Smart Casual",
    number: "05",
    description: "Refined wardrobe pieces for a more relaxed expression of the KOFFY DODZI man.",
  },
  {
    slug: "occasion-wear",
    name: "Occasion Wear",
    number: "06",
    description: "Considered dressing for weddings, ceremonies, celebrations, and significant moments.",
  },
] as const;

export type CollectionCategory = (typeof collectionCategories)[number];

export function getCollectionCategory(slug: string) {
  return collectionCategories.find((category) => category.slug === slug);
}
