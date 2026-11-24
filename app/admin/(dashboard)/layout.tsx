import Image from "next/image";
import Link from "next/link";
import { requireStaff, roleLabels } from "@/lib/admin";
import { signOut } from "../login/actions";
import { AdminNav } from "./admin-nav";

export const metadata = { title: { default: "Dashboard", template: "%s · DIXIT Dashboard" }, robots: { index: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { supabase, email, role } = await requireStaff();
  const { count } = await supabase
    .from("consultation_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  return (
    <div className="min-h-screen bg-kd-cream text-kd-black lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="bg-kd-black text-kd-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:block lg:px-6 lg:py-8">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/brand/dixit-mark.svg" alt="" width={36} height={36} />
            <span className="font-display text-xl font-semibold tracking-[0.14em]">DIXIT</span>
          </Link>
          <Link href="/" className="text-[0.6rem] uppercase tracking-[0.2em] text-white/50 hover:text-kd-gold lg:mt-3 lg:block" target="_blank">View site ↗</Link>
        </div>
        <div className="px-3 pb-3 lg:flex-1 lg:px-3">
          <AdminNav newCount={count ?? 0} isSuperAdmin={role === "super_admin"} />
        </div>
        <div className="hidden border-t border-white/10 px-6 py-5 lg:block">
          <p className="truncate text-xs text-white/50">{email}</p>
          <p className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-kd-gold">{roleLabels[role]}</p>
          <form action={signOut}>
            <button className="mt-2 text-[0.65rem] uppercase tracking-[0.2em] text-white/70 hover:text-kd-gold">Sign out</button>
          </form>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="flex justify-end border-b border-kd-black/10 px-5 py-2 lg:hidden">
          <form action={signOut}><button className="text-[0.65rem] uppercase tracking-[0.2em] text-kd-gray">Sign out</button></form>
        </div>
        <main className="px-5 py-8 md:px-10 md:py-12">{children}</main>
      </div>
    </div>
  );
}
