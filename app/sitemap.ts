import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { collectionCategories } from "@/data/collections";
import { posts } from "@/data/journal";
import { getAllPieces } from "@/lib/pieces";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;
  const paths = [
    "",
    "/collections",
    "/bespoke",
    "/our-story",
    "/contact",
    "/consultation",
    ...(posts.length ? ["/journal"] : []),
    ...collectionCategories.map((c) => `/collections/${c.slug}`),
    ...getAllPieces().map((p) => `/collections/${p.collection}/${p.slug}`),
    ...posts.map((p) => `/journal/${p.slug}`),
  ];
  return paths.map((p) => ({ url: `${base}${p}` }));
}
