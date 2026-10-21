import { z } from "zod";

// Treat unset and empty ("") the same, so a blank line in .env.local means "not set".
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === "" ? undefined : v), schema.optional());

// Supabase values are required (they come from the committed .env file).
// Cloudinary stays optional until product images are set up.
const required = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === "" ? undefined : v), schema);

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: optional(z.url()),
  NEXT_PUBLIC_SUPABASE_URL: required(z.url()),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: required(z.string().min(20)),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: optional(
    z.string().regex(/^[a-z0-9_-]+$/i, "Cloudinary cloud name looks wrong"),
  ),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

export function parsePublicEnv(source: Record<string, string | undefined>): PublicEnv {
  const result = publicEnvSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid public environment variables:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

// Next.js inlines NEXT_PUBLIC_* at build time only when each one is written out
// in full, so list them explicitly instead of passing process.env.
export const publicEnv = parsePublicEnv({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
});

/** Returns the value or throws a clear error naming the missing variable. */
export function requireEnv<T>(value: T | undefined, name: string): T {
  if (value === undefined) {
    throw new Error(`Missing environment variable ${name}. See .env.example.`);
  }
  return value;
}
