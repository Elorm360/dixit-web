"use client";

import { useState } from "react";
import { adminButtonOutline, adminButtonPrimary } from "@/components/admin/ui";

type Context = { firstName: string; service: string; occasion: string; preferred: string; booked: string | null; consultationType: string };

const TEMPLATES: { id: string; label: string; subject: (c: Context) => string; body: (c: Context) => string }[] = [
  {
    id: "thanks",
    label: "Thank you — we received it",
    subject: (c) => `Your DIXIT enquiry — ${c.service}`,
    body: (c) =>
      `Hello ${c.firstName},\n\nThank you for reaching out to DIXIT about ${c.occasion ? `“${c.occasion}”` : `${c.service.toLowerCase()}`}. We’ve received your enquiry and would love to help.\n\nWe’ll be in touch shortly to arrange your consultation.\n\nWarm regards,\nThe DIXIT team`,
  },
  {
    id: "times",
    label: "Propose consultation times",
    subject: () => "Your DIXIT consultation — choosing a time",
    body: (c) =>
      `Hello ${c.firstName},\n\nThank you for your interest in DIXIT. You mentioned ${c.preferred} works for you. We can also offer:\n\n• [Day, date] at [time]\n• [Day, date] at [time]\n\nPlease let us know which suits you best${c.consultationType === "Remote" ? ", and we’ll send a video call link" : ""}.\n\nWarm regards,\nThe DIXIT team`,
  },
  {
    id: "confirm",
    label: "Confirm the booking",
    subject: () => "Your DIXIT consultation is confirmed",
    body: (c) =>
      `Hello ${c.firstName},\n\nYour DIXIT consultation is confirmed for ${c.booked ?? c.preferred}${c.consultationType === "Remote" ? " (remote — we’ll share the video call link beforehand)" : " at our atelier"}.\n\nIf you have reference images or ideas, feel free to send them ahead. We look forward to meeting you.\n\nWarm regards,\nThe DIXIT team`,
  },
  {
    id: "followup",
    label: "Follow up (no reply yet)",
    subject: (c) => `Following up on your ${c.service} enquiry`,
    body: (c) =>
      `Hello ${c.firstName},\n\nJust following up on your recent DIXIT enquiry. Are you still interested in arranging a consultation? We’d be happy to find a time that works for you.\n\nWarm regards,\nThe DIXIT team`,
  },
  {
    id: "ready",
    label: "Piece ready for fitting / collection",
    subject: () => "Your DIXIT piece is ready",
    body: (c) =>
      `Hello ${c.firstName},\n\nGood news — your piece is ready for its fitting. When would be a good time for you to come in?\n\nWarm regards,\nThe DIXIT team`,
  },
];

export function ReplyTemplates({ context, email, whatsappNumber }: { context: Context; email: string; whatsappNumber: string }) {
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const template = TEMPLATES.find((t) => t.id === templateId)!;
  const [body, setBody] = useState(template.body(context));
  const [copied, setCopied] = useState(false);

  function pick(id: string) {
    const next = TEMPLATES.find((t) => t.id === id)!;
    setTemplateId(id);
    setBody(next.body(context));
    setCopied(false);
  }

  const whatsapp = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(body)}`;
  const mail = `mailto:${email}?subject=${encodeURIComponent(template.subject(context))}&body=${encodeURIComponent(body)}`;

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="kd-label">Message</span>
        <select value={templateId} onChange={(e) => pick(e.target.value)} className="kd-input">
          {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </label>
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={9} className="kd-input resize-y text-sm leading-6" aria-label="Message text — edit before sending" />
      {body.includes("[") && <p className="text-xs text-amber-800">Fill in the parts in [brackets] before sending.</p>}
      <div className="flex flex-wrap gap-2">
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={adminButtonPrimary}>Send on WhatsApp</a>
        <a href={mail} className={adminButtonOutline}>Send by email</a>
        <button
          type="button"
          className={adminButtonOutline}
          onClick={async () => {
            await navigator.clipboard.writeText(body);
            setCopied(true);
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
