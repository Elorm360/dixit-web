import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with DIXIT in Accra to discuss bespoke tailoring, occasion dressing, or a personal consultation.",
};

export default function ContactPage() {
  return (
    <main>
      <section className="bg-kd-cream py-24 md:py-36">
        <Container>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">
            Get in Touch
          </p>
          <div className="mt-8 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <h1 className="font-display max-w-5xl text-[clamp(4rem,9vw,8.5rem)] font-medium leading-[0.82] tracking-[-0.045em]">
              Every great piece
              <span className="block italic text-kd-gold-dark">
                starts somewhere.
              </span>
            </h1>
            <div className="max-w-md pb-2">
              <p className="text-base leading-8 text-kd-gray md:text-lg">
                Whether you have a clear idea or are just beginning to explore,
                we would be glad to hear from you.
              </p>
              <Button href="/consultation" className="mt-7">
                Start a consultation
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-kd-black py-20 text-kd-white md:py-28">
        <Container className="grid gap-12 md:grid-cols-2">
          <div className="border-t border-white/15 pt-6">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-kd-gold">
              Visit the House
            </p>
            <h2 className="font-display mt-5 text-4xl">Accra, Ghana</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/55">
              For appointments and fittings, please get in touch with our team
              first so we can make the time for you.
            </p>
          </div>
          <div className="border-t border-white/15 pt-6">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-kd-gold">
              Begin Online
            </p>
            <h2 className="font-display mt-5 text-4xl">Tell us your vision.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/55">
              Share what you are dressing for, the pieces you are drawn to, or
              simply what you would like to know.
            </p>
            <Link
              href="/consultation"
              className="mt-6 inline-flex border-b border-kd-gold pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-kd-gold"
            >
              Open the enquiry form
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
