import { ConsultationForm } from "@/components/consultation/consultation-form";
import { Container } from "@/components/ui/container";

export const metadata = {
  title: "Book a Consultation",
  description:
    "Begin a private KOFFY DODZI consultation for bespoke menswear, occasion dressing, styling, and personal wardrobe needs.",
};

export default function ConsultationPage() {
  return (
    <main>
      <section className="bg-kd-black py-24 text-kd-white md:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.55fr_1.45fr]">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">
              Private Consultation
            </p>
            <div>
              <h1 className="font-display max-w-5xl text-[clamp(4rem,9vw,8rem)] font-medium leading-[0.82] tracking-[-0.04em]">
                It starts with
                <span className="block italic text-kd-gold">understanding you.</span>
              </h1>
              <p className="mt-9 max-w-2xl text-base leading-8 text-white/55 md:text-lg">
                Tell us what you are dressing for and how you would like to meet. This gives the house the context to prepare for a more personal conversation.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-kd-cream py-20 text-kd-black md:py-28">
        <Container className="grid gap-14 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">
              Your Request
            </p>
            <p className="mt-6 max-w-sm text-sm leading-7 text-kd-gray">
              The information here is used to understand your initial need. Measurements, detailed styling decisions, and fabric selection belong to the consultation and fitting process.
            </p>
          </aside>
          <ConsultationForm />
        </Container>
      </section>
    </main>
  );
}
