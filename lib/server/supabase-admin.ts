import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { publicEnv, requireEnv } from "@/lib/env";
import { getServerEnv } from "@/lib/server/env";

/**
 * Supabase client with the secret (service-role) key. BYPASSES RLS.
 * Server-only: use for the checkout action and trusted admin jobs, never for
 * reading data on behalf of a visitor.
 */
export function createAdminClient() {
  return createClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    requireEnv(getServerEnv().SUPABASE_SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}
