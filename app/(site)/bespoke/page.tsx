import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionIntro } from "@/components/ui/section-intro";
import { formatPrice } from "@/config/site";
import { getSiteContent } from "@/lib/content";

export const metadata = {
  title: "Bespoke",
  description: "Discover the DIXIT bespoke experience: personal design, considered materials, precision craft, and individual fit.",
};

const steps = [
  ["01", "Consultation", "We begin with your occasion, preferences, lifestyle, and the expression you want your piece to carry."],
  ["02", "Style & Silhouette", "The shape of the garment is considered around your proportions and personal point of view."],
  ["03", "Fabric Selection", "Materials are selected with the garment, occasion, comfort, and finish in mind."],
  ["04", "Measurement", "Detailed measurements establish the foundation for an individual fit."],
  ["05", "Craftsmanship", "The garment moves into production with close attention to construction, proportion, and finishing."],
  ["06", "Fitting", "The piece is assessed and refined where necessary before completion."],
  ["07", "Delivery", "The completed garment is prepared with the agreed details and timing in focus."],
  ["08", "Client Care", "The relationship continues beyond delivery through attentive follow-up and future wardrobe needs."],
];

const faqs = [
  ["How do I begin?", "Send an enquiry or message us on WhatsApp. We will arrange a consultation at the atelier or remotely to understand the occasion, your style and your timing."],
  ["Can I have a piece made if I am outside Ghana?", "Yes. Remote consultations are available, and we will guide you through taking measurements and confirming details from wherever you are."],
  ["How is pricing decided?", "Every bespoke piece is quoted individually, based on the design, fabric and level of handwork involved. You receive a clear quote before anything begins."],
  ["Can I bring my own fabric or reference images?", "Of course. Share images, sketches or fabric with us during your consultation and we will advise on what will work best."],
  ["What if the fit needs adjusting?", "Fittings are part of the process. The garment is refined until it fits as it should before it is delivered."],
];

export default async function BespokePage() {
  const { pricing } = await getSiteContent();
  return (
    <main>
      <section className="bg-kd-black py-24 text-kd-white md:py-36">
        <Container>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">The DIXIT Bespoke Experience</p>
          <h1 className="font-display mt-7 max-w-5xl text-[clamp(4.5rem,10vw,9rem)] font-medium leading-[0.8] tracking-[-0.045em]">Made for <span className="block italic text-kd-gold">you.</span></h1>
          <div className="mt-12 grid gap-8 border-t border-white/15 pt-8 md:grid-cols-2">
            <p className="max-w-lg text-base leading-8 text-white/60 md:text-lg">Bespoke at DIXIT is personal by design — bringing together individual fit, considered materials, and attentive craft.</p>
            <div className="md:justify-self-end"><Button href="/consultation">Begin your consultation</Button></div>
          </div>
        </Container>
      </section>
      <section className="bg-kd-cream py-24 md:py-36">
        <Container>
          <SectionIntro eyebrow="The Process" title={<>From conversation <span className="italic text-kd-gold-dark">to creation.</span></>} copy="Every stage exists to make the final piece more considered, more personal, and distinctly yours." />
          <div className="mt-16">
            {steps.map(([number, title, copy]) => (
              <article key={number} className="group grid gap-5 border-t border-kd-black/15 py-8 md:grid-cols-[0.25fr_0.6fr_1.15fr] md:items-start md:py-10">
                <span className="text-xs tracking-[0.2em] text-kd-gold-dark">{number}</span>
                <h2 className="font-display text-3xl transition-transform duration-300 group-hover:translate-x-2 md:text-4xl">{title}</h2>
                <p className="max-w-xl text-sm leading-7 text-kd-gray md:text-base">{copy}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <section className="bg-kd-warm-gold py-24 text-kd-black md:py-32">
        <Container className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <SectionIntro eyebrow="Investment & Timing" title={<>Clear from <span className="italic text-kd-gold-dark">the start.</span></>} />
            <dl className="mt-10 grid gap-6 border-t border-kd-black/15 pt-8 sm:grid-cols-2">
              <div><dt className="kd-label">Bespoke pieces</dt><dd className="font-display text-3xl">{pricing.bespokeStartingFrom != null ? `From ${formatPrice(pricing.bespokeStartingFrom)}` : "Quoted individually"}</dd></div>
              <div><dt className="kd-label">Typical timing</dt><dd className="font-display text-3xl">{pricing.bespokeLeadTime || "Confirmed at consultation"}</dd></div>
            </dl>
            <p className="mt-6 max-w-md text-sm leading-7 text-kd-charcoal/70">For events, get in touch as early as you can so there is time for fittings.</p>
          </div>
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">Questions</p>
            <div className="mt-6 border-t border-kd-black/15">
              {faqs.map(([q, a]) => (
                <details key={q} className="group border-b border-kd-black/15 py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-2xl md:text-3xl">
                    {q}<span className="text-xl transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-kd-charcoal/75">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <section className="bg-kd-charcoal py-24 text-kd-white md:py-32">
        <Container className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div><p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">A Personal Beginning</p><h2 className="font-display mt-6 max-w-4xl text-5xl font-medium leading-none md:text-7xl">Your idea. <span className="block italic text-white/55">Our craft.</span></h2></div>
          <div className="lg:justify-self-end"><Button href="/consultation">Start a conversation</Button></div>
        </Container>
      </section>
    </main>
  );
}
