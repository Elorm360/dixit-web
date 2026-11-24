import Link from "next/link";
import { PageHeader, Panel, adminButtonOutline } from "@/components/admin/ui";
import { type Enquiry, isMissingColumn, requireStaff, toDateTimeLocal } from "@/lib/admin";

export const metadata = { title: "Calendar" };

type Item = { id: string; name: string; time: string; type: string; kind: "booked" | "requested" };

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function todayInStudio() {
  return toDateTimeLocal(new Date().toISOString()).slice(0, 10);
}

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const { supabase } = await requireStaff();
  const { month: monthParam } = await searchParams;
  const today = todayInStudio();
  const month = /^\d{4}-(0[1-9]|1[0-2])$/.test(monthParam ?? "") ? monthParam! : today.slice(0, 7);

  const [year, mon] = month.split("-").map(Number);
  const first = new Date(Date.UTC(year, mon - 1, 1));
  const next = new Date(Date.UTC(year, mon, 1));
  const prevMonth = new Date(Date.UTC(year, mon - 2, 1)).toISOString().slice(0, 7);
  const nextMonth = next.toISOString().slice(0, 7);
  const startIso = first.toISOString().slice(0, 10);
  const endIso = next.toISOString().slice(0, 10);

  // Confirmed bookings (Accra is UTC+0, so UTC month bounds match studio time).
  const booked = await supabase
    .from("consultation_requests")
    .select("*")
    .gte("consultation_at", first.toISOString())
    .lt("consultation_at", next.toISOString())
    .neq("status", "archived")
    .order("consultation_at");
  const bookingsReady = !isMissingColumn(booked.error);

  // Dates clients asked for that nobody has confirmed yet.
  const requested = await supabase
    .from("consultation_requests")
    .select("*")
    .gte("preferred_date", startIso)
    .lt("preferred_date", endIso)
    .in("status", ["new", "contacted"])
    .order("preferred_time");

  const byDay = new Map<string, Item[]>();
  const add = (day: string, item: Item) => byDay.set(day, [...(byDay.get(day) ?? []), item]);
  for (const e of (bookingsReady ? (booked.data ?? []) : []) as Enquiry[]) {
    const local = toDateTimeLocal(e.consultation_at);
    add(local.slice(0, 10), { id: e.id, name: e.full_name, time: local.slice(11, 16), type: e.consultation_type, kind: "booked" });
  }
  for (const e of (requested.data ?? []) as Enquiry[]) {
    if (e.consultation_at) continue;
    add(e.preferred_date, { id: e.id, name: e.full_name, time: e.preferred_time.slice(0, 5), type: e.consultation_type, kind: "requested" });
  }
  for (const items of byDay.values()) items.sort((a, b) => a.time.localeCompare(b.time));

  // Grid starts on the Monday on/before the 1st.
  const lead = (first.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, mon, 0)).getUTCDate();
  const cells: (string | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`),
  ];
  while (cells.length % 7) cells.push(null);

  const title = first.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  const bookedCount = [...byDay.values()].flat().filter((i) => i.kind === "booked").length;
  const requestedCount = [...byDay.values()].flat().filter((i) => i.kind === "requested").length;
  const upcoming = [...byDay.entries()].filter(([d]) => d >= today).sort(([a], [b]) => a.localeCompare(b));

  return (
    <>
      <PageHeader
        eyebrow={`${bookedCount} booked · ${requestedCount} awaiting confirmation`}
        title={title}
        actions={
          <>
            <Link href={`/admin/calendar?month=${prevMonth}`} className={adminButtonOutline} aria-label="Previous month">←</Link>
            <Link href="/admin/calendar" className={adminButtonOutline}>Today</Link>
            <Link href={`/admin/calendar?month=${nextMonth}`} className={adminButtonOutline} aria-label="Next month">→</Link>
          </>
        }
      />

      {!bookingsReady && (
        <p className="mb-6 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
          Showing client-requested dates only. Confirmed bookings appear once the booking database update is applied.
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-5 text-xs text-kd-gray">
        <span className="flex items-center gap-2"><span className="h-3 w-3 bg-violet-600" /> Confirmed consultation</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 border border-dashed border-kd-gold-dark bg-kd-warm-gold" /> Requested by client — confirm a time</span>
        <span className="text-kd-gray/80">All times are Accra time (GMT).</span>
      </div>

      {/* Month grid (tablet and up) */}
      <Panel className="hidden md:block">
        <div className="grid grid-cols-7 border-b border-kd-black/10 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-kd-gray">
          {WEEKDAYS.map((d) => <div key={d} className="px-3 py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const items = day ? (byDay.get(day) ?? []) : [];
            return (
              <div key={day ?? `pad-${i}`} className={`min-h-32 border-b border-r border-kd-black/5 p-2 ${!day ? "bg-kd-cream/50" : ""} ${day && day < today ? "opacity-60" : ""}`}>
                {day && (
                  <>
                    <p className={`mb-1 inline-flex h-6 w-6 items-center justify-center text-xs ${day === today ? "rounded-full bg-kd-black font-semibold text-kd-white" : "text-kd-gray"}`}>{Number(day.slice(8))}</p>
                    <ul className="space-y-1">
                      {items.slice(0, 4).map((it) => (
                        <li key={`${it.kind}-${it.id}`}>
                          <Link
                            href={`/admin/enquiries/${it.id}`}
                            className={`block truncate px-1.5 py-1 text-[0.7rem] leading-tight ${it.kind === "booked" ? "bg-violet-600 text-white hover:bg-violet-700" : "border border-dashed border-kd-gold-dark bg-kd-warm-gold text-kd-black hover:bg-kd-gold/40"}`}
                            title={`${it.time} ${it.name} · ${it.type}${it.kind === "requested" ? " (requested)" : ""}`}
                          >
                            {it.time} {it.name}
                          </Link>
                        </li>
                      ))}
                      {items.length > 4 && <li className="px-1.5 text-[0.65rem] text-kd-gray">+{items.length - 4} more</li>}
                    </ul>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Agenda (phones), and the list of what's ahead */}
      <Panel className="mt-8">
        <div className="border-b border-kd-black/10 px-6 py-4">
          <h2 className="font-display text-2xl">Coming up this month</h2>
        </div>
        {upcoming.length ? (
          <ul className="divide-y divide-kd-black/10">
            {upcoming.map(([day, items]) => (
              <li key={day} className="flex gap-5 px-6 py-4">
                <div className="w-14 shrink-0 text-center">
                  <p className="font-display text-3xl leading-none">{Number(day.slice(8))}</p>
                  <p className="text-[0.6rem] uppercase tracking-[0.15em] text-kd-gray">{new Date(`${day}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" })}</p>
                </div>
                <ul className="min-w-0 flex-1 space-y-2">
                  {items.map((it) => (
                    <li key={`${it.kind}-${it.id}`}>
                      <Link href={`/admin/enquiries/${it.id}`} className="flex items-center justify-between gap-3 hover:underline">
                        <span className="truncate text-sm"><span className="font-medium">{it.time}</span> {it.name} · {it.type}</span>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.08em] ${it.kind === "booked" ? "bg-violet-100 text-violet-900" : "bg-kd-warm-gold text-kd-black"}`}>{it.kind === "booked" ? "Booked" : "Requested"}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-6 py-8 text-sm text-kd-gray">Nothing scheduled for the rest of {title}.</p>
        )}
      </Panel>
    </>
  );
}
