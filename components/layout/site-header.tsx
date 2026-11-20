"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-kd-black text-kd-white">
      <Container className="flex h-20 items-center justify-between lg:h-24">
        <Link href="/" className="flex items-center gap-3" aria-label="DIXIT home" onClick={() => setMenuOpen(false)}>
          <Image src="/brand/dixit-mark.svg" alt="DIXIT monogram" width={48} height={48} className="h-12 w-12 object-contain" priority />
          <span className="font-display text-2xl font-semibold tracking-[0.14em]">DIXIT</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {siteConfig.navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-kd-gold">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block"><Button href={siteConfig.consultationHref}>Start a conversation</Button></div>

        <button type="button" className="flex h-11 w-11 items-center justify-center lg:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>
          <span className="flex w-6 flex-col gap-1.5" aria-hidden="true">
            <span className={`h-px w-full bg-current transition-transform ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`h-px w-full bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-px w-full bg-current transition-transform ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </span>
        </button>
      </Container>

      <div id="mobile-navigation" className={`overflow-hidden border-t border-white/10 bg-kd-black transition-[max-height,opacity] duration-300 lg:hidden ${menuOpen ? "max-h-[34rem] opacity-100" : "max-h-0 border-t-transparent opacity-0"}`}>
        <Container className="flex flex-col py-8">
          <nav className="flex flex-col" aria-label="Mobile navigation">
            {siteConfig.navigation.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="border-b border-white/10 py-4 font-display text-3xl text-white/90 transition-colors hover:text-kd-gold">
                {item.label}
              </Link>
            ))}
          </nav>
          <Button href={siteConfig.consultationHref} className="mt-8 w-full">Start a conversation</Button>
        </Container>
      </div>
    </header>
  );
}
