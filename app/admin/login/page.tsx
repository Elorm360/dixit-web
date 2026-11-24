import Image from "next/image";
import { LoginForm } from "./login-form";

export const metadata = { title: "Staff sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-kd-cream px-5 py-16 text-kd-black">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex items-center gap-3">
          <Image src="/brand/dixit-mark.svg" alt="" width={44} height={44} />
          <div>
            <p className="font-display text-2xl font-semibold tracking-[0.14em]">DIXIT</p>
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-kd-gray">Studio dashboard</p>
          </div>
        </div>
        <LoginForm initialError={error === "not-staff" ? "This account doesn’t have dashboard access." : undefined} />
      </div>
    </main>
  );
}
