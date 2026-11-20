"use client";

import { useActionState, useState } from "react";
import { signIn } from "./actions";

export function LoginForm({ initialError }: { initialError?: string }) {
  const [state, action, pending] = useActionState(signIn, initialError ? { error: initialError } : null);
  // Controlled so the email survives React resetting the form after a failed attempt.
  const [email, setEmail] = useState("");

  return (
    <form action={action} className="space-y-6">
      <label className="block">
        <span className="kd-label">Email</span>
        <input className="kd-input" type="email" name="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="block">
        <span className="kd-label">Password</span>
        <input className="kd-input" type="password" name="password" autoComplete="current-password" required />
      </label>
      {state?.error && <p className="text-sm text-red-700" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center bg-kd-black px-6 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-kd-white transition-colors hover:bg-kd-charcoal disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
