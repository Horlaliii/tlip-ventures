import { describe, expect, it } from "vitest";
import { parsePublicEnv, requireEnv } from "./env";

describe("parsePublicEnv", () => {
  it("allows everything to be unset in Phase 0", () => {
    expect(parsePublicEnv({})).toEqual({});
  });

  it("treats empty strings as unset", () => {
    expect(parsePublicEnv({ NEXT_PUBLIC_SUPABASE_URL: "" }).NEXT_PUBLIC_SUPABASE_URL).toBeUndefined();
  });

  it("rejects a malformed URL", () => {
    expect(() => parsePublicEnv({ NEXT_PUBLIC_SUPABASE_URL: "not a url" })).toThrow(
      /NEXT_PUBLIC_SUPABASE_URL/,
    );
  });
});

describe("requireEnv", () => {
  it("returns a set value and names a missing one", () => {
    expect(requireEnv("x", "A")).toBe("x");
    expect(() => requireEnv(undefined, "NEXT_PUBLIC_SUPABASE_URL")).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });
});
