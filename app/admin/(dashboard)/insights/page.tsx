import Link from "next/link";
import { BarList, ChartCard, ColumnChart, DataTable, StatTile } from "@/components/admin/charts";
import { PageHeader } from "@/components/admin/ui";
import { collectionCategories } from "@/data/collections";
import { requireStaff } from "@/lib/admin";
import { type InsightRow, PERIODS, buildInsights, periodRange } from "@/lib/insights";

export const metadata = { title: "Insights" };

const ENQUIRY: [string, string] = ["enquiry", "enquiries"];

function delta(current: number, previous: number) {
  if (!previous) return current ? "New this period" : "No change";
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) return "Same as the previous period";
  return `${pct > 0 ? "▲" : "▼"} ${Math.abs(pct)}% vs the previous period`;
}

export default async function InsightsPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const { supabase } = await requireStaff();
  const { period: periodParam } = await searchParams;
  const period = PERIODS.find((p) => p.value === periodParam) ?? PERIODS[1];
  const { start, prevStart } = periodRange(period);
  const columns = "created_at, status, service, location, consultation_type, email";

  const [current, previous, emails, pieces] = await Promise.all([
    supabase.from("consultation_requests").select(columns).gte("created_at", start.toISOString()).limit(5000),
    supabase.from("consultation_requests").select("created_at").gte("created_at", prevStart.toISOString()).lt("created_at", start.toISOString()).limit(5000),
    supabase.from("consultation_requests").select("email").limit(10000),
    supabase.from("pieces").select("collection, published"),
  ]);

  const data = buildInsights(
    (current.data ?? []) as InsightRow[],
    (previous.data ?? []) as InsightRow[],
    (emails.data ?? []).map((r) => r.email as string),
    period,
  );
  const live = (pieces.data ?? []).filter((p) => p.published);
  const byCollection = collectionCategories
    .map((c) => ({ label: c.name, value: live.filter((p) => p.collection === c.slug).length }))
    .sort((a, b) => b.value - a.value);
  const pct = (n: number | null) => (n == null ? "—" : `${Math.round(n * 100)}%`);
  const failed = current.error || previous.error;

  return (
    <>
      <PageHeader eyebrow="How the studio is doing" title="Insights" />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1" role="group" aria-label="Time period">
          {PERIODS.map((p) => (
            <Link
              key={p.value}
              href={`/admin/insights?period=${p.value}`}
              aria-current={p.value === period.value ? "true" : undefined}
              className={`px-3 py-2 text-xs transition-colors ${p.value === period.value ? "bg-kd-black text-kd-white" : "bg-kd-white text-kd-gray hover:text-kd-black"}`}
            >
              {p.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-kd-gray">Since {start.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</p>
      </div>

      {failed && <p className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">Some figures could not be loaded. Refresh to try again.</p>}

      {data.total === 0 && !failed && (
        <p className="mb-8 border border-kd-black/10 bg-kd-white px-5 py-4 text-sm text-kd-gray">
          No enquiries in this period yet. The charts fill in as consultation requests arrive from the website.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Enquiries" value={String(data.total)} note={delta(data.total, data.previousTotal)} />
        <StatTile label="Booked a consultation" value={pct(data.bookedRate)} note={`${data.booked} of ${data.total} enquiries`} />
        <StatTile label="Completed" value={String(data.completed)} note="Reached “Completed”" />
        <StatTile label="Returning clients" value={String(data.returning)} note="Have enquired before" />
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.5fr_1fr]">
        <ChartCard
          title="Enquiries over time"
          subtitle={period.days === 365 ? "Per month" : "Per week"}
          table={<DataTable head={[period.days === 365 ? "Month" : "Week", "Enquiries"]} rows={data.overTime.map((b) => [b.detail, b.value])} />}
        >
          <ColumnChart data={data.overTime} unit={ENQUIRY} />
        </ChartCard>

        <ChartCard
          title="From enquiry to completed"
          subtitle={`How far this period’s enquiries have got. ${data.archived} archived.`}
          table={<DataTable head={["Stage", "Enquiries", "Share"]} rows={data.funnel.map((f) => [f.label, f.value, data.total ? `${Math.round((f.value / data.total) * 100)}%` : "—"])} />}
        >
          <BarList data={data.funnel} of={data.total} unit={ENQUIRY} />
        </ChartCard>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <ChartCard title="By service" table={<DataTable head={["Service", "Enquiries"]} rows={data.byService.map((r) => [r.label, r.value])} />}>
          {data.byService.length ? <BarList data={data.byService} unit={ENQUIRY} /> : <p className="text-sm text-kd-gray">No data yet.</p>}
        </ChartCard>

        <ChartCard title="Where clients are" subtitle="From the location they entered" table={<DataTable head={["Location", "Enquiries"]} rows={data.byLocation.map((r) => [r.label, r.value])} />}>
          {data.byLocation.length ? <BarList data={data.byLocation} unit={ENQUIRY} /> : <p className="text-sm text-kd-gray">No data yet.</p>}
        </ChartCard>

        <ChartCard title="Atelier or remote" table={<DataTable head={["Consultation", "Enquiries"]} rows={data.byType.map((r) => [r.label, r.value])} />}>
          {data.byType.length ? <BarList data={data.byType} of={data.total} unit={ENQUIRY} /> : <p className="text-sm text-kd-gray">No data yet.</p>}
        </ChartCard>
      </div>

      <div className="mt-8">
        <ChartCard title="Live pieces by collection" subtitle={`${live.length} pieces on the website right now`} table={<DataTable head={["Collection", "Live pieces"]} rows={byCollection.map((r) => [r.label, r.value])} />}>
          <BarList data={byCollection} unit={["piece", "pieces"]} />
        </ChartCard>
      </div>

      <p className="mt-8 text-xs leading-6 text-kd-gray">
        Website visitor numbers (page views, popular pieces) aren’t tracked yet. They can be added with Vercel Web Analytics, which is privacy-friendly and needs no cookie banner.
      </p>
    </>
  );
}
