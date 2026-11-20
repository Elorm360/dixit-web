import type { ReactNode } from "react";
import { statusMeta } from "@/lib/enquiry-status";

export function PageHeader({ title, eyebrow, actions }: { title: string; eyebrow?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">{eyebrow}</p>}
        <h1 className="font-display mt-2 text-4xl font-medium md:text-5xl">{title}</h1>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const meta = statusMeta(status);
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.08em] ${meta.tone}`}>{meta.label}</span>;
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`border border-kd-black/10 bg-kd-white ${className}`}>{children}</section>;
}

export const adminButton =
  "inline-flex min-h-10 items-center justify-center gap-2 px-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-colors disabled:opacity-50";
export const adminButtonPrimary = `${adminButton} bg-kd-black text-kd-white hover:bg-kd-charcoal`;
export const adminButtonOutline = `${adminButton} border border-kd-black/20 bg-kd-white hover:border-kd-black`;
