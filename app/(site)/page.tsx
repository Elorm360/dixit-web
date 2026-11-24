import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { formatPrice } from "@/config/site";
import { getFeaturedPieces } from "@/lib/pieces";
import { Reveal } from "@/components/ui/reveal";
import { getSiteContent, getTestimonials } from "@/lib/content";
import { collectionCategories } from "@/data/collections";

// Shown on the home page until collection photos are added.
const homeCollections = collectionCategories.filter((c) => ["womenswear", "menswear", "bespoke"].includes(c.slug));

const pillars = [
  ["01", "Bespoke", "Personal pieces shaped around your proportions, preferences, and occasion."],
  ["02", "Ready to Wear", "A considered wardrobe of distinctive pieces, designed to be lived in."],
  ["03", "The Collections", "A changing expression of the DIXIT point of view across fashion and form."],
];

export default async function Home() {
  const [featured, { homepage }, testimonials] = await Promise.all([getFeaturedPieces(3), getSiteContent(), getTestimonials()]);
  return (
    <main>
      <section className="relative isolate flex min-h-[calc(100svh-5rem)] items-end overflow-hidden bg-kd-black text-kd-white">
        {/* Phones: photo fills the screen, anchored to the top so the face stays visible. */}
        {/* Tablet/desktop: blurred copy fills the screen; the full portrait sits on the right, uncropped. */}
        <Image
          src={homepage.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-30 object-cover md:scale-110 object-top md:object-center md:blur-2xl md:brightness-50"
        />
        <div className="absolute inset-y-0 right-0 -z-20 hidden aspect-[583/904] [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] md:block lg:right-[6%]">
          <Image
            src={homepage.heroImage}
            alt="DIXIT editorial look: textured gold jacket styled with black tailoring in a dramatic open landscape"
            fill
            priority
            sizes="(min-width: 768px) 60vh, 100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
        {/* Phones: the copy sits over the lower half of the portrait, so give it a solid base to read against. */}
        <div className="absolute inset-x-0 bottom-0 -z-10 h-[68%] bg-gradient-to-t from-kd-black via-kd-black/85 to-transparent md:hidden" />
        <Container className="grid min-h-[calc(100svh-5rem)] items-end gap-10 pb-16 pt-24 lg:grid-cols-2 lg:pb-24">
          <div className="kd-hero-in max-w-4xl">
            <p className="mb-7 text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-kd-gold">{homepage.eyebrow}</p>
            <h1 className="font-display text-[clamp(3.75rem,9vw,8.5rem)] font-medium leading-[0.78] tracking-[-0.05em]">{homepage.headline} <span className="block italic text-kd-gold">{homepage.headlineAccent}</span></h1>
            <p className="mt-9 max-w-xl text-base leading-8 text-white/85 md:text-lg">{homepage.intro}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href="/collections">Explore collections</Button>
              <Button href="/our-story" variant="outline">Discover DIXIT</Button>
            </div>
          </div>
        </Container>
        <div className="absolute right-8 top-7 hidden text-[0.6rem] uppercase tracking-[0.3em] text-white/75 md:block">Accra · Beyond</div>
      </section>

      <div className="overflow-hidden border-y border-kd-gold/30 bg-kd-black py-5 text-kd-gold" aria-hidden="true">
        <div className="kd-marquee flex w-max gap-12 whitespace-nowrap font-display text-2xl italic md:text-3xl">
          {[0, 1].map((n) => (
            <div key={n} className="flex gap-12">
              {["Bespoke", "Ready to Wear", "Occasion", "Womenswear", "Menswear", "Made in Accra"].map((w) => (
                <span key={w} className="flex items-center gap-12">{w}<span className="text-sm not-italic text-white/30">✦</span></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="bg-kd-cream py-24 text-kd-black md:py-36">
        <Container className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">The DIXIT Point of View</p>
          <Reveal>
            <h2 className="font-display max-w-4xl text-5xl font-medium leading-[0.98] tracking-[-0.025em] md:text-7xl">Clothing is what you wear. <span className="block italic text-kd-gold-dark">Style is what you say.</span></h2>
            <p className="mt-8 max-w-2xl text-base leading-8 text-kd-gray md:text-lg">DIXIT brings bespoke tailoring, ready-to-wear collections, and a wider fashion perspective together in one house — with room for individuality at every turn.</p>
            <Link href="/our-story" className="mt-8 inline-flex border-b border-kd-black pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-kd-gold-dark hover:text-kd-gold-dark">Discover the house</Link>
          </Reveal>
        </Container>
      </section>

      <section className="bg-kd-charcoal py-24 text-kd-white md:py-32">
        <Container>
          <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="mb-5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">The DIXIT Experience</p>
              <h2 className="font-display max-w-3xl text-5xl font-medium leading-none md:text-7xl">Made personal. <span className="block italic text-white/55">Made to be remembered.</span></h2>
            </div>
            <Button href="/bespoke" variant="outline">Explore bespoke</Button>
          </div>
          <div className="grid md:grid-cols-3">
            {pillars.map(([number, title, copy]) => (
              <Reveal key={number} delay={Number(number) * 120} className="border-b border-white/10 py-10 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                <span className="text-xs tracking-[0.2em] text-kd-gold">{number}</span>
                <h3 className="font-display mt-8 text-3xl">{title}</h3>
                <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">{copy}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-kd-black py-24 text-kd-white md:py-36">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">The Collections</p>
            <h2 className="font-display mt-6 max-w-3xl text-5xl font-medium leading-[0.95] md:text-7xl">A wardrobe with <span className="italic text-kd-gold">a point of view.</span></h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-lg text-base leading-8 text-white/60">Explore a considered mix of womenswear, menswear, bespoke pieces, and ready-to-wear collections. Each edit has its own character, held together by the DIXIT identity.</p>
            <Button href="/collections" className="mt-8">View the collections</Button>
          </div>
        </Container>
        {featured.length === 0 && (
          <Container className="mt-16 md:mt-24">
            <ul className="grid gap-6 sm:grid-cols-3">
              {homeCollections.map((category, i) => (
                <li key={category.slug}>
                  <Reveal delay={i * 120}>
                    <Link href={`/collections/${category.slug}`} className="group block">
                      <div className="relative flex aspect-[3/4] flex-col justify-between overflow-hidden border border-white/10 bg-gradient-to-br from-kd-charcoal to-kd-black p-7 transition-colors duration-500 group-hover:border-kd-gold/50">
                        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-white/45">Collection {category.number}</span>
                        <span className="font-display text-[7rem] leading-none text-kd-gold/15 transition-colors duration-500 group-hover:text-kd-gold/35">{category.number}</span>
                      </div>
                      <div className="mt-4 flex items-baseline justify-between gap-4">
                        <span className="font-display text-2xl transition-colors group-hover:text-kd-gold">{category.name}</span>
                        <span className="text-lg text-white/50 transition-transform duration-300 group-hover:translate-x-2" aria-hidden="true">→</span>
                      </div>
                      <p className="mt-2 max-w-xs text-sm leading-6 text-white/50">{category.description}</p>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Container>
        )}
        {featured.length > 0 && (
          <Container className="mt-16 md:mt-24">
            <ul className="grid gap-6 sm:grid-cols-3">
              {featured.map((piece) => (
                <li key={`${piece.collection}/${piece.slug}`}>
                  <Link href={`/collections/${piece.collection}/${piece.slug}`} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-kd-charcoal">
                      <Image src={piece.images[0]} alt={piece.name} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-4">
                      <span className="font-display text-2xl">{piece.name}</span>
                      <span className="text-xs uppercase tracking-[0.14em] text-white/50">{formatPrice(piece.price)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        )}
      </section>

      {testimonials.length > 0 && (
        <section className="bg-kd-cream py-24 text-kd-black md:py-32">
          <Container>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">In Their Words</p>
            <div className={`mt-12 grid gap-12 ${testimonials.length > 1 ? "lg:grid-cols-2" : ""}`}>
              {testimonials.map((t, i) => (
                <Reveal key={t.name} delay={i * 120}>
                  <blockquote className="font-display text-3xl leading-tight md:text-4xl">“{t.quote}”</blockquote>
                  <p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.2em]">{t.name}{t.detail && <span className="font-normal text-kd-gray"> · {t.detail}</span>}</p>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="bg-kd-warm-gold py-24 text-kd-black md:py-32">
        <Container className="text-center">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">Begin with DIXIT</p>
          <h2 className="font-display mx-auto mt-6 max-w-4xl text-5xl font-medium leading-none md:text-7xl">Your style. <span className="block italic">Your statement.</span></h2>
          <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-kd-charcoal/70 md:text-base">Whether you are exploring a collection or considering something made just for you, we would love to hear what you have in mind.</p>
          <Button href="/consultation" className="mt-9">Start a conversation</Button>
        </Container>
      </section>
    </main>
  );
}
