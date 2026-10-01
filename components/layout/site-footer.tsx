import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="bg-kd-black text-kd-white">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-[1.3fr_1fr] md:items-end">
          <div>
            <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">
              African Luxury Menswear
            </p>
            <h2 className="font-display max-w-2xl text-4xl font-medium leading-none md:text-6xl">
              Tailored with precision. Made personal.
            </h2>
          </div>
          <div className="md:justify-self-end">
            <Button href={siteConfig.consultationHref}>Book a consultation</Button>
          </div>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-display text-3xl font-semibold tracking-[0.08em]">
              KOFFY DODZI
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">
              Born in Accra. Built for the world.
            </p>
          </div>

          <div>
            <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/40">
              Explore
            </p>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              {siteConfig.navigation.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-white/65 transition-colors hover:text-kd-gold">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/40">
              Location
            </p>
            <p className="text-sm leading-7 text-white/65">Accra, Ghana</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-[0.68rem] uppercase tracking-[0.14em] text-white/35">
          © {new Date().getFullYear()} KOFFY DODZI. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
