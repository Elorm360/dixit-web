import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { formatPostDate, getPost, posts } from "@/data/journal";

type PostPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  // Next needs at least one param set for a static route; this placeholder 404s.
  return posts.length ? posts.map(({ slug }) => ({ slug })) : [{ slug: "none" }];
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = getPost((await params).slug);
  return post ? { title: post.title, description: post.excerpt, openGraph: post.image ? { images: [post.image] } : undefined } : {};
}

export default async function PostPage({ params }: PostPageProps) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  return (
    <main className="bg-kd-cream text-kd-black">
      <Container className="max-w-3xl py-16 md:py-24">
        <Link href="/journal" className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gray hover:text-kd-gold-dark">← Journal</Link>
        <p className="mt-10 text-[0.65rem] uppercase tracking-[0.2em] text-kd-gray">{formatPostDate(post.date)}</p>
        <h1 className="font-display mt-4 text-5xl font-medium leading-none md:text-7xl">{post.title}</h1>
        {post.image && (
          <div className="relative mt-12 aspect-[4/3] bg-kd-warm-gold">
            <Image src={post.image} alt="" fill priority sizes="(min-width: 768px) 48rem, 100vw" className="object-cover" />
          </div>
        )}
        <div className="mt-12 space-y-6 text-lg leading-9 text-kd-charcoal/85">
          {post.body.map((p) => <p key={p}>{p}</p>)}
        </div>
        <div className="mt-16 border-t border-kd-black/15 pt-10">
          <Button href="/consultation">Start a conversation</Button>
        </div>
      </Container>
    </main>
  );
}
