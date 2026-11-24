import { NextResponse } from "next/server";

const SERVICES = ["Bespoke", "Womenswear", "Menswear", "Ready to Wear", "Occasion Wear", "Styling", "Other"];
const CONSULTATION_TYPES = ["Atelier", "Remote"];

const LIMITS: Record<string, number> = {
  service: 40, interest: 200, occasion: 200, event_date: 10, consultation_type: 20,
  preferred_date: 10, preferred_time: 5, full_name: 120, email: 254, phone: 40,
  location: 120, details: 3000,
};
const REQUIRED = ["service", "occasion", "consultation_type", "preferred_date", "preferred_time", "full_name", "email", "phone", "location"];

const LABELS: Record<string, string> = {
  service: "Service", interest: "Interested in", occasion: "Occasion / requirement",
  event_date: "Event date", consultation_type: "Consultation", preferred_date: "Preferred date",
  preferred_time: "Preferred time", full_name: "Name", email: "Email", phone: "Phone / WhatsApp",
  location: "Location", details: "Details",
};

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

async function sendEmail(data: Record<string, string>) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_EMAIL_TO;
  if (!apiKey || !to) return false;

  const rows = Object.keys(LABELS)
    .filter((k) => data[k])
    .map((k) => `<tr><td style="padding:6px 16px 6px 0;color:#6d685f;vertical-align:top">${LABELS[k]}</td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(data[k])}</td></tr>`)
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ENQUIRY_EMAIL_FROM || "DIXIT Website <onboarding@resend.dev>",
      to: to.split(",").map((s) => s.trim()),
      reply_to: data.email,
      subject: `New enquiry: ${data.service} — ${data.full_name}`,
      html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#080808"><h2 style="font-weight:normal">New DIXIT enquiry</h2><table>${rows}</table></div>`,
    }),
  });
  if (!res.ok) console.error("Resend failed:", res.status, await res.text());
  return res.ok;
}

async function saveToSupabase(data: Record<string, string>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return false;

  const { interest, ...row } = data;
  if (interest) row.details = `Interested in: ${interest}\n\n${row.details ?? ""}`.trim();

  const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/consultation_requests`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ ...row, event_date: row.event_date || null }),
  });
  if (!res.ok) console.error("Supabase insert failed:", res.status, await res.text());
  return res.ok;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill the hidden field. Pretend success.
  if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ ok: true });

  const data: Record<string, string> = {};
  for (const [field, max] of Object.entries(LIMITS)) {
    const value = typeof body[field] === "string" ? (body[field] as string).trim() : "";
    if (value.length > max) return NextResponse.json({ error: `${LABELS[field]} is too long.` }, { status: 400 });
    if (value) data[field] = value;
  }
  const missing = REQUIRED.filter((f) => !data[f]);
  if (missing.length) return NextResponse.json({ error: `Please complete: ${missing.map((f) => LABELS[f]).join(", ")}.` }, { status: 400 });
  if (!SERVICES.includes(data.service) || !CONSULTATION_TYPES.includes(data.consultation_type)) {
    return NextResponse.json({ error: "Please choose one of the listed options." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const [emailed, saved] = await Promise.all([
    sendEmail(data).catch(() => false),
    saveToSupabase(data).catch(() => false),
  ]);

  if (!emailed && !saved) {
    return NextResponse.json(
      { error: "We could not send your enquiry just now. Please try again, or reach us on WhatsApp." },
      { status: 503 },
    );
  }
  return NextResponse.json({ ok: true });
}
