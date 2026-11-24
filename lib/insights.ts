import { ENQUIRY_SERVICES } from "@/lib/enquiry-status";

/** The fields Insights needs from each enquiry. */
export type InsightRow = {
  created_at: string;
  status: string;
  service: string;
  location: string;
  consultation_type: string;
  email: string;
  consultation_at?: string | null;
};

// Whole weeks / whole months, so every column in the time chart covers a full bucket.
export const PERIODS = [
  { value: "4w", label: "4 weeks", days: 28 },
  { value: "3m", label: "3 months", days: 91 },
  { value: "12m", label: "12 months", days: 365 },
] as const;

export type Period = (typeof PERIODS)[number];

export type Bucket = { label: string; detail: string; value: number };
export type Ranked = { label: string; value: number };

const DAY = 86_400_000;

/** Statuses an enquiry passes through on its way to completion. "Booked" counts anyone who got that far. */
const FUNNEL = [
  { label: "Received", reached: ["new", "contacted", "scheduled", "in_progress", "completed", "archived"] },
  { label: "Contacted", reached: ["contacted", "scheduled", "in_progress", "completed"] },
  { label: "Consultation booked", reached: ["scheduled", "in_progress", "completed"] },
  { label: "In progress", reached: ["in_progress", "completed"] },
  { label: "Completed", reached: ["completed"] },
] as const;

function startOfUtcDay(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Accra is UTC+0 all year, so UTC days and months match studio time. */
function buckets(rows: InsightRow[], period: Period, now: Date): Bucket[] {
  const fmtDay = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

  if (period.days === 365) {
    const out: Bucket[] = [];
    for (let i = 11; i >= 0; i--) {
      const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
      const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1));
      out.push({
        label: start.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }),
        detail: start.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }),
        value: rows.filter((r) => { const t = new Date(r.created_at); return t >= start && t < end; }).length,
      });
    }
    return out;
  }

  const weeks = period.days / 7;
  const today = startOfUtcDay(now);
  const out: Bucket[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const end = new Date(today.getTime() + DAY - i * 7 * DAY);
    const start = new Date(end.getTime() - 7 * DAY);
    const last = new Date(end.getTime() - DAY);
    out.push({
      label: fmtDay(start),
      detail: `${fmtDay(start)} – ${fmtDay(last)}`,
      value: rows.filter((r) => { const t = new Date(r.created_at); return t >= start && t < end; }).length,
    });
  }
  return out;
}

function rank(values: string[], limit: number): Ranked[] {
  const counts = new Map<string, number>();
  for (const v of values) {
    const key = v.trim() || "Not given";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const sorted = [...counts.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
  if (sorted.length <= limit) return sorted;
  const rest = sorted.slice(limit - 1).reduce((n, r) => n + r.value, 0);
  return [...sorted.slice(0, limit - 1), { label: "Other", value: rest }];
}

/** Normalises free-text locations so "accra", "Accra, Ghana " and "ACCRA" count together. */
function normaliseLocation(raw: string) {
  const first = raw.split(",")[0].trim().replace(/\s+/g, " ");
  return first ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : "";
}

export function buildInsights(current: InsightRow[], previous: InsightRow[], allTimeEmails: string[], period: Period, now = new Date()) {
  const total = current.length;
  const reached = (statuses: readonly string[]) => current.filter((r) => statuses.includes(r.status)).length;
  const booked = reached(FUNNEL[2].reached);
  const completed = reached(FUNNEL[4].reached);

  // A client is "returning" if their email appears more than once across all enquiries.
  const emailCounts = new Map<string, number>();
  for (const e of allTimeEmails) emailCounts.set(e.toLowerCase(), (emailCounts.get(e.toLowerCase()) ?? 0) + 1);
  const returning = new Set(current.map((r) => r.email.toLowerCase()).filter((e) => (emailCounts.get(e) ?? 0) > 1)).size;

  const serviceOrder = new Map(ENQUIRY_SERVICES.map((s, i) => [s as string, i]));

  return {
    total,
    previousTotal: previous.length,
    booked,
    bookedRate: total ? booked / total : null,
    completed,
    returning,
    overTime: buckets(current, period, now),
    funnel: FUNNEL.map((f) => ({ label: f.label, value: reached(f.reached) })),
    archived: current.filter((r) => r.status === "archived").length,
    byService: rank(current.map((r) => r.service), 8).sort((a, b) => b.value - a.value || (serviceOrder.get(a.label) ?? 99) - (serviceOrder.get(b.label) ?? 99)),
    byLocation: rank(current.map((r) => normaliseLocation(r.location)), 6),
    byType: rank(current.map((r) => r.consultation_type), 4),
  };
}

export type Insights = ReturnType<typeof buildInsights>;

/** Start of the current period and of the one before it (same length), matching the chart's buckets. */
export function periodRange(period: Period, now = new Date()) {
  if (period.days === 365) {
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));
    const prevStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 23, 1));
    return { start, prevStart };
  }
  const start = new Date(startOfUtcDay(now).getTime() + DAY - period.days * DAY);
  return { start, prevStart: new Date(start.getTime() - period.days * DAY) };
}
