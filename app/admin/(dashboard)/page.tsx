import Link from "next/link";
import { PageHeader, Panel, StatusBadge, adminButtonOutline } from "@/components/admin/ui";
import { type Enquiry, formatDate, requireStaff } from "@/lib/admin";

export const metadata = { title: "Overview" };

export default async function OverviewPage() {
  const { supabase } = await requireStaff();
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  now.setDate(now.getDate() - 7);
  const weekAgo = now.toISOString();

  const count = (q: PromiseLike<{ count: number | null }>) => q.then((r) => r.count ?? 0);
  const enquiries = () => supabase.from("consultation_requests").select("id", { count: "exact", head: true });

  const [newCount, weekCount, activeCount, piecesLive, recent, upcoming] = await Promise.all([
    count(enquiries().eq("status", "new")),
    count(enquiries().gte("created_at", weekAgo)),
    count(enquiries().in("status", ["contacted", "scheduled", "in_progress"])),
    count(supabase.from("pieces").select("id", { count: "exact", head: true }).eq("published", true)),
    supabase.from("consultation_requests").select("*").order("created_at", { ascending: false }).limit(6),
    supabase
      .from("consultation_requests")
      .select("*")
      .in("status", ["new", "contacted", "scheduled"])
      .gte("preferred_date", today)
      .order("preferred_date")
      .order("preferred_time")
      .limit(5),
  ]);

  const stats = [
    { label: "New enquiries", value: newCount, href: "/admin/enquiries?status=new", highlight: newCount > 0 },
    { label: "Received this week", value: weekCount, href: "/admin/enquiries" },
    { label: "Active clients", value: activeCount, href: "/admin/enquiries?status=active" },
    { label: "Pieces live (dashboard)", value: piecesLive, href: "/admin/pieces" },
  ];

  return (
    <>
      <PageHeader eyebrow="Studio dashboard" title="Overview" />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`block border p-6 transition-colors ${s.highlight ? "border-kd-gold bg-kd-warm-gold" : "border-kd-black/10 bg-kd-white hover:border-kd-black/30"}`}>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-kd-gray">{s.label}</p>
            <p className="font-display mt-3 text-5xl">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <Panel>
          <div className="flex items-center justify-between border-b border-kd-black/10 px-6 py-4">
            <h2 className="font-display text-2xl">Latest enquiries</h2>
            <Link href="/admin/enquiries" className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-kd-gold-dark">View all →</Link>
          </div>
          {(recent.data as Enquiry[] | null)?.length ? (
            <ul className="divide-y divide-kd-black/10">
              {(recent.data as Enquiry[]).map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/enquiries/${e.id}`} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-kd-cream">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{e.full_name}</p>
                      <p className="truncate text-sm text-kd-gray">{e.service} · {e.occasion}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <StatusBadge status={e.status} />
                      <span className="text-xs text-kd-gray">{formatDate(e.created_at)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 py-10 text-sm text-kd-gray">No enquiries yet. They’ll appear here as soon as someone submits the consultation form.</p>
          )}
        </Panel>

        <Panel>
          <div className="border-b border-kd-black/10 px-6 py-4">
            <h2 className="font-display text-2xl">Upcoming consultations</h2>
            <p className="mt-1 text-xs text-kd-gray">Clients’ preferred dates — confirm with them directly.</p>
          </div>
          {(upcoming.data as Enquiry[] | null)?.length ? (
            <ul className="divide-y divide-kd-black/10">
              {(upcoming.data as Enquiry[]).map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/enquiries/${e.id}`} className="flex items-center gap-5 px-6 py-4 hover:bg-kd-cream">
                    <div className="w-14 shrink-0 text-center">
                      <p className="font-display text-3xl leading-none">{new Date(`${e.preferred_date}T00:00:00`).getDate()}</p>
                      <p className="text-[0.6rem] uppercase tracking-[0.15em] text-kd-gray">{new Date(`${e.preferred_date}T00:00:00`).toLocaleDateString("en-GB", { month: "short" })}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{e.full_name}</p>
                      <p className="text-sm text-kd-gray">{e.preferred_time.slice(0, 5)} · {e.consultation_type}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 py-10 text-sm text-kd-gray">Nothing scheduled ahead.</p>
          )}
        </Panel>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/admin/pieces/new" className={adminButtonOutline}>+ Add a piece</Link>
        {/* A file download, not a page — a plain link is intended. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/admin/enquiries/export" className={adminButtonOutline}>Export enquiries (CSV)</a>
      </div>
    </>
  );
}
