import { describe, expect, it } from "vitest";
import { listingQuery, parseListingParams, slugSchema } from "./listing";

describe("parseListingParams", () => {
  it("uses defaults when nothing is given", () => {
    expect(parseListingParams({})).toEqual({ page: 1, sort: "newest", q: "" });
  });

  it("reads valid values", () => {
    expect(parseListingParams({ page: "3", sort: "price-asc", q: "  kettle " })).toEqual({
      page: 3,
      sort: "price-asc",
      q: "kettle",
    });
  });

  it("falls back to defaults for bad values", () => {
    expect(parseListingParams({ page: "abc", sort: "cheapest" })).toEqual({ page: 1, sort: "newest", q: "" });
    expect(parseListingParams({ page: "0" }).page).toBe(1);
    expect(parseListingParams({ page: "-2" }).page).toBe(1);
    expect(parseListingParams({ page: "1.5" }).page).toBe(1);
    expect(parseListingParams({ page: "99999999" }).page).toBe(1);
    expect(parseListingParams({ q: "x".repeat(101) }).q).toBe("");
  });

  it("takes the first of repeated parameters", () => {
    expect(parseListingParams({ page: ["2", "5"], sort: ["price-desc", "newest"] })).toMatchObject({
      page: 2,
      sort: "price-desc",
    });
  });
});

describe("listingQuery", () => {
  it("leaves out defaults", () => {
    expect(listingQuery({})).toBe("");
    expect(listingQuery({ page: 1, sort: "newest", q: "" })).toBe("");
  });

  it("encodes values", () => {
    expect(listingQuery({ q: "pots & pans", sort: "price-asc", page: 2 })).toBe("?q=pots+%26+pans&sort=price-asc&page=2");
  });
});

describe("slugSchema", () => {
  it("accepts database-style slugs only", () => {
    expect(slugSchema.safeParse("blender-1-5l").success).toBe(true);
    expect(slugSchema.safeParse("Blender").success).toBe(false);
    expect(slugSchema.safeParse("a--b").success).toBe(false);
    expect(slugSchema.safeParse("../etc").success).toBe(false);
  });
});
