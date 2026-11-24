import Link from "next/link";
import { Field, PhotoField, SectionForm } from "@/components/admin/content-fields";
import { PageHeader, Panel } from "@/components/admin/ui";
import { requireStaff } from "@/lib/admin";
import { DEFAULT_HERO_IMAGE, type SiteContent, defaultContent, pick, sitePhotoUrl } from "@/lib/content";
import { saveContact, saveFounder, saveHomepage, savePricing } from "./actions";

export const metadata = { title: "Website content" };

const sections = [
  { id: "business", label: "Business details" },
  { id: "homepage", label: "Homepage" },
  { id: "house", label: "The House (founder)" },
  { id: "bespoke", label: "Bespoke pricing" },
];

export default async function ContentPage() {
  const { supabase } = await requireStaff();
  const { data, error } = await supabase.from("site_content").select("key, value");
  const byKey = new Map((data ?? []).map((r) => [r.key as keyof SiteContent, r.value]));
  const contact = pick(defaultContent.contact, byKey.get("contact"));
  const homepage = pick(defaultContent.homepage, byKey.get("homepage"));
  const founder = pick(defaultContent.founder, byKey.get("founder"));
  const pricing = pick(defaultContent.pricing, byKey.get("pricing"));
  const storageBase = sitePhotoUrl("").replace(/\/$/, "");
  const storedPhoto = (p: string) => (p && !p.startsWith("/") ? p : "");

  return (
    <>
      <PageHeader eyebrow="Edit the website" title="Website content" />

      {error && (
        <p className="mb-6 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
          Website content isn’t set up in the database yet, so saving won’t work. The site keeps showing its current text.
        </p>
      )}

      <nav className="mb-8 flex flex-wrap gap-2" aria-label="Content sections">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="bg-kd-white px-3 py-2 text-xs text-kd-gray hover:text-kd-black">{s.label}</a>
        ))}
        <Link href="/admin/content/testimonials" className="bg-kd-white px-3 py-2 text-xs text-kd-gray hover:text-kd-black">Testimonials →</Link>
        <Link href="/admin/content/journal" className="bg-kd-white px-3 py-2 text-xs text-kd-gray hover:text-kd-black">Journal →</Link>
      </nav>

      <div className="space-y-8">
        <Panel className="scroll-mt-8 p-6 md:p-8">
          <div id="business" className="scroll-mt-8" />
          <h2 className="font-display text-2xl">Business details</h2>
          <p className="mb-6 mt-1 text-sm text-kd-gray">Shown on the Contact page, in the footer and on the WhatsApp button. Leave anything empty to hide it.</p>
          <SectionForm action={saveContact}>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="WhatsApp number" hint="With country code, e.g. 233 24 123 4567. Turns on the WhatsApp button across the site.">
                <input name="whatsapp" defaultValue={contact.whatsapp} inputMode="tel" className="kd-input" placeholder="233 24 123 4567" />
              </Field>
              <Field label="Public email">
                <input name="email" type="email" defaultValue={contact.email} className="kd-input" placeholder="hello@dixit.com" />
              </Field>
              <Field label="Telephone (as displayed)">
                <input name="phone" defaultValue={contact.phone} className="kd-input" placeholder="+233 24 123 4567" />
              </Field>
              <Field label="Instagram handle">
                <input name="instagram" defaultValue={contact.instagram} className="kd-input" placeholder="dixit.house" />
              </Field>
              <Field label="City">
                <input name="city" defaultValue={contact.city} className="kd-input" />
              </Field>
              <Field label="Opening hours" hint="e.g. Mon – Sat · 10:00 – 18:00 · By appointment">
                <input name="hours" defaultValue={contact.hours} className="kd-input" />
              </Field>
              <Field label="Atelier address (one line each)" hint="Leave empty to show the city only.">
                <textarea name="address" defaultValue={contact.address.join("\n")} rows={3} className="kd-input resize-y" />
              </Field>
            </div>
          </SectionForm>
        </Panel>

        <Panel className="p-6 md:p-8">
          <div id="homepage" className="scroll-mt-8" />
          <h2 className="font-display text-2xl">Homepage</h2>
          <p className="mb-6 mt-1 text-sm text-kd-gray">The first thing visitors see.</p>
          <SectionForm action={saveHomepage}>
            <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
              <div className="space-y-5">
                <Field label="Small line above the headline">
                  <input name="eyebrow" defaultValue={homepage.eyebrow} maxLength={60} className="kd-input" />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Headline — first line">
                    <input name="headline" defaultValue={homepage.headline} maxLength={40} required className="kd-input" />
                  </Field>
                  <Field label="Headline — gold italic line">
                    <input name="headlineAccent" defaultValue={homepage.headlineAccent} maxLength={40} required className="kd-input" />
                  </Field>
                </div>
                <Field label="Intro sentence">
                  <textarea name="intro" defaultValue={homepage.intro} maxLength={220} rows={3} className="kd-input resize-y" />
                </Field>
              </div>
              <PhotoField
                name="heroImage"
                folder="hero"
                label="Hero photo"
                hint="Portrait photo, at least 1200 × 1800 px. The person should be centred."
                initialPath={storedPhoto(homepage.heroImage)}
                storageBase={storageBase}
                fallback={DEFAULT_HERO_IMAGE}
                aspect="aspect-[2/3]"
              />
            </div>
          </SectionForm>
        </Panel>

        <Panel className="p-6 md:p-8">
          <div id="house" className="scroll-mt-8" />
          <h2 className="font-display text-2xl">The House — founder</h2>
          <p className="mb-6 mt-1 text-sm text-kd-gray">Appears on The House page once there is a story. Leave the story empty to hide this section.</p>
          <SectionForm action={saveFounder}>
            <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name">
                    <input name="name" defaultValue={founder.name} maxLength={80} className="kd-input" />
                  </Field>
                  <Field label="Title">
                    <input name="role" defaultValue={founder.role} maxLength={80} className="kd-input" />
                  </Field>
                </div>
                <Field label="Story" hint="Separate paragraphs with an empty line.">
                  <textarea name="story" defaultValue={founder.story.join("\n\n")} rows={8} className="kd-input resize-y" />
                </Field>
                <Field label="Quote (optional)">
                  <input name="quote" defaultValue={founder.quote} maxLength={300} className="kd-input" />
                </Field>
              </div>
              <PhotoField name="photo" folder="founder" label="Portrait" initialPath={storedPhoto(founder.photo)} storageBase={storageBase} />
            </div>
          </SectionForm>
        </Panel>

        <Panel className="p-6 md:p-8">
          <div id="bespoke" className="scroll-mt-8" />
          <h2 className="font-display text-2xl">Bespoke pricing</h2>
          <p className="mb-6 mt-1 text-sm text-kd-gray">Shown on the Bespoke page. Leave empty to show “Quoted individually” and “Confirmed at consultation”.</p>
          <SectionForm action={savePricing}>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Starting from (GH₵)">
                <input name="bespokeStartingFrom" defaultValue={pricing.bespokeStartingFrom ?? ""} inputMode="decimal" className="kd-input" placeholder="e.g. 2500" />
              </Field>
              <Field label="Typical timing">
                <input name="bespokeLeadTime" defaultValue={pricing.bespokeLeadTime} maxLength={60} className="kd-input" placeholder="e.g. 3 – 4 weeks" />
              </Field>
            </div>
          </SectionForm>
        </Panel>
      </div>
    </>
  );
}
