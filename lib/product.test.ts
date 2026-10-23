import { describe, expect, it } from "vitest";
import { optionLabel, priceSummary, variantPrice } from "./product";

const product = { price: 9000, compare_at_price: null };

describe("variantPrice", () => {
  it("uses the override when set, else the product price", () => {
    expect(variantPrice(product, { in_stock: true, price_override: null })).toBe(9000);
    expect(variantPrice(product, { in_stock: true, price_override: 12000 })).toBe(12000);
    expect(variantPrice(product, { in_stock: true, price_override: 0 })).toBe(0);
  });
});

describe("priceSummary", () => {
  it("gives a single price for a product with one variant", () => {
    expect(priceSummary(product, [{ in_stock: true, price_override: null }])).toEqual({
      min: 9000,
      max: 9000,
      compareAt: null,
      inStock: true,
    });
  });

  it("gives a range across in-stock variants", () => {
    const summary = priceSummary(product, [
      { in_stock: true, price_override: null },
      { in_stock: true, price_override: 12000 },
      { in_stock: false, price_override: 5000 },
    ]);
    expect(summary).toMatchObject({ min: 9000, max: 12000, inStock: true });
  });

  it("falls back to all variants when everything is out of stock", () => {
    const summary = priceSummary(product, [
      { in_stock: false, price_override: null },
      { in_stock: false, price_override: 12000 },
    ]);
    expect(summary).toMatchObject({ min: 9000, max: 12000, inStock: false });
  });

  it("falls back to the product price when there are no variants", () => {
    expect(priceSummary(product, [])).toEqual({ min: 9000, max: 9000, compareAt: null, inStock: false });
  });

  it("shows the compare-at price only when it is above every current price", () => {
    const onSale = { price: 89000, compare_at_price: 99000 };
    expect(priceSummary(onSale, [{ in_stock: true, price_override: null }]).compareAt).toBe(99000);
    expect(
      priceSummary(onSale, [
        { in_stock: true, price_override: null },
        { in_stock: true, price_override: 99000 },
      ]).compareAt,
    ).toBeNull();
  });
});

describe("optionLabel", () => {
  it("joins option values", () => {
    expect(optionLabel({ option1_value: "Black", option2_value: null })).toBe("Black");
    expect(optionLabel({ option1_value: "Black", option2_value: "Large" })).toBe("Black / Large");
    expect(optionLabel({ option1_value: null, option2_value: null })).toBeNull();
  });
});
