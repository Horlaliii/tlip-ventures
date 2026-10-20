import Link from "next/link";
import { ProductGrid } from "@/components/shop/product-card";
import { CategoryTiles } from "@/components/shop/category-tiles";
import { buildCategoryTree } from "@/lib/categories";
import { getCategories, listProducts } from "@/lib/server/catalogue";

export default async function HomePage() {
  const [categories, featured, newest] = await Promise.all([
    getCategories(),
    listProducts({ featured: true, pageSize: 8 }),
    listProducts({ pageSize: 8 }),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-12 px-4 pb-16 pt-8">
      <section className="space-y-4 text-center sm:text-left">
        <p className="inline-block rounded-full bg-brand-gold/20 px-3 py-1 text-sm font-semibold text-ink">
          Home &amp; kitchen goods in Ghana
        </p>
        <h1 className="font-heading text-3xl font-bold text-brand-green sm:text-5xl">
          Everything for your kitchen and home
        </h1>
        <p className="mx-auto max-w-xl text-base leading-relaxed sm:mx-0">
          Blenders, kettles, storage, laundry and more. Pick what you like and order straight on WhatsApp.
        </p>
        <Link
          href="/products"
          className="inline-flex min-h-11 items-center rounded-lg bg-brand-orange px-5 text-base font-bold text-white no-underline hover:bg-brand-orange-dark"
        >
          Shop all products
        </Link>
      </section>

      <section aria-labelledby="categories-heading" className="space-y-4">
        <h2 id="categories-heading" className="text-2xl font-bold text-brand-green">
          Shop by category
        </h2>
        <CategoryTiles categories={buildCategoryTree(categories)} />
      </section>

      {featured && featured.products.length > 0 && (
        <section aria-labelledby="featured-heading" className="space-y-4">
          <h2 id="featured-heading" className="text-2xl font-bold text-brand-green">
            Featured
          </h2>
          <ProductGrid products={featured.products} />
        </section>
      )}

      {newest && newest.products.length > 0 && (
        <section aria-labelledby="new-heading" className="space-y-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="new-heading" className="text-2xl font-bold text-brand-green">
              New arrivals
            </h2>
            <Link href="/products" className="inline-flex min-h-11 items-center font-semibold">
              See all
            </Link>
          </div>
          <ProductGrid products={newest.products} />
        </section>
      )}
    </div>
  );
}
