import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { formatPrice } from "@/config/site";
import { collectionCategories, getCollectionCategory } from "@/data/collections";
import { getPieces } from "@/lib/pieces";

type CollectionPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return collectionCategories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const { slug } = await params;
  const category = getCollectionCategory(slug);
  return category ? { title: category.name, description: category.description } : {};
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const category = getCollectionCategory(slug);
  if (!category) notFound();
  const pieces = await getPieces(slug);

  return (
    <main>
      <section className="bg-kd-black py-24 text-kd-white md:py-32">
        <Container>
          <Link href="/collections" className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/50 hover:text-kd-gold">← All collections</Link>
          <p className="mt-10 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">DIXIT Collection {category.number}</p>
          <h1 className="font-display mt-7 max-w-5xl text-[clamp(3.5rem,10vw,9rem)] font-medium leading-[0.85] tracking-[-0.045em]">{category.name}</h1>
          <p className="mt-10 max-w-2xl text-base leading-8 text-white/55 md:text-lg">{category.description}</p>
        </Container>
      </section>

      <section className="bg-kd-cream py-20 md:py-28">
        <Container>
          {pieces.length > 0 ? (
            <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {pieces.map((piece, i) => (
                <li key={piece.slug}>
                  <Link href={`/collections/${slug}/${piece.slug}`} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-kd-warm-gold">
                      <Image
                        src={piece.images[0]}
                        alt={piece.name}
                        fill
                        priority={i < 3}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="mt-5 flex items-baseline justify-between gap-4">
                      <h2 className="font-display text-2xl md:text-3xl">{piece.name}</h2>
                      <span className="shrink-0 text-xs uppercase tracking-[0.14em] text-kd-gray">{formatPrice(piece.price)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">The Edit</p>
              <div>
                <h2 className="font-display max-w-3xl text-5xl font-medium leading-none md:text-7xl">Arriving <span className="italic text-kd-gold-dark">soon.</span></h2>
                <p className="mt-8 max-w-2xl text-base leading-8 text-kd-gray">The {category.name} edit is being photographed. In the meantime, tell us what you are looking for and we will show you what is possible.</p>
              </div>
            </div>
          )}
          <div className="mt-20 flex flex-col items-start gap-6 border-t border-kd-black/15 pt-10 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl text-sm leading-7 text-kd-gray">Every piece can be adapted to your measurements and occasion.</p>
            <Button href={`/consultation?interest=${encodeURIComponent(category.name)}`}>Enquire about {category.name}</Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
