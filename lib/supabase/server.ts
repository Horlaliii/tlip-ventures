import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { publicEnv, requireEnv } from "@/lib/env";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 * Acts as the signed-in user (admin) or as the public; RLS applies.
 * Create a new one per request.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    requireEnv(publicEnv.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component, where cookies are read-only.
            // Session refresh will happen in the proxy (added with admin auth in Phase 4).
          }
        },
      },
    },
  );
}
