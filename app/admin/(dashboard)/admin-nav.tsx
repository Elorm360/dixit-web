"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/pieces", label: "Pieces" },
];

export function AdminNav({ newCount }: { newCount: number }) {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Dashboard">
      {links.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center justify-between gap-3 whitespace-nowrap px-4 py-3 text-sm transition-colors ${active ? "bg-white/10 text-kd-white" : "text-white/60 hover:bg-white/5 hover:text-kd-white"}`}
          >
            {l.label}
            {l.href === "/admin/enquiries" && newCount > 0 && (
              <span className="rounded-full bg-kd-gold px-2 py-0.5 text-[0.65rem] font-semibold text-kd-black">{newCount}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
