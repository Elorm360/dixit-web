import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { collectionCategories } from "@/data/collections";

export const metadata = {
  title: "Collections",
  description:
    "Explore the KOFFY DODZI menswear world, from bespoke and signature collections to suiting, traditional-fusion, smart casual, and occasion wear.",
};

export default function CollectionsPage() {
  return (
    <main>
      <section className="bg-kd-black py-24 text-kd-white md:py-36">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.55fr_1.45fr]">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">
              Collections
            </p>
            <div>
              <h1 className="font-display max-w-5xl text-[clamp(4.5rem,10vw,9rem)] font-medium leading-[0.8] tracking-[-0.045em]">
                The wardrobe,
                <span className="block italic text-kd-gold">considered.</span>
              </h1>
              <p className="mt-10 max-w-2xl text-base leading-8 text-white/55 md:text-lg">
                Explore the KOFFY DODZI menswear world by expression and occasion. Individual pieces and campaign imagery will be introduced as official collections are published.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-kd-cream py-20 text-kd-black md:py-28">
        <Container>
          <div className="border-t border-kd-black/15">
            {collectionCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/collections/${category.slug}`}
                className="group grid gap-5 border-b border-kd-black/15 py-8 transition-colors hover:bg-kd-warm-gold/40 md:grid-cols-[0.2fr_0.65fr_1fr_auto] md:items-center md:px-5 md:py-10"
              >
                <span className="text-xs tracking-[0.2em] text-kd-gold-dark">
                  {category.number}
                </span>
                <h2 className="font-display text-3xl transition-transform duration-300 group-hover:translate-x-2 md:text-4xl">
                  {category.name}
                </h2>
                <p className="max-w-xl text-sm leading-7 text-kd-gray">
                  {category.description}
                </p>
                <span className="text-xl transition-transform duration-300 group-hover:translate-x-2" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-kd-charcoal py-24 text-kd-white md:py-32">
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">
              Made Personal
            </p>
            <h2 className="font-display mt-6 max-w-4xl text-5xl font-medium leading-none md:text-7xl">
              Looking for something
              <span className="block italic text-white/50">made around you?</span>
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <Button href="/consultation">Book a consultation</Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
