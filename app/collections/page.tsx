import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionIntro } from "@/components/ui/section-intro";

export const metadata = {
  title: "Collections",
  description:
    "Discover made-to-order African luxury menswear by DIXIT, and request a piece shaped around your style and fit.",
};

const edits = [
  {
    number: "01",
    title: "The Signature Edit",
    description:
      "Considered pieces with confident shape, rich texture, and an unmistakable point of view.",
    interest: "ready-to-wear",
  },
  {
    number: "02",
    title: "Occasion Dressing",
    description:
      "Personal dressing for weddings, celebrations, and the moments that deserve to be remembered.",
    interest: "occasion-wear",
  },
  {
    number: "03",
    title: "Bespoke",
    description:
      "A one-to-one process shaped around your measurements, your intentions, and your own sense of style.",
    interest: "bespoke",
  },
];

export default function CollectionsPage() {
  return (
    <main>
      <section className="bg-kd-black py-24 text-kd-white md:py-36">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">
              The DIXIT Point of View
            </p>
            <h1 className="font-display mt-7 max-w-4xl text-[clamp(4rem,9vw,8rem)] font-medium leading-[0.82] tracking-[-0.045em]">
              A wardrobe
              <span className="block italic text-kd-gold">with presence.</span>
            </h1>
          </div>
          <p className="max-w-lg pb-2 text-base leading-8 text-white/60 md:text-lg">
            Explore considered directions in modern African menswear. DIXIT
            pieces are made to order; request the look you love and we will
            confirm fit, price, production timing, and delivery with you.
          </p>
        </Container>
      </section>

      <section className="bg-kd-cream py-24 md:py-32">
        <Container>
          <SectionIntro
            eyebrow="Explore the Edit"
            title={
              <>
                Distinct directions.
                <span className="block italic text-kd-gold-dark">
                  One point of view.
                </span>
              </>
            }
            copy="Choose a direction and tell us what caught your eye. We will confirm the piece details with you before your order is accepted."
          />

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {edits.map((edit) => (
              <article
                key={edit.number}
                className="flex min-h-[22rem] flex-col border-t border-kd-black/20 py-7 md:min-h-[25rem]"
              >
                <span className="text-xs tracking-[0.2em] text-kd-gold-dark">
                  {edit.number}
                </span>
                <div className="mt-auto">
                  <h2 className="font-display text-4xl leading-none md:text-5xl">
                    {edit.title}
                  </h2>
                  <p className="mt-5 max-w-sm text-sm leading-7 text-kd-gray">
                    {edit.description}
                  </p>
                  <Button
                    href={`/consultation?interest=${edit.interest}&intent=${edit.interest === "bespoke" ? "consultation" : "order"}`}
                    variant="outline"
                    className="mt-7"
                  >
                    {edit.interest === "bespoke"
                      ? "Book a bespoke consultation"
                      : "Request a made-to-order piece"}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-kd-warm-gold py-20 md:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">
                Made to Order
              </p>
              <h2 className="font-display mt-6 text-5xl leading-[0.95] md:text-6xl">
                Considered at every step.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-kd-charcoal/70">
                A request is the start of the conversation, not a confirmed
                order. We will agree the details with you before you commit.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                [
                  "01",
                  "Choose your piece",
                  "Tell us which collection or look you have in mind.",
                ],
                [
                  "02",
                  "Confirm your fit",
                  "We will guide you through sizing and the details of the piece.",
                ],
                [
                  "03",
                  "Agree the details",
                  "We confirm price, production timing, delivery, and payment with you before production begins.",
                ],
              ].map(([number, title, copy]) => (
                <article key={number} className="border-t border-kd-black/20 pt-5">
                  <span className="text-xs tracking-[0.2em] text-kd-gold-dark">
                    {number}
                  </span>
                  <h3 className="font-display mt-6 text-3xl">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-kd-charcoal/70">
                    {copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <p className="mt-12 border-t border-kd-black/15 pt-5 text-xs leading-6 text-kd-charcoal/70">
            Product-specific size charts will accompany each piece. For a
            custom fit or personal measurements, book a bespoke consultation.
          </p>
        </Container>
      </section>

      <section className="bg-kd-black text-kd-white">
        <Container className="grid gap-12 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-center md:py-24">
          <div className="relative aspect-[4/5] overflow-hidden bg-kd-charcoal">
            <Image
              src="/brand/dixit-hero.png"
              alt="A DIXIT look in a textured gold jacket, styled against a mountain landscape"
              fill
              sizes="(max-width: 768px) 100vw, 42vw"
              className="object-cover object-[center_18%]"
            />
          </div>
          <div className="py-4 md:py-12">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">
              Made Personal
            </p>
            <h2 className="font-display mt-6 text-5xl leading-[0.95] md:text-7xl">
              Your next piece
              <span className="block italic text-kd-gold">
                starts with a conversation.
              </span>
            </h2>
            <p className="mt-7 max-w-lg text-base leading-8 text-white/60">
              Tell us about the piece, size, or occasion you have in mind. We
              will confirm the details with you before accepting an order.
            </p>
            <Button
              href="/consultation?interest=ready-to-wear&intent=order"
              className="mt-8"
            >
              Request a piece
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
