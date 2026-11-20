import { type Enquiry, requireStaff } from "@/lib/admin";
import { statusMeta } from "@/lib/enquiry-status";

const COLUMNS: [keyof Enquiry, string][] = [
  ["created_at", "Received"],
  ["status", "Status"],
  ["full_name", "Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["location", "Location"],
  ["service", "Service"],
  ["occasion", "Occasion"],
  ["event_date", "Event date"],
  ["consultation_type", "Consultation"],
  ["preferred_date", "Preferred date"],
  ["preferred_time", "Preferred time"],
  ["details", "Message"],
  ["notes", "Internal notes"],
];

function cell(value: unknown) {
  let s = value == null ? "" : String(value);
  // Stop spreadsheet apps from executing client-supplied text as a formula.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const { supabase } = await requireStaff();
  const status = new URL(request.url).searchParams.get("status");

  let query = supabase.from("consultation_requests").select("*").order("created_at", { ascending: false }).limit(5000);
  if (status === "active") query = query.in("status", ["contacted", "scheduled", "in_progress"]);
  else if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) return new Response("Could not export enquiries.", { status: 500 });

  const rows = (data as Enquiry[]).map((e) =>
    COLUMNS.map(([key]) => cell(key === "status" ? statusMeta(e.status).label : e[key])).join(","),
  );
  const csv = "\uFEFF" + [COLUMNS.map(([, label]) => cell(label)).join(","), ...rows].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="dixit-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
