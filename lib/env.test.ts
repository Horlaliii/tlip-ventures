import { describe, expect, it } from "vitest";
import { parsePublicEnv, requireEnv } from "./env";

const supabase = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "sb_publishable_0123456789abcdef",
};

describe("parsePublicEnv", () => {
  it("requires the Supabase URL and publishable key", () => {
    expect(() => parsePublicEnv({})).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
    expect(() => parsePublicEnv({ NEXT_PUBLIC_SUPABASE_URL: supabase.NEXT_PUBLIC_SUPABASE_URL })).toThrow(
      /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
    );
  });

  it("treats empty strings as unset", () => {
    expect(() => parsePublicEnv({ ...supabase, NEXT_PUBLIC_SUPABASE_URL: "" })).toThrow(
      /NEXT_PUBLIC_SUPABASE_URL/,
    );
    expect(parsePublicEnv({ ...supabase, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "" }).NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME).toBeUndefined();
  });

  it("keeps Cloudinary and the site URL optional", () => {
    expect(parsePublicEnv(supabase)).toEqual(supabase);
  });

  it("rejects a malformed URL", () => {
    expect(() => parsePublicEnv({ ...supabase, NEXT_PUBLIC_SUPABASE_URL: "not a url" })).toThrow(
      /NEXT_PUBLIC_SUPABASE_URL/,
    );
  });
});

describe("requireEnv", () => {
  it("returns a set value and names a missing one", () => {
    expect(requireEnv("x", "A")).toBe("x");
    expect(() => requireEnv(undefined, "SUPABASE_SERVICE_ROLE_KEY")).toThrow(/SUPABASE_SERVICE_ROLE_KEY/);
  });
});
