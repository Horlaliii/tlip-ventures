// Runs once when the server starts: fail fast on malformed environment variables.
export async function register() {
  await import("@/lib/env");
  const { getServerEnv } = await import("@/lib/server/env");
  getServerEnv();
}
