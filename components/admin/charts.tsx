import type { ReactNode } from "react";

/*
 * Small, dependency-free charts for the dashboard.
 * One hue (brand gold-dark, validated ≥3:1 on white) — these show magnitude, not identity.
 * Marks: ≤24px thick, 4px rounded data end, square at the baseline; hairline grid; hover + focus tooltips; table view.
 */

const MARK = "bg-[#9a7015]";
const TRACK = "bg-[#f1ead6]";

export function ChartCard({ title, subtitle, children, table }: { title: string; subtitle?: string; children: ReactNode; table?: ReactNode }) {
  return (
    <section className="border border-kd-black/10 bg-kd-white p-6">
      <h2 className="text-base font-semibold">{title}</h2>
      {subtitle && <p className="mt-1 text-xs text-kd-gray">{subtitle}</p>}
      <div className="mt-6">{children}</div>
      {table && (
        <details className="mt-5 border-t border-kd-black/10 pt-3 text-sm">
          <summary className="cursor-pointer text-xs text-kd-gray hover:text-kd-black">Show as table</summary>
          <div className="mt-3 overflow-x-auto">{table}</div>
        </details>
      )}
    </section>
  );
}

export function DataTable({ head, rows }: { head: [string, string, string?]; rows: (string | number)[][] }) {
  return (
    <table className="w-full text-left text-sm">
      <thead className="text-xs text-kd-gray">
        <tr>{head.filter(Boolean).map((h, i) => <th key={h} className={`py-1.5 font-medium ${i > 0 ? "text-right" : ""}`}>{h}</th>)}</tr>
      </thead>
      <tbody className="divide-y divide-kd-black/5 tabular-nums">
        {rows.map((r) => (
          <tr key={String(r[0])}>{r.map((c, i) => <td key={i} className={`py-1.5 ${i > 0 ? "text-right" : ""}`}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

function niceMax(n: number) {
  if (n <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(n));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * pow >= n / 4)! * pow;
  return Math.ceil(n / step) * step;
}

/** Columns over time. `unit` is used in tooltips ("3 enquiries"). */
export function ColumnChart({ data, unit }: { data: { label: string; detail: string; value: number }[]; unit: [string, string] }) {
  const max = niceMax(Math.max(0, ...data.map((d) => d.value)));
  const peak = Math.max(...data.map((d) => d.value));
  const ticks = [max, max / 2, 0];
  const every = data.length > 8 ? 2 : 1;
  const word = (n: number) => `${n} ${n === 1 ? unit[0] : unit[1]}`;

  return (
    <div className="flex gap-3">
      <div className="flex h-48 flex-col justify-between pb-6 text-right text-[0.65rem] tabular-nums text-kd-gray" aria-hidden="true">
        {ticks.map((t) => <span key={t} className="-translate-y-1/2 leading-none">{Number.isInteger(t) ? t : t.toFixed(1)}</span>)}
      </div>
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-42" aria-hidden="true">
          {ticks.map((t, i) => <div key={t} className="absolute inset-x-0 border-t border-kd-black/[0.07]" style={{ top: `${(i / 2) * 100}%` }} />)}
        </div>
        <ol className="relative flex h-48 items-stretch" aria-label={`${unit[1]} over time`}>
          {data.map((d, i) => {
            const h = max ? (d.value / max) * 100 : 0;
            return (
              <li key={d.detail} className="group relative flex flex-1 flex-col items-center">
                <div className="relative flex h-42 w-full items-end justify-center outline-none" tabIndex={0} aria-label={`${d.detail}: ${word(d.value)}`}>
                  {d.value > 0 && d.value === peak && (
                    <span className="absolute text-[0.65rem] font-semibold tabular-nums text-kd-black" style={{ bottom: `calc(${h}% + 4px)` }} aria-hidden="true">{d.value}</span>
                  )}
                  <div className={`w-full max-w-6 rounded-t ${MARK} transition-opacity group-hover:opacity-80`} style={{ height: d.value ? `max(${h}%, 3px)` : 0 }} />
                  <span role="tooltip" className="pointer-events-none absolute bottom-full z-10 mb-1 hidden whitespace-nowrap bg-kd-black px-2.5 py-1.5 text-xs text-kd-white shadow group-hover:block group-focus-within:block">
                    {d.detail}<br /><span className="font-semibold">{word(d.value)}</span>
                  </span>
                </div>
                <span className={`mt-2 h-4 whitespace-nowrap text-[0.65rem] text-kd-gray ${i % every ? "invisible" : ""}`} aria-hidden="true">{d.label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

/**
 * Horizontal bars, one per row: name · bar · figure.
 * `of` = the whole each row is a share of (shows a track and a %); omit for plain ranked bars.
 */
export function BarList({ data, of, unit }: { data: { label: string; value: number }[]; of?: number; unit: [string, string] }) {
  const max = of ?? Math.max(1, ...data.map((d) => d.value));
  const word = (n: number) => `${n} ${n === 1 ? unit[0] : unit[1]}`;
  return (
    <ul className="space-y-3">
      {data.map((d) => {
        const pct = max ? (d.value / max) * 100 : 0;
        const share = of ? ` · ${Math.round((d.value / (of || 1)) * 100)}%` : "";
        // Name and figure on one line, the bar full-width underneath, so bars stay readable in narrow cards.
        return (
          <li key={d.label} className="group relative text-sm outline-none" tabIndex={0} aria-label={`${d.label}: ${word(d.value)}${share}`}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate" title={d.label}>{d.label}</span>
              <span className="shrink-0 tabular-nums text-kd-gray">
                <span className="font-semibold text-kd-black">{d.value}</span>{of ? <span className="ml-1.5 text-xs">{Math.round((d.value / (of || 1)) * 100)}%</span> : null}
              </span>
            </div>
            <div className={`mt-1.5 h-2.5 overflow-hidden rounded-r ${of ? TRACK : ""}`}>
              <div className={`h-full rounded-r ${MARK} transition-opacity group-hover:opacity-80`} style={{ width: d.value ? `max(${pct}%, 3px)` : 0 }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function StatTile({ label, value, note }: { label: string; value: string; note?: ReactNode }) {
  return (
    <div className="border border-kd-black/10 bg-kd-white px-5 py-5">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-kd-gray">{label}</p>
      <p className="mt-2 text-4xl font-semibold tabular-nums tracking-tight">{value}</p>
      {note && <p className="mt-1 text-xs text-kd-gray">{note}</p>}
    </div>
  );
}
