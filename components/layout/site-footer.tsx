import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { type ContactDetails, type NavItem, whatsappHref } from "@/lib/content";
import { Container } from "@/components/ui/container";

export function SiteFooter({ navigation, contact }: { navigation: NavItem[]; contact: ContactDetails }) {
  const whatsapp = whatsappHref(contact.whatsapp);
  return (
    <footer className="border-t border-white/10 bg-kd-black text-kd-white">
      <Container className="pb-10 pt-4 md:pt-8">
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/brand/dixit-mark.svg" alt="" width={44} height={44} />
              <span className="font-display text-3xl font-semibold tracking-[0.12em]">DIXIT</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">A contemporary fashion house bringing together bespoke craft and ready-to-wear expression.</p>
          </div>
          <div>
            <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/40">Explore</p>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              {navigation.map((item) => <Link key={item.href} href={item.href} className="text-sm text-white/65 transition-colors hover:text-kd-gold">{item.label}</Link>)}
            </nav>
          </div>
          <div>
            <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/40">Contact</p>
            <div className="flex flex-col gap-3 text-sm text-white/65">
              <span>{contact.city}</span>
              {whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-kd-gold">WhatsApp</a>}
              {contact.email && <a href={`mailto:${contact.email}`} className="hover:text-kd-gold">{contact.email}</a>}
              {contact.instagram && <a href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noopener noreferrer" className="hover:text-kd-gold">Instagram</a>}
              <Link href={siteConfig.consultationHref} className="hover:text-kd-gold">Book a consultation</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-[0.68rem] uppercase tracking-[0.14em] text-white/35">
          © {new Date().getFullYear()} DIXIT. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
