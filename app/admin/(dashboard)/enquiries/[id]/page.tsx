import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, Panel, StatusBadge, adminButtonOutline, adminButtonPrimary } from "@/components/admin/ui";
import { type Enquiry, formatDate, requireStaff, whatsappNumber } from "@/lib/admin";
import { EnquiryForm } from "./enquiry-form";

export const metadata = { title: "Enquiry" };

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireStaff();
  const { data } = await supabase.from("consultation_requests").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const e = data as Enquiry;

  const firstName = e.full_name.split(" ")[0];
  const waText = `Hello ${firstName}, thank you for your ${e.service.toLowerCase()} enquiry with DIXIT.`;
  const whatsapp = `https://wa.me/${whatsappNumber(e.phone)}?text=${encodeURIComponent(waText)}`;
  const mail = `mailto:${e.email}?subject=${encodeURIComponent(`Your DIXIT enquiry — ${e.service}`)}&body=${encodeURIComponent(`Dear ${firstName},\n\nThank you for reaching out to DIXIT.\n\n`)}`;

  const fields: [string, string][] = [
    ["Service", e.service],
    ["Occasion / requirement", e.occasion],
    ["Event date", formatDate(e.event_date)],
    ["Consultation", e.consultation_type],
    ["Preferred date", `${formatDate(e.preferred_date)} at ${e.preferred_time.slice(0, 5)}`],
    ["Location", e.location],
  ];

  return (
    <>
      <Link href="/admin/enquiries" className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-kd-gray hover:text-kd-black">← All enquiries</Link>
      <div className="mt-4">
        <PageHeader
          eyebrow={`Received ${formatDate(e.created_at, true)}`}
          title={e.full_name}
          actions={
            <>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={adminButtonPrimary}>WhatsApp</a>
              <a href={mail} className={adminButtonOutline}>Email</a>
              <a href={`tel:${e.phone.replace(/\s/g, "")}`} className={adminButtonOutline}>Call</a>
            </>
          }
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-8">
          <Panel className="p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl">Request</h2>
              <StatusBadge status={e.status} />
            </div>
            <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {fields.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-kd-gray">{label}</dt>
                  <dd className="mt-1">{value}</dd>
                </div>
              ))}
            </dl>
            {e.details && (
              <div className="mt-6 border-t border-kd-black/10 pt-6">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-kd-gray">Client’s message</p>
                <p className="mt-2 whitespace-pre-wrap leading-7">{e.details}</p>
              </div>
            )}
          </Panel>

          <Panel className="p-6 md:p-8">
            <h2 className="font-display mb-5 text-2xl">Contact</h2>
            <dl className="space-y-4">
              <div><dt className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-kd-gray">Email</dt><dd className="mt-1 break-all"><a href={`mailto:${e.email}`} className="underline-offset-4 hover:underline">{e.email}</a></dd></div>
              <div><dt className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-kd-gray">Phone / WhatsApp</dt><dd className="mt-1"><a href={`tel:${e.phone.replace(/\s/g, "")}`} className="underline-offset-4 hover:underline">{e.phone}</a></dd></div>
            </dl>
          </Panel>
        </div>

        <Panel className="h-fit p-6 md:p-8">
          <h2 className="font-display mb-5 text-2xl">Manage</h2>
          <EnquiryForm id={e.id} status={e.status} notes={e.notes ?? ""} />
          {e.updated_at && <p className="mt-5 text-xs text-kd-gray">Last updated {formatDate(e.updated_at, true)}</p>}
        </Panel>
      </div>
    </>
  );
}
