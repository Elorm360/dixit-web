import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ConsultationForm } from "@/components/forms/consultation-form";

export const metadata: Metadata = {
  title: "Private Consultation",
  description:
    "Start a conversation with DIXIT about bespoke tailoring, occasion dressing, or a considered addition to your wardrobe.",
};

type ConsultationPageProps = {
  searchParams: Promise<{ interest?: string; intent?: string }>;
};

const interests = [
  "bespoke",
  "ready-to-wear",
  "occasion-wear",
  "other",
] as const;

export default async function ConsultationPage({
  searchParams,
}: ConsultationPageProps) {
  const { interest, intent } = await searchParams;
  const initialInterest = interests.find((item) => item === interest) ?? "";
  const isOrderRequest = intent === "order";

  return (
    <main>
      <section className="bg-kd-black py-20 text-kd-white md:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">
              Private Consultation
            </p>
            <h1 className="font-display mt-7 max-w-2xl text-[clamp(3.75rem,8vw,7rem)] font-medium leading-[0.84] tracking-[-0.04em]">
              Let&apos;s make
              <span className="block italic text-kd-gold">it personal.</span>
            </h1>
            <p className="mt-8 max-w-lg text-base leading-8 text-white/60 md:text-lg">
              {isOrderRequest
                ? "Tell us which piece you are interested in and your preferred size. The DIXIT team will follow up to confirm fit, price, production timing, delivery, and payment before your order is accepted."
                : "A great piece begins with understanding the person who will wear it. Tell us a little about what you have in mind and our team will be in touch."}
            </p>
            <div className="mt-12 border-t border-white/15 pt-6">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-kd-gold">
                The House
              </p>
              <p className="mt-3 text-sm text-white/60">Accra, Ghana</p>
            </div>
          </div>

          <div className="bg-kd-cream p-6 text-kd-black sm:p-10 md:p-12">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-kd-gold-dark">
              {isOrderRequest ? "Made-to-order request" : "Begin the conversation"}
            </p>
            <h2 className="font-display mt-4 text-4xl md:text-5xl">
              {isOrderRequest ? "Request your piece." : "Tell us what you need."}
            </h2>
            <p className="mt-4 text-sm leading-7 text-kd-gray">
              {isOrderRequest
                ? "This is a request, not a confirmed order. No payment is taken here."
                : "We&apos;ll use your details only to respond to this enquiry."}
            </p>
            <ConsultationForm
              initialInterest={initialInterest}
              isOrderRequest={isOrderRequest}
            />
          </div>
        </Container>
      </section>

      <section className="bg-kd-warm-gold py-14">
        <Container className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <p className="font-display max-w-2xl text-3xl leading-tight md:text-4xl">
            Thoughtful tailoring. A relationship that lasts.
          </p>
          <p className="text-sm text-kd-charcoal/70">
            Based in Accra. Here for your next chapter.
          </p>
        </Container>
      </section>
    </main>
  );
}
