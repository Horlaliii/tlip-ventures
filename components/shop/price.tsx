import { formatPesewas } from "@/lib/money";
import type { PriceSummary } from "@/lib/product";

type Props = {
  pricing: PriceSummary;
  size?: "md" | "lg";
};

/** "GH₵ 450", "From GH₵ 90", or a sale price with the old price struck through. */
export function Price({ pricing, size = "md" }: Props) {
  const { min, max, compareAt } = pricing;
  const priceClass = size === "lg" ? "text-2xl" : "text-base";
  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className={`${priceClass} font-bold text-ink`}>
        {min === max ? formatPesewas(min) : `From ${formatPesewas(min)}`}
      </span>
      {compareAt !== null && (
        <span className="text-sm text-neutral-600">
          <span className="sr-only">Was </span>
          <s>{formatPesewas(compareAt)}</s>
        </span>
      )}
    </p>
  );
}
