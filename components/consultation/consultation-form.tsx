"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

const serviceOptions = [
  "Suit",
  "Traditional / Fusion",
  "Wedding",
  "Occasion Wear",
  "Smart Casual",
  "Styling",
  "Other",
];

const consultationOptions = ["Atelier", "Remote"];

export function ConsultationForm() {
  const [submitted, setSubmitted] = useState(false);\n  const [submitting, setSubmitting] = useState(false);\n  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error ?? "We could not send your request. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("We could not send your request. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border border-kd-black/15 bg-kd-white p-8 md:p-12" role="status">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">
          Request prepared
        </p>
        <h2 className="font-display mt-5 text-4xl font-medium md:text-5xl">
          Thank you for beginning the conversation.
        </h2>
        <p className="mt-6 max-w-xl text-sm leading-7 text-kd-gray">
          Your consultation request has been received. The KOFFY DODZI team can now review the details you shared and continue the conversation with you.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-8 border-b border-kd-black pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em]"
        >
          Return to form
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <fieldset>
        <legend className="font-display text-3xl md:text-4xl">
          What are you looking for?
        </legend>
        <p className="mt-2 text-sm text-kd-gray">Select the closest starting point.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {serviceOptions.map((option) => (
            <label key={option} className="cursor-pointer">
              <input
                className="peer sr-only"
                type="radio"
                name="service"
                value={option}
                required
              />
              <span className="flex min-h-14 items-center border border-kd-black/15 px-5 text-sm transition-colors peer-checked:border-kd-gold-dark peer-checked:bg-kd-warm-gold">
                {option}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-6 md:grid-cols-2">
        <legend className="font-display mb-6 text-3xl md:text-4xl">
          Tell us about the occasion.
        </legend>
        <label className="block">
          <span className="kd-label">Occasion or requirement</span>
          <input className="kd-input" name="occasion" placeholder="e.g. Wedding, business event" required />
        </label>
        <label className="block">
          <span className="kd-label">Event date</span>
          <input className="kd-input" type="date" name="eventDate" />
        </label>
      </fieldset>

      <fieldset>
        <legend className="font-display text-3xl md:text-4xl">
          How would you like to meet?
        </legend>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {consultationOptions.map((option) => (
            <label key={option} className="cursor-pointer">
              <input className="peer sr-only" type="radio" name="consultationType" value={option} required />
              <span className="flex min-h-14 items-center border border-kd-black/15 px-5 text-sm transition-colors peer-checked:border-kd-gold-dark peer-checked:bg-kd-warm-gold">
                {option}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="kd-label">Preferred date</span>
            <input className="kd-input" type="date" name="preferredDate" required />
          </label>
          <label className="block">
            <span className="kd-label">Preferred time</span>
            <input className="kd-input" type="time" name="preferredTime" required />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display text-3xl md:text-4xl">Your details.</legend>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="kd-label">Full name</span>
            <input className="kd-input" name="fullName" autoComplete="name" required />
          </label>
          <label className="block">
            <span className="kd-label">Email</span>
            <input className="kd-input" type="email" name="email" autoComplete="email" required />
          </label>
          <label className="block">
            <span className="kd-label">Telephone / WhatsApp</span>
            <input className="kd-input" type="tel" name="phone" autoComplete="tel" required />
          </label>
          <label className="block">
            <span className="kd-label">Country / location</span>
            <input className="kd-input" name="location" autoComplete="country-name" required />
          </label>
        </div>
      </fieldset>

      <label className="block">
        <span className="font-display text-3xl md:text-4xl">Anything else we should know?</span>
        <textarea
          className="kd-input mt-6 min-h-36 resize-y"
          name="details"
          placeholder="Share any style preferences, requirements, or context that would help us prepare."
        />
      </label>

      <div className="border-t border-kd-black/15 pt-8">
        {error ? (
          <p className="mb-5 max-w-xl border-l-2 border-kd-gold-dark pl-4 text-sm leading-7 text-kd-charcoal" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Sending request…" : "Request consultation"}
        </Button>
        <p className="mt-4 max-w-lg text-xs leading-6 text-kd-gray">
          Your information is submitted securely to KOFFY DODZI for the purpose of responding to your consultation request.
        </p>
      </div>
    </form>
  );
}
