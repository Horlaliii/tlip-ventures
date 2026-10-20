import { describe, expect, it } from "vitest";
import { formatPesewas, lineTotal, sumPesewas } from "./money";

describe("formatPesewas", () => {
  it("drops decimals for whole cedis", () => {
    expect(formatPesewas(45000)).toBe("GH₵ 450");
    expect(formatPesewas(24000)).toBe("GH₵ 240");
    expect(formatPesewas(0)).toBe("GH₵ 0");
  });

  it("shows two decimals when there are pesewas", () => {
    expect(formatPesewas(125050)).toBe("GH₵ 1,250.50");
    expect(formatPesewas(1)).toBe("GH₵ 0.01");
    expect(formatPesewas(99)).toBe("GH₵ 0.99");
    expect(formatPesewas(1005)).toBe("GH₵ 10.05");
  });

  it("groups thousands", () => {
    expect(formatPesewas(100000)).toBe("GH₵ 1,000");
    expect(formatPesewas(123456789)).toBe("GH₵ 1,234,567.89");
    expect(formatPesewas(100000000)).toBe("GH₵ 1,000,000");
  });

  it("formats negative amounts", () => {
    expect(formatPesewas(-125050)).toBe("-GH₵ 1,250.50");
  });

  it("rejects non-integer or unsafe values", () => {
    expect(() => formatPesewas(450.5)).toThrow(TypeError);
    expect(() => formatPesewas(Number.NaN)).toThrow(TypeError);
    expect(() => formatPesewas(Number.POSITIVE_INFINITY)).toThrow(TypeError);
    expect(() => formatPesewas(Number.MAX_SAFE_INTEGER + 1)).toThrow(TypeError);
  });
});

describe("lineTotal", () => {
  it("multiplies unit price by quantity", () => {
    expect(lineTotal(12000, 2)).toBe(24000);
    expect(lineTotal(45000, 0)).toBe(0);
  });

  it("rejects fractional or negative quantities", () => {
    expect(() => lineTotal(12000, 1.5)).toThrow(TypeError);
    expect(() => lineTotal(12000, -1)).toThrow(TypeError);
    expect(() => lineTotal(120.5, 1)).toThrow(TypeError);
  });
});

describe("sumPesewas", () => {
  it("adds amounts", () => {
    expect(sumPesewas([45000, 24000])).toBe(69000);
    expect(sumPesewas([])).toBe(0);
  });

  it("rejects floats", () => {
    expect(() => sumPesewas([100, 0.1])).toThrow(TypeError);
  });
});
