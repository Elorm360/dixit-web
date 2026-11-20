import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionIntro } from "@/components/ui/section-intro";

export const metadata = {
  title: "The House",
  description: "Discover the DIXIT point of view: a contemporary fashion house shaped by individuality, considered design, and craft.",
};

const values = [
  ["01", "Individuality", "Personal style is not prescribed. It is discovered, refined, and expressed with confidence."],
  ["02", "Considered Design", "Every silhouette, material, and detail should have a reason to be there."],
  ["03", "Craft", "We value the skill, patience, and attention that transform an idea into something worth keeping."],
  ["04", "Expression", "Fashion is a language: cultural, personal, and always evolving."],
];

export default function OurStoryPage() {
  return (
    <main>
      <section className="bg-kd-cream py-24 text-kd-black md:py-36">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.55fr_1.45fr]">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">The House of DIXIT</p>
            <div>
              <h1 className="font-display max-w-5xl text-[clamp(4rem,9vw,8.5rem)] font-medium leading-[0.82] tracking-[-0.045em]">Style is a <span className="block italic text-kd-gold-dark">statement.</span></h1>
              <p className="mt-10 max-w-2xl text-base leading-8 text-kd-gray md:text-lg">DIXIT exists for people who see clothing as more than what they wear. It is a way to communicate identity, point of view, and presence.</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-kd-black py-24 text-kd-white md:py-36">
        <Container className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <SectionIntro inverse eyebrow="Our Point of View" title={<>Fashion with <span className="italic text-kd-gold">intention.</span></>} />
          </div>
          <div className="space-y-10 text-lg leading-9 text-white/60">
            <p>DIXIT brings together bespoke tailoring, ready-to-wear collections, and a wider fashion perspective under one considered identity.</p>
            <p>We believe the best style feels personal. It respects the individual, celebrates craftsmanship, and makes room for both quiet refinement and bold expression.</p>
            <div className="border-l border-kd-gold pl-7 font-display text-3xl leading-tight text-white md:text-4xl">A point of view, made visible.</div>
          </div>
        </Container>
      </section>

      <section className="bg-kd-cream py-24 md:py-36">
        <Container>
          <SectionIntro eyebrow="What Shapes Us" title={<>Four principles. <span className="italic text-kd-gold-dark">One point of view.</span></>} copy="The character of DIXIT is expressed through the choices we make, the details we value, and the experience we create." />
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
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">Discover DIXIT</p>
          <h2 className="font-display mx-auto mt-6 max-w-4xl text-5xl font-medium leading-none md:text-7xl">Find your fit. <span className="block italic">Define your expression.</span></h2>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/collections">Explore collections</Button>
            <Link href="/consultation" className="inline-flex min-h-12 items-center justify-center border-b border-kd-black px-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em]">Start a conversation</Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
