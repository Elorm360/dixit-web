import { Container } from "@/components/ui/container";

export const metadata = {
  title: "Privacy Notice",
  description:
    "How DIXIT uses the details you share when you send a consultation enquiry.",
};

export default function PrivacyPage() {
  return (
    <main className="bg-kd-cream py-20 md:py-28">
      <Container className="max-w-3xl">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">
          Your Information
        </p>
        <h1 className="font-display mt-6 text-6xl md:text-8xl">
          Privacy notice
        </h1>
        <p className="mt-5 text-sm text-kd-gray">
          Draft for review before the website is published.
        </p>

        <div className="mt-12 space-y-9 text-sm leading-7 text-kd-charcoal">
          <section>
            <h2 className="font-display text-3xl text-kd-black">
              Information you share
            </h2>
            <p className="mt-3">
              If you submit a consultation enquiry, we collect the name and
              email address you provide, and any optional phone number and
              message you choose to share. Please do not include sensitive
              personal information in your message.
            </p>
          </section>
          <section>
            <h2 className="font-display text-3xl text-kd-black">
              How we use it
            </h2>
            <p className="mt-3">
              We use enquiry details to understand your request and respond to
              you. We do not use the consultation form to sign you up for
              marketing messages.
            </p>
          </section>
          <section>
            <h2 className="font-display text-3xl text-kd-black">
              Storage and access
            </h2>
            <p className="mt-3">
              Consultation enquiries are intended to be stored in DIXIT&apos;s
              Supabase project and accessible only to authorized DIXIT
              personnel. The website&apos;s public database policy permits
              submissions only; it does not permit visitors to read other
              enquiries.
            </p>
          </section>
          <section>
            <h2 className="font-display text-3xl text-kd-black">
              Retention and your choices
            </h2>
            <p className="mt-3">
              DIXIT should set a retention period and add a contact route for
              access or deletion requests before launch. This draft must be
              reviewed and completed with the business&apos;s actual privacy
              contact and applicable requirements before the site goes live.
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
