import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-kd-black text-kd-white">
      <section className="kd-container flex min-h-screen flex-col items-center justify-center py-16 text-center">
        <div className="mb-10 overflow-hidden">
          <Image
            src="/brand/koffy-dodzi-emblem.jpg"
            alt="KOFFY DODZI emblem"
            width={180}
            height={180}
            priority
            className="h-36 w-36 object-cover md:h-44 md:w-44"
          />
        </div>

        <p className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-kd-gold">
          African Luxury Menswear
        </p>

        <h1 className="font-display text-6xl font-medium tracking-tight md:text-8xl lg:text-9xl">
          KOFFY DODZI
        </h1>

        <div className="my-8 h-px w-16 bg-kd-gold" />

        <p className="max-w-xl text-sm leading-7 text-white/65 md:text-base">
          Born in Accra. Built for the world.
        </p>
      </section>
    </main>
  );
}
