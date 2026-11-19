import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const pillars = [
  ["01", "Bespoke", "Personal pieces shaped around your proportions, preferences, and occasion."],
  ["02", "Ready to Wear", "A considered wardrobe of distinctive pieces, designed to be lived in."],
  ["03", "The Collections", "A changing expression of the DIXIT point of view across fashion and form."],
];

export default function Home() {
  return (
    <main>
      <section className="relative isolate flex min-h-[calc(100svh-5rem)] items-end overflow-hidden bg-kd-black text-kd-white">
        <Image
          src="/brand/dixit-hero.jpg"
          alt="DIXIT editorial look: textured gold jacket styled with black tailoring in a dramatic open landscape"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/35 to-black/10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/65 via-transparent to-black/10" />
        <Container className="grid min-h-[calc(100svh-5rem)] items-end gap-10 pb-16 pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:pb-24">
          <div className="max-w-4xl">
            <p className="mb-7 text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-kd-gold">A Modern Fashion House</p>
            <h1 className="font-display text-[clamp(4.5rem,11vw,10rem)] font-medium leading-[0.78] tracking-[-0.05em]">Style is a <span className="block italic text-kd-gold">statement.</span></h1>
            <p className="mt-9 max-w-xl text-base leading-8 text-white/85 md:text-lg">Bespoke craft. Ready-to-wear expression. A wardrobe shaped around individuality.</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href="/collections">Explore collections</Button>
              <Button href="/our-story" variant="outline">Discover DIXIT</Button>
            </div>
          </div>
          <div className="hidden items-end justify-end lg:flex">
            <div className="relative w-64 border border-kd-gold/50 bg-black/30 p-7 backdrop-blur-sm">
              <Image src="/brand/dixit-mark.svg" alt="DIXIT monogram" width={180} height={180} className="mx-auto h-auto w-full" />
              <p className="mt-4 text-center text-[0.58rem] uppercase tracking-[0.3em] text-kd-gold">Designed with intention</p>
            </div>
          </div>
        </Container>
        <div className="absolute bottom-7 right-8 hidden text-[0.6rem] uppercase tracking-[0.3em] text-white/75 md:block">Accra · Beyond</div>
      </section>

      <section className="bg-kd-cream py-24 text-kd-black md:py-36">
        <Container className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">The DIXIT Point of View</p>
          <div>
            <h2 className="font-display max-w-4xl text-5xl font-medium leading-[0.98] tracking-[-0.025em] md:text-7xl">Clothing is what you wear. <span className="block italic text-kd-gold-dark">Style is what you say.</span></h2>
            <p className="mt-8 max-w-2xl text-base leading-8 text-kd-gray md:text-lg">DIXIT brings bespoke tailoring, ready-to-wear collections, and a wider fashion perspective together in one house — with room for individuality at every turn.</p>
            <Link href="/our-story" className="mt-8 inline-flex border-b border-kd-black pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-kd-gold-dark hover:text-kd-gold-dark">Discover the house</Link>
          </div>
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
              <article key={number} className="border-b border-white/10 py-10 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                <span className="text-xs tracking-[0.2em] text-kd-gold">{number}</span>
                <h3 className="font-display mt-8 text-3xl">{title}</h3>
                <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">{copy}</p>
              </article>
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
      </section>

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
