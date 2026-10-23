import type { Pesewas } from "@/lib/money";

/** The variant fields needed to work out prices and stock. */
export type VariantPricing = {
  in_stock: boolean;
  price_override: Pesewas | null;
};

/** The product fields needed to work out prices. */
export type ProductPricing = {
  price: Pesewas;
  compare_at_price: Pesewas | null;
};

export type PriceSummary = {
  min: Pesewas;
  max: Pesewas;
  /** "Was" price to show struck through, only when it is above every current price. */
  compareAt: Pesewas | null;
  inStock: boolean;
};

/** A variant's price: its override if set, otherwise the product price. */
export function variantPrice(product: ProductPricing, variant: VariantPricing): Pesewas {
  return variant.price_override ?? product.price;
}

/**
 * Price range and stock state for display. Prices come from the in-stock
 * variants when there are any, so "From GH₵ 90" is a price you can order at.
 */
export function priceSummary(product: ProductPricing, variants: readonly VariantPricing[]): PriceSummary {
  const inStock = variants.some((v) => v.in_stock);
  const pool = inStock ? variants.filter((v) => v.in_stock) : variants;
  const prices = pool.length > 0 ? pool.map((v) => variantPrice(product, v)) : [product.price];
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const compareAt =
    product.compare_at_price !== null && product.compare_at_price > max ? product.compare_at_price : null;
  return { min, max, compareAt, inStock };
}

/** "Black", "Black / Large", or null for a product without options. */
export function optionLabel(variant: {
  option1_value: string | null;
  option2_value: string | null;
}): string | null {
  const values = [variant.option1_value, variant.option2_value].filter((v): v is string => Boolean(v));
  return values.length > 0 ? values.join(" / ") : null;
}
