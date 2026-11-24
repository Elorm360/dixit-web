import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export type Enquiry = {
  id: string;
  created_at: string;
  updated_at: string | null;
  status: string;
  service: string;
  occasion: string;
  event_date: string | null;
  consultation_type: string;
  preferred_date: string;
  preferred_time: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  details: string | null;
  notes: string | null;
  /** Confirmed consultation time, set by staff. Absent until the booking migration is applied. */
  consultation_at?: string | null;
};

export const STUDIO_TIME_ZONE = "Africa/Accra";

/** "Tue 3 Dec 2026, 14:30" in studio time. */
export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    timeZone: STUDIO_TIME_ZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** ISO timestamp → value for an <input type="datetime-local">, in studio time. */
export function toDateTimeLocal(value: string | null | undefined) {
  if (!value) return "";
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: STUDIO_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date(value))
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

/** <input type="datetime-local"> value (studio time, Accra = UTC+0) → ISO timestamp. */
export function fromDateTimeLocal(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const d = new Date(`${value}:00Z`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** Postgres "undefined column" — the booking migration hasn't been applied yet. */
export function isMissingColumn(error: { code?: string; message?: string } | null) {
  return Boolean(error && (error.code === "42703" || error.code === "PGRST204" || /consultation_at/.test(error.message ?? "")));
}

/**
 * Use at the top of every admin page and server action.
 * Signed-out visitors go to the login page; signed-in non-staff are signed out.
 */
export async function requireStaff() {
  if (!supabaseConfigured()) redirect("/admin/login");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/admin/login");

  const { data: isStaff } = await supabase.rpc("is_staff");
  if (!isStaff) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=not-staff");
  }
  // Falls back to "staff" if the roles migration has not been applied yet.
  const { data: roleData, error: roleError } = await supabase.rpc("my_staff_role");
  const role: StaffRole = !roleError && roleData === "super_admin" ? "super_admin" : "staff";
  return { supabase, userId, role, email: (data.claims.email as string | undefined) ?? "" };
}

export type StaffRole = "super_admin" | "staff";

export const roleLabels: Record<StaffRole, string> = { super_admin: "Super admin", staff: "Staff" };

/** For pages and actions only super admins may use. Other staff go back to the overview. */
export async function requireSuperAdmin() {
  const staff = await requireStaff();
  if (staff.role !== "super_admin") redirect("/admin?error=super-admin-only");
  return staff;
}

export function formatDate(value: string | null, withTime = false) {
  if (!value) return "—";
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime && { hour: "2-digit", minute: "2-digit" }),
  });
}

/** Turns a phone number into wa.me format, assuming Ghana (+233) for local numbers. */
export function whatsappNumber(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = `233${digits.slice(1)}`;
  return digits;
}
