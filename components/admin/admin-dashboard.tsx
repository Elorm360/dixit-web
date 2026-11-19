"use client";

import { createClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

type RequestInterest =
  | "bespoke"
  | "ready-to-wear"
  | "occasion-wear"
  | "other";

type ConsultationRequest = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  interest: RequestInterest;
  message: string;
};

type ScreenState =
  | "checking"
  | "configuration"
  | "login"
  | "loading"
  | "ready"
  | "error";
type RequestFilter = "all" | RequestInterest;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isBrowser = typeof window !== "undefined";
const supabase =
  supabaseUrl && publishableKey
    ? createClient(supabaseUrl, publishableKey, {
        auth: {
          persistSession: isBrowser,
          autoRefreshToken: isBrowser,
          detectSessionInUrl: isBrowser,
        },
      })
    : null;

const interestLabels: Record<RequestInterest, string> = {
  bespoke: "Bespoke",
  "ready-to-wear": "Made to order",
  "occasion-wear": "Occasion wear",
  other: "Other",
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

export function AdminDashboard() {
  const [screen, setScreen] = useState<ScreenState>(
    supabase ? "checking" : "configuration",
  );
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [filter, setFilter] = useState<RequestFilter>("all");
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadRequests = useCallback(async (accessToken: string) => {
    setScreen("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/requests", {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });
      const result = (await response.json()) as {
        error?: string;
        requests?: ConsultationRequest[];
      };

      if (!response.ok) {
        throw new Error(
          result.error ?? "We could not load the request inbox.",
        );
      }
      if (!Array.isArray(result.requests)) {
        throw new Error("The request service returned an unexpected response.");
      }

      setRequests(result.requests);
      setScreen("ready");
    } catch (error) {
      console.error("Could not load the DIXIT admin inbox:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not load the request inbox. Please try again.",
      );
      setScreen("error");
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;

    let active = true;
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setErrorMessage("We could not verify your admin session. Please sign in again.");
        setScreen("login");
        return;
      }
      if (data.session) {
        void loadRequests(data.session.access_token);
      } else {
        setScreen("login");
      }
    });

    return () => {
      active = false;
    };
  }, [loadRequests]);

  const visibleRequests = useMemo(() => {
    const query = search.trim().toLowerCase();
    return requests.filter((request) => {
      const matchesFilter = filter === "all" || request.interest === filter;
      const searchableText = [
        request.name,
        request.email,
        request.phone ?? "",
        request.message,
        interestLabels[request.interest],
      ]
        .join(" ")
        .toLowerCase();
      return matchesFilter && (!query || searchableText.includes(query));
    });
  }, [filter, requests, search]);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.session) {
        setErrorMessage(
          "Sign-in failed. Check your credentials and confirm this email has DIXIT admin access.",
        );
        return;
      }

      setPassword("");
      await loadRequests(data.session.access_token);
    } catch (error) {
      console.error("Could not sign in to the DIXIT admin desk:", error);
      setErrorMessage("The sign-in service is unavailable. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignOut() {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setErrorMessage("We could not sign you out. Please try again.");
        return;
      }
    } catch (error) {
      console.error("Could not sign out from the DIXIT admin desk:", error);
      setErrorMessage("We could not sign you out. Please try again.");
      return;
    }
    setRequests([]);
    setErrorMessage("");
    setScreen("login");
  }

  async function handleRefresh() {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        setErrorMessage("Your admin session has expired. Please sign in again.");
        setScreen("login");
        return;
      }
      await loadRequests(data.session.access_token);
    } catch (error) {
      console.error("Could not refresh the DIXIT admin inbox:", error);
      setErrorMessage("The request service is unavailable. Please try again.");
      setScreen("error");
    }
  }

  if (screen === "checking" || screen === "loading") {
    return (
      <main className="admin-shell flex min-h-screen items-center justify-center bg-kd-cream px-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-kd-gold-dark">
          {screen === "loading" ? "Opening the request desk..." : "Checking access..."}
        </p>
      </main>
    );
  }

  if (screen === "configuration") {
    return (
      <main className="admin-shell flex min-h-screen items-center bg-kd-cream px-6 py-16">
        <section className="mx-auto w-full max-w-xl border border-kd-black/15 bg-white p-8 shadow-sm sm:p-12">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-kd-gold-dark">
            DIXIT · Admin setup
          </p>
          <h1 className="font-display mt-5 text-4xl leading-tight sm:text-5xl">
            Connect the admin desk.
          </h1>
          <p className="mt-5 text-sm leading-7 text-kd-gray">
            Add the Supabase project URL and publishable key to the public
            environment, then configure the server-only secret key and the
            admin email allowlist. No credentials are included in the site.
          </p>
          <p className="mt-6 border-t border-kd-black/10 pt-5 text-xs leading-6 text-kd-charcoal/75">
            Required: <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
            <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>,{" "}
            <code>SUPABASE_SECRET_KEY</code>, and <code>ADMIN_EMAILS</code>.
          </p>
        </section>
      </main>
    );
  }

  if (screen === "login") {
    return (
      <main className="admin-shell flex min-h-screen items-center bg-kd-cream px-6 py-16">
        <section className="mx-auto w-full max-w-md border border-kd-black/15 bg-white p-8 shadow-sm sm:p-12">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-kd-gold-dark">
            DIXIT · Private access
          </p>
          <h1 className="font-display mt-5 text-4xl leading-tight sm:text-5xl">
            The request desk.
          </h1>
          <p className="mt-4 text-sm leading-7 text-kd-gray">
            Sign in with an authorized DIXIT admin account to review client
            enquiries and made-to-order requests.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSignIn}>
            <div>
              <label htmlFor="admin-email" className="text-xs font-medium">
                Admin email
              </label>
              <input
                autoComplete="username"
                className="mt-2 min-h-12 w-full border border-kd-black/20 bg-transparent px-4 text-sm outline-none transition-colors focus:border-kd-gold-dark focus:ring-1 focus:ring-kd-gold-dark"
                id="admin-email"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="text-xs font-medium">
                Password
              </label>
              <input
                autoComplete="current-password"
                className="mt-2 min-h-12 w-full border border-kd-black/20 bg-transparent px-4 text-sm outline-none transition-colors focus:border-kd-gold-dark focus:ring-1 focus:ring-kd-gold-dark"
                id="admin-password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </div>
            {errorMessage ? (
              <p className="text-sm leading-6 text-red-700" role="alert">
                {errorMessage}
              </p>
            ) : null}
            <Button
              className="w-full bg-kd-black text-kd-gold hover:bg-kd-charcoal"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-7 border-t border-kd-black/10 pt-5 text-xs leading-6 text-kd-gray">
            Access is limited to emails configured by the DIXIT administrator.
            Enquiries are not confirmed or paid orders.
          </p>
        </section>
      </main>
    );
  }

  if (screen === "error") {
    return (
      <main className="admin-shell flex min-h-screen items-center bg-kd-cream px-6 py-16">
        <section className="mx-auto w-full max-w-xl border border-kd-black/15 bg-white p-8 shadow-sm sm:p-12">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-kd-gold-dark">
            DIXIT · Request desk
          </p>
          <h1 className="font-display mt-5 text-4xl leading-tight">
            We could not open the inbox.
          </h1>
          <p className="mt-4 text-sm leading-7 text-kd-gray" role="alert">
            {errorMessage}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              className="bg-kd-black text-kd-gold hover:bg-kd-charcoal"
              onClick={() => void handleRefresh()}
            >
              Try again
            </Button>
            <Button onClick={() => void handleSignOut()} variant="outline">
              Sign out
            </Button>
          </div>
        </section>
      </main>
    );
  }

  const counts = {
    all: requests.length,
    bespoke: requests.filter((request) => request.interest === "bespoke").length,
    madeToOrder: requests.filter(
      (request) =>
        request.interest === "ready-to-wear" ||
        request.interest === "occasion-wear",
    ).length,
  };

  return (
    <main className="admin-shell min-h-screen bg-kd-cream pb-16">
      <header className="border-b border-white/10 bg-kd-black text-kd-white">
        <Container className="flex min-h-20 items-center justify-between gap-5">
          <div>
            <Link href="/" className="font-display text-2xl font-semibold tracking-[0.08em]">
              DIXIT
            </Link>
            <p className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-kd-gold">
              Admin · Request desk
            </p>
          </div>
          <Button
            onClick={() => void handleSignOut()}
            variant="outline"
            className="min-h-10 px-4 text-[0.6rem]"
          >
            Sign out
          </Button>
        </Container>
      </header>

      <Container className="py-10 md:py-14">
        <div className="flex flex-col gap-6 border-b border-kd-black/15 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-kd-gold-dark">
              Client enquiries
            </p>
            <h1 className="font-display mt-3 text-5xl leading-none sm:text-6xl">
              Good work starts here.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-kd-gray">
              Review new requests and follow up personally. The list shows the
              latest 100 enquiries; a request is not a confirmed order.
            </p>
          </div>
          <Button
            onClick={() => void handleRefresh()}
            variant="outline"
            className="self-start md:self-auto"
          >
            Refresh inbox
          </Button>
        </div>

        {errorMessage ? (
          <p
            className="mt-6 border border-red-800/20 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="status"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["All requests", counts.all],
            ["Bespoke", counts.bespoke],
            ["Made-to-order / occasion", counts.madeToOrder],
          ].map(([label, count]) => (
            <article
              key={label}
              className="border border-kd-black/10 bg-white p-5"
            >
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-kd-gray">
                {label}
              </p>
              <p className="font-display mt-3 text-4xl text-kd-black">
                {count}
              </p>
            </article>
          ))}
        </div>

        <section className="mt-10">
          <div className="flex flex-col gap-4 border-b border-kd-black/15 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-display text-3xl">The inbox</h2>
              <p className="mt-1 text-xs text-kd-gray">
                {visibleRequests.length} of {requests.length} requests
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(14rem,1fr)_auto]">
              <label className="sr-only" htmlFor="request-search">
                Search requests
              </label>
              <input
                className="min-h-11 border border-kd-black/20 bg-white px-4 text-sm outline-none focus:border-kd-gold-dark focus:ring-1 focus:ring-kd-gold-dark"
                id="request-search"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, or message"
                type="search"
                value={search}
              />
              <label className="sr-only" htmlFor="request-filter">
                Filter requests
              </label>
              <select
                className="min-h-11 border border-kd-black/20 bg-white px-4 text-sm outline-none focus:border-kd-gold-dark focus:ring-1 focus:ring-kd-gold-dark"
                id="request-filter"
                onChange={(event) =>
                  setFilter(event.target.value as RequestFilter)
                }
                value={filter}
              >
                <option value="all">All interests</option>
                <option value="bespoke">Bespoke</option>
                <option value="ready-to-wear">Made to order</option>
                <option value="occasion-wear">Occasion wear</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {visibleRequests.map((request) => (
              <article
                key={request.id}
                className="border border-kd-black/10 bg-white p-5 sm:p-7"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-2xl">{request.name}</h3>
                      <span className="bg-kd-warm-gold px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-kd-black">
                        {interestLabels[request.interest]}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-kd-gray">
                      Received {formatDate(request.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em]">
                    <a
                      className="border-b border-kd-black/30 pb-1 hover:border-kd-gold-dark hover:text-kd-gold-dark"
                      href={`mailto:${encodeURIComponent(request.email)}`}
                    >
                      Email client
                    </a>
                    {request.phone ? (
                      <a
                        className="border-b border-kd-black/30 pb-1 hover:border-kd-gold-dark hover:text-kd-gold-dark"
                        href={`tel:${encodeURIComponent(request.phone)}`}
                      >
                        Call client
                      </a>
                    ) : null}
                  </div>
                </div>
                <p className="mt-5 max-w-4xl whitespace-pre-wrap text-sm leading-7 text-kd-charcoal">
                  {request.message}
                </p>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-kd-black/10 pt-4 text-xs text-kd-gray">
                  <a
                    className="hover:text-kd-black"
                    href={`mailto:${encodeURIComponent(request.email)}`}
                  >
                    {request.email}
                  </a>
                  {request.phone ? (
                    <a
                      className="hover:text-kd-black"
                      href={`tel:${encodeURIComponent(request.phone)}`}
                    >
                      {request.phone}
                    </a>
                  ) : null}
                </div>
              </article>
            ))}

            {visibleRequests.length === 0 ? (
              <div className="border border-dashed border-kd-black/20 bg-white px-6 py-14 text-center">
                <h3 className="font-display text-2xl">
                  {requests.length === 0
                    ? "The inbox is ready for its first enquiry."
                    : "No requests match this search."}
                </h3>
                <p className="mt-3 text-sm leading-6 text-kd-gray">
                  {requests.length === 0
                    ? "New website enquiries will appear here once Supabase is connected."
                    : "Try another name, email, message, or interest filter."}
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </Container>
    </main>
  );
}
