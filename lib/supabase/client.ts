import { createBrowserClient } from "@supabase/ssr";
import { publicEnv, requireEnv } from "@/lib/env";

/** Supabase client for Client Components. Uses the publishable (anon) key only. */
export function createClient() {
  return createBrowserClient(
    requireEnv(publicEnv.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  );
}
