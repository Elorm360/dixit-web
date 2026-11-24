import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { contact, whatsappLink } from "@/config/site";

export const metadata = {
  title: "Contact",
  description: "Get in touch with DIXIT in Accra for bespoke, collection, styling, and fashion enquiries.",
};

export default function ContactPage() {
  const whatsapp = whatsappLink("Hello DIXIT, I'd like to make an enquiry.");
  const channels = [
    whatsapp && { label: "WhatsApp", value: `+${contact.whatsapp}`, href: whatsapp },
    contact.email && { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    contact.phone && { label: "Telephone", value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` },
    contact.instagram && { label: "Instagram", value: `@${contact.instagram}`, href: `https://instagram.com/${contact.instagram}` },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <main>
      <section className="bg-kd-black py-24 text-kd-white md:py-36">
        <Container>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">Contact DIXIT</p>
          <h1 className="font-display mt-8 max-w-5xl text-[clamp(3.5rem,10vw,9rem)] font-medium leading-[0.85] tracking-[-0.045em]">Let’s start <span className="block italic text-kd-gold">a conversation.</span></h1>
          <p className="mt-10 max-w-2xl text-base leading-8 text-white/60 md:text-lg">For bespoke requests, collection enquiries or styling, reach us directly or send a detailed enquiry and the DIXIT team will take it from there.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="/consultation">Send an enquiry</Button>
            {whatsapp && <Button href={whatsapp} variant="outline">Chat on WhatsApp</Button>}
          </div>
        </Container>
      </section>
      <section className="bg-kd-cream py-20 text-kd-black md:py-28">
        <Container className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">The Atelier</p>
            <h2 className="font-display mt-6 text-4xl md:text-5xl">{contact.city}.</h2>
            {contact.address.length > 0 && (
              <address className="mt-5 text-sm not-italic leading-7">{contact.address.map((l) => <span key={l} className="block">{l}</span>)}</address>
            )}
            <p className="mt-5 max-w-md text-sm leading-7 text-kd-gray">Consultations are by appointment, at the atelier or remotely.</p>
            {contact.hours && <p className="mt-3 text-sm leading-7">{contact.hours}</p>}
          </div>
          <div className="border-t border-kd-black/15 pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">Reach Us</p>
            {channels.length > 0 ? (
              <dl className="mt-6 divide-y divide-kd-black/15 border-y border-kd-black/15">
                {channels.map((c) => (
                  <div key={c.label} className="flex items-baseline justify-between gap-6 py-5">
                    <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-kd-gray">{c.label}</dt>
                    <dd><a href={c.href} className="font-display text-2xl hover:text-kd-gold-dark" {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{c.value}</a></dd>
                  </div>
                ))}
              </dl>
            ) : (
              <>
                <h2 className="font-display mt-6 text-4xl md:text-5xl">Tell us what you need.</h2>
                <p className="mt-5 max-w-md text-sm leading-7 text-kd-gray">Share your details, preferred meeting format and what you are looking for, and we will respond personally.</p>
                <Button href="/consultation" className="mt-8">Open consultation form</Button>
              </>
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}
