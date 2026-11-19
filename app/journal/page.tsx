import { Container } from "@/components/ui/container";

export const metadata = {
  title: "Journal",
  description:
    "Notes on personal style, considered tailoring, and the details that make a garment your own from DIXIT.",
};

const notes = [
  {
    number: "01",
    category: "The DIXIT Point of View",
    title: "Presence is in the details.",
    copy: "The right proportion, a considered fabric, and a finish that feels like you. A guide to the small decisions that make a look feel complete.",
  },
  {
    number: "02",
    category: "The Bespoke Process",
    title: "A better fit begins with a better conversation.",
    copy: "Bespoke is not just about measurements. It is about understanding the occasion, the person, and how the garment should feel when it is worn.",
  },
  {
    number: "03",
    category: "Care & Craft",
    title: "Make good pieces last.",
    copy: "Thoughtful care protects the shape, texture, and character of the clothes you return to season after season.",
  },
];

export default function JournalPage() {
  return (
    <main>
      <section className="bg-kd-black py-24 text-kd-white md:py-36">
        <Container>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold">
            Notes from the House
          </p>
          <h1 className="font-display mt-7 max-w-5xl text-[clamp(4rem,9vw,8.5rem)] font-medium leading-[0.82] tracking-[-0.045em]">
            The DIXIT
            <span className="block italic text-kd-gold">Journal.</span>
          </h1>
          <p className="mt-10 max-w-xl text-base leading-8 text-white/60 md:text-lg">
            A considered perspective on dressing, craftsmanship, and the
            personal details that give a garment its meaning.
          </p>
        </Container>
      </section>

      <section className="bg-kd-cream py-20 md:py-28">
        <Container>
          <div className="border-t border-kd-black/15">
            {notes.map((note) => (
              <article
                key={note.number}
                className="grid gap-6 border-b border-kd-black/15 py-9 md:grid-cols-[0.15fr_0.55fr_1.3fr] md:gap-10 md:py-12"
              >
                <span className="text-xs tracking-[0.2em] text-kd-gold-dark">
                  {note.number}
                </span>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-kd-gray">
                  {note.category}
                </p>
                <div>
                  <h2 className="font-display max-w-3xl text-4xl leading-none md:text-5xl">
                    {note.title}
                  </h2>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-kd-gray md:text-base">
                    {note.copy}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-8 text-xs leading-6 text-kd-gray">
            These introductory notes are editorial previews. More stories from
            the house will be added as the collection develops.
          </p>
        </Container>
      </section>
    </main>
  );
}
