import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, Panel, StatusBadge, adminButtonOutline } from "@/components/admin/ui";
import { type Enquiry, formatDate, formatDateTime, requireStaff, toDateTimeLocal, whatsappNumber } from "@/lib/admin";
import { EnquiryForm } from "./enquiry-form";
import { ReplyTemplates } from "./reply-templates";

export const metadata = { title: "Enquiry" };

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireStaff();
  const { data } = await supabase.from("consultation_requests").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const e = data as Enquiry;

  // Other enquiries from the same client (same email or phone).
  const escapedEmail = e.email.replace(/[\\%_]/g, (c) => `\\${c}`);
  const [byEmail, byPhone] = await Promise.all([
    supabase.from("consultation_requests").select("id, created_at, service, occasion, status").ilike("email", escapedEmail).neq("id", e.id),
    supabase.from("consultation_requests").select("id, created_at, service, occasion, status").eq("phone", e.phone).neq("id", e.id),
  ]);
  const history = [...new Map([...(byEmail.data ?? []), ...(byPhone.data ?? [])].map((h) => [h.id, h])).values()].sort((a, b) => b.created_at.localeCompare(a.created_at));

  const firstName = e.full_name.split(" ")[0];
  const preferred = `${formatDate(e.preferred_date)} at ${e.preferred_time.slice(0, 5)}`;
  const booked = e.consultation_at ? formatDateTime(e.consultation_at) : null;

  const fields: [string, string][] = [
    ["Service", e.service],
    ["Occasion / requirement", e.occasion],
    ["Event date", formatDate(e.event_date)],
    ["Consultation", e.consultation_type],
    ["Client’s preferred time", preferred],
    ["Location", e.location],
  ];

  return (
    <>
      <Link href="/admin/enquiries" className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-kd-gray hover:text-kd-black">← All enquiries</Link>
      <div className="mt-4">
        <PageHeader
          eyebrow={`Received ${formatDate(e.created_at, true)}${history.length ? ` · Returning client (${history.length + 1} enquiries)` : ""}`}
          title={e.full_name}
          actions={<a href={`tel:${e.phone.replace(/\s/g, "")}`} className={adminButtonOutline}>Call {e.phone}</a>}
        />
      </div>

      {booked && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border border-violet-200 bg-violet-50 px-5 py-4">
          <p className="text-sm text-violet-950"><span className="font-semibold">Consultation booked:</span> {booked} · {e.consultation_type}</p>
          <Link href={`/admin/calendar?month=${toDateTimeLocal(e.consultation_at).slice(0, 7)}`} className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-violet-900">View calendar →</Link>
        </div>
      )}

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
            <h2 className="font-display mb-1 text-2xl">Reply</h2>
            <p className="mb-5 text-sm text-kd-gray">Pick a message, adjust it if needed, then send. Opens WhatsApp or your email app with everything filled in.</p>
            <ReplyTemplates
              email={e.email}
              whatsappNumber={whatsappNumber(e.phone)}
              context={{ firstName, service: e.service, occasion: e.occasion, preferred, booked, consultationType: e.consultation_type }}
            />
          </Panel>

          <Panel className="p-6 md:p-8">
            <h2 className="font-display mb-5 text-2xl">Contact</h2>
            <dl className="space-y-4">
              <div><dt className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-kd-gray">Email</dt><dd className="mt-1 break-all"><a href={`mailto:${e.email}`} className="underline-offset-4 hover:underline">{e.email}</a></dd></div>
              <div><dt className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-kd-gray">Phone / WhatsApp</dt><dd className="mt-1"><a href={`tel:${e.phone.replace(/\s/g, "")}`} className="underline-offset-4 hover:underline">{e.phone}</a></dd></div>
            </dl>
          </Panel>
        </div>

        <div className="space-y-8">
          <Panel className="h-fit p-6 md:p-8">
            <h2 className="font-display mb-5 text-2xl">Manage</h2>
            <EnquiryForm id={e.id} status={e.status} notes={e.notes ?? ""} consultationAt={toDateTimeLocal(e.consultation_at)} />
            {e.updated_at && <p className="mt-5 text-xs text-kd-gray">Last updated {formatDate(e.updated_at, true)}</p>}
          </Panel>

          <Panel className="h-fit">
            <div className="border-b border-kd-black/10 px-6 py-4">
              <h2 className="font-display text-2xl">Client history</h2>
              <p className="mt-1 text-xs text-kd-gray">Other enquiries with the same email or phone number.</p>
            </div>
            {history.length ? (
              <ul className="divide-y divide-kd-black/10">
                {history.map((h) => (
                  <li key={h.id}>
                    <Link href={`/admin/enquiries/${h.id}`} className="flex items-center justify-between gap-4 px-6 py-3 hover:bg-kd-cream">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{h.service} · {h.occasion}</p>
                        <p className="text-xs text-kd-gray">{formatDate(h.created_at)}</p>
                      </div>
                      <StatusBadge status={h.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-6 py-5 text-sm text-kd-gray">First enquiry from this client.</p>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
