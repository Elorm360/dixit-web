import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { formatPrice, whatsappLink } from "@/config/site";
import { getCollectionCategory } from "@/data/collections";
import { getAllPieces, getPiece } from "@/lib/pieces";

type PiecePageProps = { params: Promise<{ slug: string; piece: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  const all = getAllPieces().map((p) => ({ slug: p.collection, piece: p.slug }));
  // Next needs at least one param set for a static route; this placeholder 404s.
  return all.length ? all : [{ slug: "none", piece: "none" }];
}

export async function generateMetadata({ params }: PiecePageProps) {
  const { slug, piece: pieceSlug } = await params;
  const piece = getPiece(slug, pieceSlug);
  if (!piece) return {};
  return {
    title: piece.name,
    description: piece.description ?? `${piece.name} from the DIXIT ${getCollectionCategory(slug)?.name} collection.`,
    openGraph: { images: [piece.images[0]] },
  };
}

export default async function PiecePage({ params }: PiecePageProps) {
  const { slug, piece: pieceSlug } = await params;
  const category = getCollectionCategory(slug);
  const piece = getPiece(slug, pieceSlug);
  if (!category || !piece) notFound();

  const interest = `${piece.name} (${category.name})`;
  const whatsapp = whatsappLink(`Hello DIXIT, I'm interested in the ${interest}.`);

  return (
    <main className="bg-kd-cream text-kd-black">
      <Container className="py-12 md:py-20">
        <Link href={`/collections/${slug}`} className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gray hover:text-kd-gold-dark">← {category.name}</Link>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <div className="grid gap-4">
            {piece.images.map((src, i) => (
              <div key={src} className="relative aspect-[3/4] bg-kd-warm-gold">
                <Image src={src} alt={`${piece.name}${i ? ` — view ${i + 1}` : ""}`} fill priority={i === 0} sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover object-top" />
              </div>
            ))}
          </div>
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">{category.name}</p>
            <h1 className="font-display mt-5 text-5xl font-medium leading-none md:text-6xl">{piece.name}</h1>
            <p className="mt-6 text-sm uppercase tracking-[0.16em]">{formatPrice(piece.price)}</p>
            {piece.description && <p className="mt-8 text-base leading-8 text-kd-gray">{piece.description}</p>}
            {piece.details.length > 0 && (
              <ul className="mt-8 space-y-2 border-t border-kd-black/15 pt-6 text-sm text-kd-gray">
                {piece.details.map((d) => <li key={d}>— {d}</li>)}
              </ul>
            )}
            <div className="mt-10 flex flex-col gap-3">
              <Button href={`/consultation?interest=${encodeURIComponent(interest)}`}>Enquire about this piece</Button>
              {whatsapp && <Button href={whatsapp} variant="outline">Ask on WhatsApp</Button>}
            </div>
            <p className="mt-6 text-xs leading-6 text-kd-gray">Available made to measure. Sizing, fabric and timing are confirmed during your consultation.</p>
          </div>
        </div>
      </Container>
    </main>
  );
}
