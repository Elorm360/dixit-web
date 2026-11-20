import Link from "next/link";
import { PageHeader, Panel, StatusBadge, adminButtonOutline, adminButtonPrimary } from "@/components/admin/ui";
import { type Enquiry, formatDate, requireStaff } from "@/lib/admin";
import { ENQUIRY_STATUSES } from "@/lib/enquiry-status";

export const metadata = { title: "Enquiries" };

const PAGE_SIZE = 25;
const FILTERS = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  ...ENQUIRY_STATUSES.map(({ value, label }) => ({ value, label })),
];

type Search = { status?: string; q?: string; page?: string };

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { supabase } = await requireStaff();
  const { status = "", q = "", page = "1" } = await searchParams;
  const pageNum = Math.max(1, Number.parseInt(page, 10) || 1);

  let query = supabase.from("consultation_requests").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (status === "active") query = query.in("status", ["contacted", "scheduled", "in_progress"]);
  else if (status) query = query.eq("status", status);
  // Strip characters that have meaning in PostgREST filter syntax.
  const term = q.replace(/[,()*%\\]/g, " ").trim();
  if (term) query = query.or(`full_name.ilike.*${term}*,email.ilike.*${term}*,phone.ilike.*${term}*,occasion.ilike.*${term}*`);
  const { data, count } = await query.range((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE - 1);
  const rows = (data ?? []) as Enquiry[];
  const pages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  const href = (patch: Partial<Search>) => {
    const p = new URLSearchParams({ ...(status && { status }), ...(q && { q }), ...patch } as Record<string, string>);
    for (const [k, v] of [...p]) if (!v || (k === "page" && v === "1")) p.delete(k);
    const s = p.toString();
    return `/admin/enquiries${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader
        eyebrow={`${count ?? 0} ${count === 1 ? "enquiry" : "enquiries"}`}
        title="Enquiries"
        actions={<a href={`/admin/enquiries/export${status ? `?status=${status}` : ""}`} className={adminButtonOutline}>Export CSV</a>}
      />

      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <Link
              key={f.value}
              href={href({ status: f.value, page: "1" })}
              className={`whitespace-nowrap px-3 py-2 text-xs transition-colors ${status === f.value ? "bg-kd-black text-kd-white" : "bg-kd-white text-kd-gray hover:text-kd-black"}`}
            >
              {f.label}
            </Link>
          ))}
        </div>
        <form className="flex gap-2" action="/admin/enquiries">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Search name, email, phone…" className="kd-input min-h-10 py-2 text-sm xl:w-72" />
          <button className={adminButtonPrimary}>Search</button>
        </form>
      </div>

      <Panel>
        {rows.length ? (
          <>
            {/* Desktop table */}
            <table className="hidden w-full text-left text-sm md:table">
              <thead className="border-b border-kd-black/10 text-[0.6rem] uppercase tracking-[0.18em] text-kd-gray">
                <tr>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold">Preferred</th>
                  <th className="px-5 py-3 font-semibold">Received</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-kd-black/10">
                {rows.map((e) => (
                  <tr key={e.id} className="group relative hover:bg-kd-cream">
                    <td className="px-5 py-4">
                      <Link href={`/admin/enquiries/${e.id}`} className="font-medium after:absolute after:inset-0">{e.full_name}</Link>
                      <p className="text-xs text-kd-gray">{e.location}</p>
                    </td>
                    <td className="px-5 py-4">
                      {e.service}
                      <p className="max-w-56 truncate text-xs text-kd-gray">{e.occasion}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">{formatDate(e.preferred_date)}<p className="text-xs text-kd-gray">{e.preferred_time.slice(0, 5)} · {e.consultation_type}</p></td>
                    <td className="px-5 py-4 whitespace-nowrap text-kd-gray">{formatDate(e.created_at)}</td>
                    <td className="px-5 py-4"><StatusBadge status={e.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Mobile list */}
            <ul className="divide-y divide-kd-black/10 md:hidden">
              {rows.map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/enquiries/${e.id}`} className="block px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">{e.full_name}</p>
                      <StatusBadge status={e.status} />
                    </div>
                    <p className="mt-1 text-sm text-kd-gray">{e.service} · {e.occasion}</p>
                    <p className="mt-1 text-xs text-kd-gray">Received {formatDate(e.created_at)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="px-6 py-14 text-center text-sm text-kd-gray">{q || status ? "No enquiries match these filters." : "No enquiries yet."}</p>
        )}
      </Panel>

      {pages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm">
          {pageNum > 1 ? <Link href={href({ page: String(pageNum - 1) })} className={adminButtonOutline}>← Newer</Link> : <span />}
          <span className="text-kd-gray">Page {pageNum} of {pages}</span>
          {pageNum < pages ? <Link href={href({ page: String(pageNum + 1) })} className={adminButtonOutline}>Older →</Link> : <span />}
        </div>
      )}
    </>
  );
}
