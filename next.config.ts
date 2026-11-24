import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL) : null;
const isLocalSupabase = supabaseUrl?.hostname === "127.0.0.1" || supabaseUrl?.hostname === "localhost";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseUrl ? [new URL(`${supabaseUrl.origin}/storage/v1/object/public/**`)] : [],
    // Only needed when developing against a local Supabase.
    dangerouslyAllowLocalIP: isLocalSupabase,
  },
};

export default nextConfig;
