import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata = {
  title: "Contact",
  description: "Get in touch with DIXIT for bespoke, collection, styling, and fashion enquiries.",
};

export default function ContactPage() {
  return (
    <main>
      <section className="bg-kd-black py-28 text-kd-white md:py-40">
        <Container>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">Contact DIXIT</p>
          <h1 className="font-display mt-8 max-w-5xl text-[clamp(4.5rem,10vw,9rem)] font-medium leading-[0.8] tracking-[-0.045em]">Let’s start <span className="block italic text-kd-gold">a conversation.</span></h1>
          <p className="mt-10 max-w-2xl text-base leading-8 text-white/60 md:text-lg">For bespoke requests, collection enquiries, styling, or anything else, share a little about what you have in mind and the DIXIT team will take it from there.</p>
          <Button href="/consultation" className="mt-10">Send an enquiry</Button>
        </Container>
      </section>
      <section className="bg-kd-cream py-20 text-kd-black md:py-28">
        <Container className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">Visit / Connect</p>
            <h2 className="font-display mt-6 text-4xl md:text-5xl">Accra, Ghana.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-kd-gray">DIXIT is based in Accra. Consultations are arranged by appointment, either at the atelier or remotely.</p>
          </div>
          <div className="border-t border-kd-black/15 pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">Enquiries</p>
            <h2 className="font-display mt-6 text-4xl md:text-5xl">Tell us what you need.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-kd-gray">Use the consultation form to share your details, preferred meeting format, and the kind of DIXIT experience you are looking for.</p>
            <Button href="/consultation" className="mt-8">Open consultation form</Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
