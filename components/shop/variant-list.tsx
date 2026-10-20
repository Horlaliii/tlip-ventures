import { formatPesewas } from "@/lib/money";
import { optionLabel, variantPrice } from "@/lib/product";
import type { ProductDetail } from "@/lib/server/catalogue";

/**
 * The product's options (e.g. colours) with price and stock for each.
 * Display only; choosing an option comes with the cart.
 */
export function VariantList({ product }: { product: ProductDetail }) {
  const options = product.variants
    .map((variant) => ({ variant, label: optionLabel(variant) }))
    .filter((o): o is typeof o & { label: string } => o.label !== null);
  if (!product.option1_name || options.length === 0) return null;

  const heading = [product.option1_name, product.option2_name].filter(Boolean).join(" / ");
  const prices = new Set(options.map(({ variant }) => variantPrice(product, variant)));
  const showPrices = prices.size > 1;

  return (
    <section aria-labelledby="options-heading" className="space-y-2">
      <h2 id="options-heading" className="text-lg font-bold text-brand-green">
        {heading}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {options.map(({ variant, label }) => (
          <li
            key={variant.id}
            className={`flex min-h-11 flex-col justify-center rounded-lg border px-3 py-1 text-sm ${
              variant.in_stock ? "border-neutral-400 text-ink" : "border-dashed border-neutral-300 text-neutral-600"
            }`}
          >
            <span className="font-semibold">{variant.in_stock ? label : <s>{label}</s>}</span>
            <span className="text-xs">
              {showPrices && `${formatPesewas(variantPrice(product, variant))} · `}
              {variant.in_stock ? "In stock" : "Out of stock"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
