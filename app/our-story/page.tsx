import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionIntro } from "@/components/ui/section-intro";

export const metadata = {
  title: "Our Story",
  description:
    "Discover the story and values behind KOFFY DODZI, an African luxury menswear house born in Accra.",
};

const values = [
  ["01", "Integrity", "A relationship with the client begins with trust and continues through every detail."],
  ["02", "Precision", "Fit, proportion, finish, and service are approached with deliberate attention."],
  ["03", "African Pride", "The house is rooted in African identity while speaking a contemporary global design language."],
  ["04", "Client First", "Personal understanding and long-term relationships sit at the centre of the experience."],
];

export default function OurStoryPage() {
  return (
    <main>
      <section className="bg-kd-cream py-24 text-kd-black md:py-36">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.55fr_1.45fr]">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">
              Our Story
            </p>
            <div>
              <h1 className="font-display max-w-5xl text-[clamp(4rem,9vw,8.5rem)] font-medium leading-[0.82] tracking-[-0.045em]">
                Born in Accra.
                <span className="block italic text-kd-gold-dark">Built for the world.</span>
              </h1>
              <p className="mt-10 max-w-2xl text-base leading-8 text-kd-gray md:text-lg">
                KOFFY DODZI was built on a simple conviction: African men deserve clothing that fits not only in size, but in spirit.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-kd-black py-24 text-kd-white md:py-36">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <SectionIntro
              inverse
              eyebrow="The Conviction"
              title={<>African luxury, <span className="italic text-kd-gold">on our own terms.</span></>}
            />
          </div>
          <div className="space-y-10 text-lg leading-9 text-white/60">
            <p>
              The house brings together local artisan excellence and a modern global design language, creating menswear for ambitious men who care about identity, presence, and quality.
            </p>
            <p>
              Rather than treating tailoring as a transaction, KOFFY DODZI is designed around relationships — understanding the client, engineering the right silhouette, and staying attentive long after the first fitting.
            </p>
            <div className="border-l border-kd-gold pl-7 font-display text-3xl leading-tight text-white md:text-4xl">
              African Luxury. Tailored to You.
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-kd-cream py-24 md:py-36">
        <Container>
          <SectionIntro
            eyebrow="What We Stand For"
            title={<>Four values. <span className="italic text-kd-gold-dark">One standard.</span></>}
            copy="The character of the house is expressed as much through how clients are treated as through what they wear."
          />
          <div className="mt-16 border-t border-kd-black/15">
            {values.map(([number, title, copy]) => (
              <article key={number} className="grid gap-5 border-b border-kd-black/15 py-8 md:grid-cols-[0.2fr_0.5fr_1.3fr] md:items-start md:py-10">
                <span className="text-xs tracking-[0.2em] text-kd-gold-dark">{number}</span>
                <h3 className="font-display text-3xl">{title}</h3>
                <p className="max-w-xl text-sm leading-7 text-kd-gray">{copy}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-kd-warm-gold py-24 text-center md:py-32">
        <Container>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">The Experience</p>
          <h2 className="font-display mx-auto mt-6 max-w-4xl text-5xl font-medium leading-none md:text-7xl">
            Discover what personal
            <span className="block italic">tailoring should feel like.</span>
          </h2>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/bespoke">Explore bespoke</Button>
            <Link href="/consultation" className="inline-flex min-h-12 items-center justify-center border-b border-kd-black px-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em]">
              Book a consultation
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
