import { NextResponse } from "next/server";
import { validateConsultationForm } from "@/lib/consultation";

export const runtime = "nodejs";

function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url: url.replace(/\/$/, ""), serviceRoleKey };
}

async function supabaseRequest(
  config: { url: string; serviceRoleKey: string },
  path: string,
  init: RequestInit,
) {
  return fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });
}

export async function POST(request: Request) {
  const config = supabaseConfig();

  if (!config) {
    return NextResponse.json(
      { error: "Consultation submissions are not configured yet." },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const validation = validateConsultationForm(formData);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const data = validation.data;

  const clientResponse = await supabaseRequest(
    config,
    "clients?on_conflict=email",
    {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        location: data.location,
        updated_at: new Date().toISOString(),
      }),
    },
  );

  if (!clientResponse.ok) {
    console.error("Client upsert failed", clientResponse.status);
    return NextResponse.json(
      { error: "We could not prepare your consultation request. Please try again." },
      { status: 500 },
    );
  }

  const clients = (await clientResponse.json()) as Array<{ id: string }>;
  const client = clients[0];

  if (!client?.id) {
    return NextResponse.json(
      { error: "We could not prepare your consultation request. Please try again." },
      { status: 500 },
    );
  }

  const consultationResponse = await supabaseRequest(
    config,
    "consultation_requests",
    {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        client_id: client.id,
        service: data.service,
        occasion: data.occasion,
        event_date: data.eventDate,
        consultation_type: data.consultationType,
        preferred_date: data.preferredDate,
        preferred_time: data.preferredTime,
        details: data.details,
      }),
    },
  );

  if (!consultationResponse.ok) {
    console.error("Consultation insert failed", consultationResponse.status);
    return NextResponse.json(
      { error: "We could not save your consultation request. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
