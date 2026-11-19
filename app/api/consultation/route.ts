import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const allowedInterests = new Set([
  "bespoke",
  "ready-to-wear",
  "occasion-wear",
  "other",
]);

function isText(value: unknown): value is string {
  return typeof value === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return NextResponse.json(
      { error: "Please submit the enquiry using the form." },
      { status: 415 },
    );
  }

  const body = await request.text();
  if (body.length > 12_000) {
    return NextResponse.json(
      { error: "Your enquiry is too large. Please shorten your message." },
      { status: 413 },
    );
  }

  let parsedPayload: unknown;
  try {
    parsedPayload = JSON.parse(body);
  } catch {
    return NextResponse.json(
      { error: "The enquiry could not be read. Please check the form and try again." },
      { status: 400 },
    );
  }

  if (!isRecord(parsedPayload)) {
    return NextResponse.json(
      { error: "The enquiry could not be read. Please check the form and try again." },
      { status: 400 },
    );
  }

  const payload = parsedPayload;
  const name = isText(payload.name) ? payload.name.trim() : "";
  const email = isText(payload.email) ? payload.email.trim().toLowerCase() : "";
  const phone = isText(payload.phone) ? payload.phone.trim() : "";
  const interest = isText(payload.interest) ? payload.interest : "";
  const message = isText(payload.message) ? payload.message.trim() : "";
  const website = isText(payload.website) ? payload.website.trim() : "";

  if (website) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400 },
    );
  }

  if (
    name.length < 2 ||
    name.length > 100 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    (phone.length > 0 && (phone.length < 7 || phone.length > 32)) ||
    !allowedInterests.has(interest) ||
    message.length < 10 ||
    message.length > 2000 ||
    payload.consent !== "yes"
  ) {
    return NextResponse.json(
      { error: "Please check each field and provide consent before submitting." },
      { status: 400 },
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      {
        error:
          "The enquiry form is not connected yet. Please try again later or contact DIXIT directly.",
      },
      { status: 503 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await supabase.from("consultation_requests").insert({
    name,
    email,
    phone: phone || null,
    interest,
    message,
  });

  if (error) {
    console.error("Could not save consultation enquiry:", error.code, error.message);
    return NextResponse.json(
      { error: "We could not save your enquiry. Please try again shortly." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
