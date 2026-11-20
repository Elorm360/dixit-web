import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function NotFound() {
  return (
    <>
    <SiteHeader />
    <main className="bg-kd-black py-32 text-kd-white md:py-44">
      <Container>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">Page not found</p>
        <h1 className="font-display mt-8 text-[clamp(3.5rem,9vw,8rem)] font-medium leading-[0.85] tracking-[-0.04em]">This look <span className="block italic text-kd-gold">isn’t here.</span></h1>
        <p className="mt-8 max-w-xl text-base leading-8 text-white/60">The page may have moved. Explore the collections or start a conversation with us.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/collections">Explore collections</Button>
          <Button href="/" variant="outline">Back to home</Button>
        </div>
      </Container>
    </main>
    <SiteFooter />
    </>
  );
}
