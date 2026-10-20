import { describe, expect, it } from "vitest";
import { formatGhanaPhone, isGhanaPhone, normaliseGhanaPhone } from "./phone";

describe("normaliseGhanaPhone", () => {
  it.each([
    ["0241234567", "233241234567"],
    ["+233241234567", "233241234567"],
    ["233241234567", "233241234567"],
    ["024 123 4567", "233241234567"],
    ["+233 24 123 4567", "233241234567"],
    ["024-123-4567", "233241234567"],
    ["(024) 123.4567", "233241234567"],
    ["  0551234567  ", "233551234567"],
    ["0201234567", "233201234567"],
    ["0302123456", "233302123456"],
  ])("accepts %s", (input, expected) => {
    expect(normaliseGhanaPhone(input)).toBe(expected);
  });

  it.each([
    [""],
    ["   "],
    ["024123456"], // too short
    ["02412345678"], // too long
    ["241234567"], // missing leading 0
    ["+2330241234567"], // +233 followed by a leading 0
    ["2330241234567"],
    ["+23324123456"], // too short after +233
    ["+44241234567"], // not Ghana
    ["0141234567"], // national number must start with 2, 3 or 5
    ["0941234567"],
    ["024 123 456a"],
    ["024+1234567"],
    ["00233241234567"],
  ])("rejects %s", (input) => {
    expect(normaliseGhanaPhone(input)).toBeNull();
  });
});

describe("isGhanaPhone", () => {
  it("matches normaliseGhanaPhone", () => {
    expect(isGhanaPhone("0241234567")).toBe(true);
    expect(isGhanaPhone("12345")).toBe(false);
  });
});

describe("formatGhanaPhone", () => {
  it("formats a stored number for display", () => {
    expect(formatGhanaPhone("233241234567")).toBe("024 123 4567");
  });

  it("throws on an invalid number", () => {
    expect(() => formatGhanaPhone("12345")).toThrow();
  });
});
