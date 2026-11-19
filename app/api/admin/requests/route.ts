import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET(request: Request) {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY;
  const secretKey =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminEmails = new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );

  if (!supabaseUrl || !publishableKey || !secretKey || adminEmails.size === 0) {
    return jsonResponse(
      { error: "Admin access is not configured for this environment." },
      503,
    );
  }

  const authorization = request.headers.get("authorization");
  const tokenMatch = authorization?.match(/^Bearer\s+(\S+)$/i);
  if (!tokenMatch || tokenMatch[1].length > 16_384) {
    return jsonResponse({ error: "Please sign in to access the admin inbox." }, 401);
  }

  const authClient = createClient(supabaseUrl, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  const { data, error: authError } = await authClient.auth.getUser(tokenMatch[1]);

  if (authError || !data.user) {
    return jsonResponse({ error: "Your admin session is invalid or expired." }, 401);
  }

  const userEmail = data.user.email?.trim().toLowerCase();
  if (
    !userEmail ||
    !data.user.email_confirmed_at ||
    !adminEmails.has(userEmail)
  ) {
    return jsonResponse(
      { error: "This account is not authorized to view the DIXIT admin inbox." },
      403,
    );
  }

  const adminClient = createClient(supabaseUrl, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  const { data: requests, error: queryError } = await adminClient
    .from("consultation_requests")
    .select("id, created_at, name, email, phone, interest, message")
    .order("created_at", { ascending: false })
    .limit(100);

  if (queryError) {
    console.error(
      "Could not load consultation requests for admin:",
      queryError.code,
      queryError.message,
    );
    return jsonResponse(
      { error: "The request inbox is unavailable. Please try again shortly." },
      500,
    );
  }

  return jsonResponse({ requests });
}
