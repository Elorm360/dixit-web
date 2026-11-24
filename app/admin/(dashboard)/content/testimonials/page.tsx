import Link from "next/link";
import { Field, SectionForm } from "@/components/admin/content-fields";
import { PageHeader, Panel } from "@/components/admin/ui";
import { requireStaff } from "@/lib/admin";
import { deleteTestimonial, saveTestimonial } from "../actions";

export const metadata = { title: "Testimonials" };

type Row = { id: string; quote: string; name: string; detail: string | null; published: boolean };

function TestimonialFields({ t }: { t?: Row }) {
  return (
    <>
      <Field label="Quote">
        <textarea name="quote" defaultValue={t?.quote} maxLength={600} rows={3} required className="kd-input resize-y" placeholder="The fit was perfect from the first fitting." />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Client name" hint="First name and initial is enough, e.g. Kwame A.">
          <input name="name" defaultValue={t?.name} maxLength={80} required className="kd-input" />
        </Field>
        <Field label="Detail (optional)" hint="e.g. Bespoke wedding suit">
          <input name="detail" defaultValue={t?.detail ?? ""} maxLength={120} className="kd-input" />
        </Field>
      </div>
      <label className="flex items-center gap-3">
        <input type="checkbox" name="published" defaultChecked={t ? t.published : true} className="h-5 w-5 accent-kd-gold-dark" />
        <span className="text-sm">Show on the home page</span>
      </label>
    </>
  );
}

export default async function TestimonialsPage() {
  const { supabase } = await requireStaff();
  const { data, error } = await supabase.from("testimonials").select("id, quote, name, detail, published").order("sort_order").order("created_at");
  const rows = (data ?? []) as Row[];

  return (
    <>
      <Link href="/admin/content" className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-kd-gray hover:text-kd-black">← Website content</Link>
      <div className="mt-4">
        <PageHeader eyebrow={`${rows.filter((r) => r.published).length} on the home page`} title="Testimonials" />
      </div>
      {error && <p className="mb-6 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Testimonials aren’t set up in the database yet.</p>}

      <div className="grid gap-8 xl:grid-cols-[1fr_1.2fr]">
        <Panel className="h-fit p-6 md:p-8">
          <h2 className="font-display mb-1 text-2xl">Add a testimonial</h2>
          <p className="mb-6 text-sm text-kd-gray">Only use quotes the client is happy for you to share.</p>
          <SectionForm action={saveTestimonial.bind(null, null)} saveLabel="Add testimonial">
            <TestimonialFields />
          </SectionForm>
        </Panel>

        <div className="space-y-6">
          {rows.length === 0 && <Panel className="p-6 text-sm text-kd-gray">No testimonials yet. The section stays hidden on the home page until you add one.</Panel>}
          {rows.map((t) => (
            <Panel key={t.id} className={`p-6 ${t.published ? "" : "opacity-75"}`}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className={`rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.1em] ${t.published ? "bg-emerald-100 text-emerald-900" : "bg-neutral-200 text-neutral-700"}`}>{t.published ? "Live" : "Hidden"}</span>
                <form action={deleteTestimonial.bind(null, t.id)}>
                  <button className="text-xs text-red-700 hover:underline">Delete</button>
                </form>
              </div>
              <SectionForm action={saveTestimonial.bind(null, t.id)}>
                <TestimonialFields t={t} />
              </SectionForm>
            </Panel>
          ))}
        </div>
      </div>
    </>
  );
}
