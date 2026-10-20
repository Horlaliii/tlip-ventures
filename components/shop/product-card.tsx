import Link from "next/link";
import type { ProductCardData } from "@/lib/server/catalogue";
import { Price } from "./price";
import { ProductImage } from "./product-image";

// Grid: 2 columns on phones, 3 from 640px, 4 from 1024px (max-w-6xl container).
const CARD_IMAGE_SIZES = "(min-width: 1152px) 270px, (min-width: 1024px) 23vw, (min-width: 640px) 31vw, 47vw";

export function ProductCard({ product }: { product: ProductCardData }) {
  const { pricing } = product;
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col gap-2 rounded-lg text-ink no-underline"
    >
      <div className="relative">
        <ProductImage image={product.image} sizes={CARD_IMAGE_SIZES} />
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {pricing.compareAt !== null && pricing.inStock && (
            <span className="rounded bg-brand-orange px-2 py-0.5 text-base font-bold text-white">Sale</span>
          )}
          {!pricing.inStock && (
            <span className="rounded bg-ink px-2 py-0.5 text-sm font-semibold text-white">Out of stock</span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 px-0.5">
        {product.brand && <p className="text-xs font-medium uppercase tracking-wide text-neutral-600">{product.brand}</p>}
        <h3 className="line-clamp-2 font-sans text-sm font-medium leading-snug group-hover:underline">
          {product.name}
        </h3>
        <div className="mt-auto">
          <Price pricing={pricing} />
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
