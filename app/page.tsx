import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const collectionEdits = [
  {
    number: "01",
    title: "The Signature Edit",
    copy: "Strong silhouettes, considered texture, and an unmistakable DIXIT point of view.",
    href: "/collections",
  },
  {
    number: "02",
    title: "Occasion Dressing",
    copy: "Personal pieces for weddings, celebrations, and the moments worth remembering.",
    href: "/collections",
  },
  {
    number: "03",
    title: "Bespoke",
    copy: "A one-to-one process shaped around your measurements and your own sense of style.",
    href: "/bespoke",
  },
];

export default function Home() {
  return (
    <main>
      <section className="overflow-hidden bg-kd-gold text-kd-black">
        <Container className="grid items-center gap-10 py-8 md:py-12 lg:min-h-[calc(100svh-6rem)] lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:py-10">
          <div className="relative z-10 py-6 lg:py-12">
            <p className="flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-kd-black/75">
              <span className="h-px w-8 bg-kd-black" aria-hidden="true" />
              African luxury menswear · Accra
            </p>
            <h1 className="font-display mt-8 max-w-3xl text-[clamp(4.5rem,9.5vw,8.75rem)] font-medium leading-[0.76] tracking-[-0.055em]">
              Wear your
              <span className="block italic">own</span>
              <span className="block">direction.</span>
            </h1>
            <p className="mt-8 max-w-lg text-base leading-8 text-kd-black/75 md:text-lg">
              Made in Accra for the man who knows himself. DIXIT brings
              considered tailoring, African identity, and a modern point of
              view into one distinctive wardrobe.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                href="/collections"
                className="bg-kd-black text-kd-gold hover:bg-kd-charcoal"
              >
                Explore the collections
              </Button>
              <Button
                href="/consultation"
                variant="outline"
                className="border-kd-black text-kd-black hover:border-kd-black hover:bg-kd-black hover:text-kd-gold"
              >
                Book a consultation
              </Button>
            </div>
            <div className="mt-12 flex items-center gap-4 border-t border-kd-black/20 pt-5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-kd-black/65">
              <span>Made to order</span>
              <span className="h-1 w-1 rounded-full bg-kd-black/60" />
              <span>Made personal</span>
            </div>
          </div>

          <figure className="relative mx-auto aspect-[2/3] w-full max-w-[30rem] overflow-hidden bg-kd-charcoal lg:justify-self-end">
            <Image
              src="/brand/dixit-hero.png"
              alt="A DIXIT look in a textured gold jacket, photographed in a dramatic mountain landscape"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-5 pb-5 pt-20 text-white sm:px-7 sm:pb-7">
              <span className="font-display text-2xl italic sm:text-3xl">
                Presence, considered.
              </span>
              <span className="pb-1 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-kd-gold">
                DIXIT · GH
              </span>
            </figcaption>
          </figure>
        </Container>
      </section>

      <section className="bg-kd-cream py-24 text-kd-black md:py-32">
        <Container className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-kd-gold-dark">
              The House
            </p>
            <p className="font-display mt-6 text-3xl italic leading-tight text-kd-gray md:text-4xl">
              A point of view, not a uniform.
            </p>
          </div>
          <div>
            <h2 className="font-display max-w-4xl text-5xl font-medium leading-[0.95] tracking-[-0.03em] md:text-7xl">
              Born in Accra.
              <span className="block italic text-kd-gold-dark">
                Built for the world.
              </span>
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-kd-gray md:text-lg">
              DIXIT is African luxury menswear with a clear sense of self:
              precise in its craft, confident in its silhouette, and personal
              in every detail.
            </p>
            <Link
              href="/our-story"
              className="mt-8 inline-flex border-b border-kd-black pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-kd-gold-dark hover:text-kd-gold-dark"
            >
              Discover our story
            </Link>
          </div>
        </Container>
      </section>

      <section className="bg-kd-black py-24 text-kd-white md:py-32">
        <Container>
          <div className="grid gap-8 border-b border-white/15 pb-10 md:grid-cols-[1fr_auto] md:items-end md:pb-12">
            <div>
              <p className="mb-5 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-kd-gold">
                The Collections
              </p>
              <h2 className="font-display max-w-4xl text-5xl font-medium leading-[0.92] tracking-[-0.03em] md:text-7xl">
                A wardrobe
                <span className="block italic text-kd-gold">
                  with intention.
                </span>
              </h2>
            </div>
            <Button href="/collections" variant="outline">
              View the collections
            </Button>
          </div>

          <div className="grid md:grid-cols-3">
            {collectionEdits.map((edit) => (
              <article
                key={edit.number}
                className="border-b border-white/15 py-8 md:border-b-0 md:border-r md:px-8 md:py-10 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <span className="text-xs tracking-[0.2em] text-kd-gold">
                  {edit.number}
                </span>
                <h3 className="font-display mt-10 text-3xl md:text-4xl">
                  {edit.title}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-7 text-white/60">
                  {edit.copy}
                </p>
                <Link
                  href={edit.href}
                  className="mt-7 inline-flex text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-kd-gold transition-colors hover:text-white"
                >
                  Discover the edit
                </Link>
              </article>
            ))}
          </div>
          <p className="mt-8 text-xs leading-6 text-white/45">
            Made-to-order requests are confirmed personally by the DIXIT team.
            Pricing, fit, and delivery are agreed before an order is accepted.
          </p>
        </Container>
      </section>

      <section className="bg-kd-warm-gold py-24 text-kd-black md:py-32">
        <Container className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-kd-gold-dark">
              The DIXIT Standard
            </p>
          </div>
          <div>
            <h2 className="font-display max-w-4xl text-5xl font-medium leading-[0.95] tracking-[-0.03em] md:text-7xl">
              Tailored to the man,
              <span className="block italic text-kd-gold-dark">
                never the mannequin.
              </span>
            </h2>
            <div className="mt-12 grid gap-8 border-t border-kd-black/20 pt-8 md:grid-cols-3">
              {[
                [
                  "01",
                  "The conversation",
                  "We begin with your occasion, your preferences, and the way you want to feel.",
                ],
                [
                  "02",
                  "The consideration",
                  "Silhouette, textile, and detail come together around you.",
                ],
                [
                  "03",
                  "The craft",
                  "Each piece is shaped with precision and care in Accra.",
                ],
              ].map(([number, title, copy]) => (
                <article key={number}>
                  <span className="text-xs tracking-[0.2em] text-kd-gold-dark">
                    {number}
                  </span>
                  <h3 className="font-display mt-5 text-3xl">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-kd-charcoal/75">
                    {copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-kd-gold py-24 text-kd-black md:py-32">
        <Container className="text-center">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-kd-black/70">
            Private Consultation
          </p>
          <h2 className="font-display mx-auto mt-6 max-w-4xl text-5xl font-medium leading-[0.92] tracking-[-0.03em] md:text-7xl">
            Your next piece begins
            <span className="block italic">with a conversation.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-kd-black/75 md:text-base">
            Tell us what you are dressing for. We will guide the silhouette,
            fabric, and experience from there.
          </p>
          <Button
            href="/consultation"
            className="mt-9 bg-kd-black text-kd-gold hover:bg-kd-charcoal"
          >
            Begin the conversation
          </Button>
        </Container>
      </section>
    </main>
  );
}
