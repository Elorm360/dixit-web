import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { getPieces } from "@/lib/pieces";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { collectionCategories } from "@/data/collections";

export const metadata = {
  title: "Collections",
  description: "Explore DIXIT womenswear, menswear, bespoke, ready-to-wear, and occasion collections.",
};

export default async function CollectionsPage() {
  const collections = await Promise.all(
    collectionCategories.map(async (category) => {
      const pieces = await getPieces(category.slug);
      return { category, cover: pieces[0]?.images[0], count: pieces.length };
    }),
  );

  return (
    <main>
      <section className="bg-kd-black py-24 text-kd-white md:py-36">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.55fr_1.45fr]">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">The Collections</p>
            <div>
              <h1 className="font-display max-w-5xl text-[clamp(4.5rem,10vw,9rem)] font-medium leading-[0.8] tracking-[-0.045em]">A wardrobe, <span className="block italic text-kd-gold">reimagined.</span></h1>
              <p className="mt-10 max-w-2xl text-base leading-8 text-white/55 md:text-lg">Explore the DIXIT world through pieces, categories, and expressions shaped by individuality and considered design.</p>
            </div>
          </div>
        </Container>
      </section>
      <section className="bg-kd-cream py-20 text-kd-black md:py-28">
        <Container>
          <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map(({ category, cover, count }, i) => (
              <li key={category.slug}>
                <Reveal delay={(i % 3) * 120}>
                  <Link href={`/collections/${category.slug}`} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-kd-charcoal">
                      {cover ? (
                        <Image src={cover} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]" />
                      ) : (
                        <div className="absolute inset-0 flex items-end bg-gradient-to-br from-kd-charcoal to-kd-black p-8">
                          <span className="font-display text-[8rem] leading-none text-kd-gold/15 transition-colors duration-500 group-hover:text-kd-gold/30">{category.number}</span>
                        </div>
                      )}
                      <span className="absolute left-5 top-5 text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-kd-white/80 mix-blend-difference">{count > 0 ? `${count} ${count === 1 ? "piece" : "pieces"}` : "Coming soon"}</span>
                    </div>
                    <div className="mt-6 flex items-baseline justify-between gap-4">
                      <h2 className="font-display text-3xl transition-colors group-hover:text-kd-gold-dark md:text-4xl">{category.name}</h2>
                      <span className="text-xl transition-transform duration-300 group-hover:translate-x-2" aria-hidden="true">→</span>
                    </div>
                    <p className="mt-3 max-w-sm text-sm leading-7 text-kd-gray">{category.description}</p>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <section className="bg-kd-charcoal py-24 text-kd-white md:py-32">
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div><p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">Made Personal</p><h2 className="font-display mt-6 max-w-4xl text-5xl font-medium leading-none md:text-7xl">Looking for something <span className="block italic text-white/50">distinctly yours?</span></h2></div>
          <div className="lg:justify-self-end"><Button href="/consultation">Start a conversation</Button></div>
        </Container>
      </section>
    </main>
  );
}
