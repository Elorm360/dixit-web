"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

const serviceOptions = [
  "Bespoke",
  "Menswear",
  "Ready to Wear",
  "Occasion Wear",
  "Styling",
  "Other",
] as const;
const consultationOptions = ["Atelier", "Remote"] as const;

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function ConsultationForm() {
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionState("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    // A quiet honeypot field helps filter basic automated form submissions.
    if (String(formData.get("website") ?? "").trim()) {
      setSubmissionState("success");
      return;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !publishableKey) {
      setSubmissionState("error");
      setErrorMessage("The enquiry service is not configured yet. Please contact us directly while we complete setup.");
      return;
    }

    const payload = {
      service: String(formData.get("service") ?? ""),
      occasion: String(formData.get("occasion") ?? "").trim(),
      event_date: String(formData.get("event_date") ?? "") || null,
      consultation_type: String(formData.get("consultation_type") ?? ""),
      preferred_date: String(formData.get("preferred_date") ?? ""),
      preferred_time: String(formData.get("preferred_time") ?? ""),
      full_name: String(formData.get("full_name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      location: String(formData.get("location") ?? "").trim(),
      details: String(formData.get("details") ?? "").trim(),
    };

    try {
      const response = await fetch(
        `${supabaseUrl.replace(/\/$/, "")}/rest/v1/consultation_requests`,
        {
          method: "POST",
          headers: {
            apikey: publishableKey,
            Authorization: `Bearer ${publishableKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const responseText = await response.text();
        console.error("DIXIT enquiry submission failed:", response.status, responseText);
        throw new Error("We could not send your enquiry just now. Please check your details and try again.");
      }

      setSubmissionState("success");
      form.reset();
    } catch (error) {
      setSubmissionState("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again in a moment.",
      );
    }
  }

  if (submissionState === "success") {
    return (
      <div className="border border-kd-black/15 bg-kd-white p-8 md:p-12" role="status" aria-live="polite">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">Enquiry received</p>
        <h2 className="font-display mt-5 text-4xl font-medium md:text-5xl">Thank you for reaching out.</h2>
        <p className="mt-6 max-w-xl text-sm leading-7 text-kd-gray">Your enquiry has been sent to the DIXIT team. We will be in touch to discuss the next step.</p>
        <button type="button" onClick={() => setSubmissionState("idle")} className="mt-8 border-b border-kd-black pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em]">Send another enquiry</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <fieldset>
        <legend className="font-display text-3xl md:text-4xl">What brings you to DIXIT?</legend>
        <p className="mt-2 text-sm text-kd-gray">Choose the closest starting point.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {serviceOptions.map((option) => (
            <label key={option} className="cursor-pointer">
              <input className="peer sr-only" type="radio" name="service" value={option} required />
              <span className="flex min-h-14 items-center border border-kd-black/15 px-5 text-sm transition-colors peer-checked:border-kd-gold-dark peer-checked:bg-kd-warm-gold">{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-6 md:grid-cols-2">
        <legend className="font-display mb-6 text-3xl md:text-4xl">Tell us a little more.</legend>
        <label className="block"><span className="kd-label">Occasion or requirement</span><input className="kd-input" name="occasion" maxLength={200} placeholder="What do you have in mind?" required /></label>
        <label className="block"><span className="kd-label">Event date (if applicable)</span><input className="kd-input" type="date" name="event_date" /></label>
      </fieldset>

      <fieldset>
        <legend className="font-display text-3xl md:text-4xl">How would you like to connect?</legend>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {consultationOptions.map((option) => (
            <label key={option} className="cursor-pointer">
              <input className="peer sr-only" type="radio" name="consultation_type" value={option} required />
              <span className="flex min-h-14 items-center border border-kd-black/15 px-5 text-sm transition-colors peer-checked:border-kd-gold-dark peer-checked:bg-kd-warm-gold">{option}</span>
            </label>
          ))}
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <label className="block"><span className="kd-label">Preferred date</span><input className="kd-input" type="date" name="preferred_date" required /></label>
          <label className="block"><span className="kd-label">Preferred time</span><input className="kd-input" type="time" name="preferred_time" required /></label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display text-3xl md:text-4xl">Your details.</legend>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <label className="block"><span className="kd-label">Full name</span><input className="kd-input" name="full_name" autoComplete="name" maxLength={120} required /></label>
          <label className="block"><span className="kd-label">Email</span><input className="kd-input" type="email" name="email" autoComplete="email" maxLength={254} required /></label>
          <label className="block"><span className="kd-label">Telephone / WhatsApp</span><input className="kd-input" type="tel" name="phone" autoComplete="tel" maxLength={40} required /></label>
          <label className="block"><span className="kd-label">Country / location</span><input className="kd-input" name="location" autoComplete="country-name" maxLength={120} required /></label>
        </div>
      </fieldset>

      <label className="block">
        <span className="font-display text-3xl md:text-4xl">Anything else we should know?</span>
        <textarea className="kd-input mt-6 min-h-36 resize-y" name="details" maxLength={3000} placeholder="Share your ideas, style preferences, or any useful context." />
      </label>

      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="border-t border-kd-black/15 pt-8">
        <Button type="submit" disabled={submissionState === "submitting"}>
          {submissionState === "submitting" ? "Sending enquiry…" : "Send your enquiry"}
        </Button>
        {submissionState === "error" && <p className="mt-4 text-sm text-red-700" role="alert">{errorMessage}</p>}
        <p className="mt-4 max-w-lg text-xs leading-6 text-kd-gray">Your details are used only to respond to this enquiry. Please do not include payment information or other sensitive data.</p>
      </div>
    </form>
  );
}
