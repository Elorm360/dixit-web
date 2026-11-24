import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { formatPostDate } from "@/data/journal";
import { getJournalPosts } from "@/lib/content";

export const metadata = {
  title: "Journal",
  description: "Notes, perspectives, and stories from the world of DIXIT.",
};

export default async function JournalPage() {
  const posts = await getJournalPosts();
  return (
    <main>
      <section className="bg-kd-black py-24 text-kd-white md:py-36">
        <Container>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">The DIXIT Journal</p>
          <h1 className="font-display mt-8 max-w-5xl text-[clamp(3.5rem,10vw,9rem)] font-medium leading-[0.85] tracking-[-0.045em]">Ideas in <span className="block italic text-kd-gold">good form.</span></h1>
          <p className="mt-10 max-w-2xl text-base leading-8 text-white/60 md:text-lg">Stories, perspectives, and observations on personal style, design, craft, and the culture around what we wear.</p>
        </Container>
      </section>
      <section className="bg-kd-cream py-20 text-kd-black md:py-28">
        {posts.length > 0 ? (
          <Container>
            <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/journal/${post.slug}`} className="group block">
                    {post.image && (
                      <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-kd-warm-gold">
                        <Image src={post.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                      </div>
                    )}
                    <p className="text-[0.65rem] uppercase tracking-[0.2em] text-kd-gray">{formatPostDate(post.date)}</p>
                    <h2 className="font-display mt-3 text-3xl md:text-4xl">{post.title}</h2>
                    <p className="mt-4 max-w-lg text-sm leading-7 text-kd-gray">{post.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        ) : (
          <Container className="max-w-4xl text-center">
            <h2 className="font-display text-5xl font-medium leading-none md:text-7xl">The first stories are <span className="italic text-kd-gold-dark">being prepared.</span></h2>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/collections">Explore collections</Button>
              <Button href="/consultation" variant="outline">Contact DIXIT</Button>
            </div>
          </Container>
        )}
      </section>
    </main>
  );
}
