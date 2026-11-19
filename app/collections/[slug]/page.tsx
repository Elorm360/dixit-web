import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { collectionCategories, getCollectionCategory } from "@/data/collections";

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

  return (
    <main>
      <section className="bg-kd-black py-24 text-kd-white md:py-36">
        <Container>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">DIXIT Collection {category.number}</p>
          <h1 className="font-display mt-7 max-w-5xl text-[clamp(4.5rem,10vw,9rem)] font-medium leading-[0.8] tracking-[-0.045em]">{category.name}</h1>
          <p className="mt-10 max-w-2xl text-base leading-8 text-white/55 md:text-lg">{category.description}</p>
        </Container>
      </section>
      <section className="bg-kd-cream py-24 md:py-36">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">The Edit</p>
            <div>
              <h2 className="font-display max-w-3xl text-5xl font-medium leading-none md:text-7xl">A considered <span className="block italic text-kd-gold-dark">expression.</span></h2>
              <p className="mt-8 max-w-2xl text-base leading-8 text-kd-gray">The DIXIT edit is being curated. Official looks, campaign photography, garment details, and availability will be added as collections are released.</p>
              <Button href="/consultation" className="mt-9">Enquire about {category.name}</Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
