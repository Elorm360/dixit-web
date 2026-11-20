import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata = {
  title: "Journal",
  description: "Notes, perspectives, and stories from the world of DIXIT.",
};

export default function JournalPage() {
  return (
    <main>
      <section className="bg-kd-black py-28 text-kd-white md:py-40">
        <Container>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">The DIXIT Journal</p>
          <h1 className="font-display mt-8 max-w-5xl text-[clamp(4.5rem,10vw,9rem)] font-medium leading-[0.8] tracking-[-0.045em]">Ideas in <span className="block italic text-kd-gold">good form.</span></h1>
          <p className="mt-10 max-w-2xl text-base leading-8 text-white/60 md:text-lg">A space for stories, perspectives, and observations on personal style, design, craft, and the culture around what we wear.</p>
        </Container>
      </section>
      <section className="bg-kd-cream py-28 text-kd-black md:py-40">
        <Container className="max-w-4xl text-center">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">Coming into focus</p>
          <h2 className="font-display mt-7 text-5xl font-medium leading-none md:text-7xl">The first stories are <span className="italic text-kd-gold-dark">being prepared.</span></h2>
          <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-kd-gray md:text-base">The DIXIT Journal is taking shape. In the meantime, explore the collections or begin a conversation with our team.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/collections">Explore collections</Button>
            <Button href="/consultation" variant="outline">Contact DIXIT</Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
