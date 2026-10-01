import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function Home() {
  return (
    <main>
      <section className="relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden bg-kd-black text-kd-white">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_70%_30%,rgba(201,168,76,0.12),transparent_35%)]" />
        <div className="absolute inset-y-0 right-0 -z-10 hidden w-[44%] border-l border-white/10 lg:block" />

        <Container className="grid gap-16 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28">
          <div className="max-w-4xl">
            <p className="mb-7 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-kd-gold">
              African Luxury Menswear
            </p>
            <h1 className="font-display text-[clamp(4.5rem,10vw,9rem)] font-medium leading-[0.78] tracking-[-0.04em]">
              Built
              <span className="block italic text-kd-gold">Different.</span>
            </h1>
            <p className="mt-9 max-w-xl text-base leading-8 text-white/65 md:text-lg">
              Bespoke menswear for the modern African man — shaped by precision,
              craftsmanship, and personal expression.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href="/consultation">Book a consultation</Button>
              <Button href="/collections" variant="outline">
                Explore collections
              </Button>
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-none">
            <div className="absolute h-[80%] w-[80%] border border-kd-gold/25" />
            <div className="relative m-8 aspect-[4/5] w-full overflow-hidden bg-kd-gold">
              <Image
                src="/brand/dodzi%20logo.jpg"
                alt="KOFFY DODZI house emblem"
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 36vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>

        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-[0.6rem] uppercase tracking-[0.3em] text-white/35 md:block">
          Accra · Ghana
        </div>
      </section>

      <section className="bg-kd-cream py-24 text-kd-black md:py-36">
        <Container className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">
              The House
            </p>
          </div>
          <div>
            <h2 className="font-display max-w-4xl text-5xl font-medium leading-[0.98] tracking-[-0.025em] md:text-7xl">
              Born in Accra.
              <span className="block italic text-kd-gold-dark">
                Built for the world.
              </span>
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-8 text-kd-gray md:text-lg">
              KOFFY DODZI brings together African identity, master craftsmanship,
              and a global design language to create clothing with presence and
              purpose.
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

      <section className="bg-kd-charcoal py-24 text-kd-white md:py-32">
        <Container>
          <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="mb-5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">
                The Bespoke Experience
              </p>
              <h2 className="font-display max-w-3xl text-5xl font-medium leading-none md:text-7xl">
                Tailored to the man,
                <span className="block italic text-white/55">not the mannequin.</span>
              </h2>
            </div>
            <Button href="/bespoke" variant="outline">
              Explore bespoke
            </Button>
          </div>

          <div className="grid md:grid-cols-3">
            {[
              ["01", "Consultation", "We begin with your occasion, preferences, lifestyle, and the way you want to feel."],
              ["02", "Silhouette & Fabric", "Proportion, textile, and detail are considered together to shape a distinctly personal piece."],
              ["03", "Craft & Fitting", "Precision tailoring and attentive fittings refine the garment before final delivery."],
            ].map(([number, title, copy]) => (
              <article key={number} className="border-b border-white/10 py-10 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                <span className="text-xs tracking-[0.2em] text-kd-gold">{number}</span>
                <h3 className="font-display mt-8 text-3xl">{title}</h3>
                <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">{copy}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-kd-warm-gold py-24 text-kd-black md:py-32">
        <Container className="text-center">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">
            Private Consultation
          </p>
          <h2 className="font-display mx-auto mt-6 max-w-4xl text-5xl font-medium leading-none md:text-7xl">
            Your next piece begins
            <span className="block italic">with a conversation.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-kd-charcoal/70 md:text-base">
            Tell us what you are dressing for. We will guide the silhouette,
            fabric, and experience from there.
          </p>
          <Button href="/consultation" className="mt-9">
            Book a consultation
          </Button>
        </Container>
      </section>
    </main>
  );
}
