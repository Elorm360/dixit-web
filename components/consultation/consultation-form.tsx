"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

const serviceOptions = ["Bespoke", "Menswear", "Womenswear", "Ready to Wear", "Occasion Wear", "Styling", "Other"];
const consultationOptions = ["Atelier", "Remote"];

export function ConsultationForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-kd-black/15 bg-kd-white p-8 md:p-12" role="status">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-kd-gold-dark">Enquiry prepared</p>
        <h2 className="font-display mt-5 text-4xl font-medium md:text-5xl">Thank you for reaching out.</h2>
        <p className="mt-6 max-w-xl text-sm leading-7 text-kd-gray">This preview form is not connected to secure submission yet. We will connect it to the DIXIT enquiry workflow before launch.</p>
        <button type="button" onClick={() => setSubmitted(false)} className="mt-8 border-b border-kd-black pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em]">Return to form</button>
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
        <label className="block"><span className="kd-label">Occasion or requirement</span><input className="kd-input" name="occasion" placeholder="What do you have in mind?" required /></label>
        <label className="block"><span className="kd-label">Event date (if applicable)</span><input className="kd-input" type="date" name="eventDate" /></label>
      </fieldset>

      <fieldset>
        <legend className="font-display text-3xl md:text-4xl">How would you like to connect?</legend>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {consultationOptions.map((option) => (
            <label key={option} className="cursor-pointer">
              <input className="peer sr-only" type="radio" name="consultationType" value={option} required />
              <span className="flex min-h-14 items-center border border-kd-black/15 px-5 text-sm transition-colors peer-checked:border-kd-gold-dark peer-checked:bg-kd-warm-gold">{option}</span>
            </label>
          ))}
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <label className="block"><span className="kd-label">Preferred date</span><input className="kd-input" type="date" name="preferredDate" required /></label>
          <label className="block"><span className="kd-label">Preferred time</span><input className="kd-input" type="time" name="preferredTime" required /></label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display text-3xl md:text-4xl">Your details.</legend>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <label className="block"><span className="kd-label">Full name</span><input className="kd-input" name="fullName" autoComplete="name" required /></label>
          <label className="block"><span className="kd-label">Email</span><input className="kd-input" type="email" name="email" autoComplete="email" required /></label>
          <label className="block"><span className="kd-label">Telephone / WhatsApp</span><input className="kd-input" type="tel" name="phone" autoComplete="tel" required /></label>
          <label className="block"><span className="kd-label">Country / location</span><input className="kd-input" name="location" autoComplete="country-name" required /></label>
        </div>
      </fieldset>

      <label className="block">
        <span className="font-display text-3xl md:text-4xl">Anything else we should know?</span>
        <textarea className="kd-input mt-6 min-h-36 resize-y" name="details" placeholder="Share your ideas, style preferences, or any useful context." />
      </label>

      <div className="border-t border-kd-black/15 pt-8">
        <Button type="submit">Send your enquiry</Button>
        <p className="mt-4 max-w-lg text-xs leading-6 text-kd-gray">This development preview does not yet send your information. Secure submission will be enabled before launch.</p>
      </div>
    </form>
  );
}
