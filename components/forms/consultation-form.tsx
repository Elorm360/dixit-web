"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

type ConsultationFormProps = {
  initialInterest: string;
  isOrderRequest?: boolean;
};

const fieldClassName =
  "mt-2 min-h-12 w-full border border-kd-black/20 bg-transparent px-4 text-sm outline-none transition-colors placeholder:text-kd-gray/60 focus:border-kd-gold-dark focus:ring-1 focus:ring-kd-gold-dark";

export function ConsultationForm({
  initialInterest,
  isOrderRequest = false,
}: ConsultationFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result: { error?: string } = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(
          result.error ??
            "We could not submit your enquiry. Please try again.",
        );
        return;
      }

      setStatus("sent");
      setMessage(
        isOrderRequest
          ? "Thank you. Your request has been received. The DIXIT team will contact you to confirm the details; this is not an order confirmation."
          : "Thank you. Your enquiry has been received and the DIXIT team will be in touch.",
      );
      event.currentTarget.reset();
    } catch (error) {
      console.error("Consultation enquiry request failed:", error);
      setStatus("error");
      setMessage(
        "We could not reach the enquiry service. Please try again in a moment.",
      );
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="text-xs font-medium">
          Your name
        </label>
        <input
          className={fieldClassName}
          id="name"
          name="name"
          autoComplete="name"
          minLength={2}
          maxLength={100}
          required
          placeholder="Name"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="text-xs font-medium">
            Email address
          </label>
          <input
            className={fieldClassName}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-xs font-medium">
            Phone / WhatsApp <span className="text-kd-gray">(optional)</span>
          </label>
          <input
            className={fieldClassName}
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={32}
            placeholder="+233"
          />
        </div>
      </div>

      <div>
        <label htmlFor="interest" className="text-xs font-medium">
          What are you interested in?
        </label>
        <select
          className={fieldClassName}
          id="interest"
          name="interest"
          defaultValue={initialInterest}
          required
        >
          <option value="" disabled>
            Select an option
          </option>
          <option value="bespoke">Bespoke tailoring</option>
          <option value="ready-to-wear">Made-to-order collection</option>
          <option value="occasion-wear">Wedding or occasion wear</option>
          <option value="other">Something else</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-xs font-medium">
          {isOrderRequest
            ? "Which piece, size, and occasion are you interested in?"
            : "A little about what you have in mind"}
        </label>
        <textarea
          className={`${fieldClassName} min-h-36 resize-y py-3`}
          id="message"
          name="message"
          minLength={10}
          maxLength={2000}
          required
          placeholder={
            isOrderRequest
              ? "Include the collection or look, your preferred size, and any details that will help us guide you..."
              : "The occasion, the garment, or the feeling you are looking for..."
          }
        />
      </div>

      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <label className="flex items-start gap-3 text-xs leading-5 text-kd-gray">
        <input
          className="mt-1 accent-kd-gold-dark"
          name="consent"
          type="checkbox"
          value="yes"
          required
        />
        <span>
          I agree that DIXIT may use these details to respond to my enquiry. See
          the{" "}
          <a
            href="/privacy"
            className="underline underline-offset-2 hover:text-kd-black"
          >
            privacy notice
          </a>
          .
        </span>
      </label>

      {message ? (
        <p
          className={`text-sm leading-6 ${status === "error" ? "text-red-700" : "text-kd-charcoal"}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={status === "sending"}>
        {status === "sending"
          ? "Sending..."
          : isOrderRequest
            ? "Send order request"
            : "Send enquiry"}
      </Button>
    </form>
  );
}
