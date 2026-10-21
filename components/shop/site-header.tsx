import Image from "next/image";
import Link from "next/link";
import { BrandBand } from "@/components/ui/brand-band";
import { buildCategoryTree } from "@/lib/categories";
import { getCategories, getSettings } from "@/lib/server/catalogue";
import { CartLink } from "./cart-link";
import { MenuDisclosure } from "./menu-disclosure";
import { SearchForm } from "./search-form";

export async function SiteHeader() {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);
  const tree = buildCategoryTree(categories);

  return (
    <header className="bg-brand-green text-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      {settings.announcement && (
        <p className="bg-ink px-4 py-2 text-center text-sm text-white">{settings.announcement}</p>
      )}
      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center gap-x-2 gap-y-3 sm:gap-x-4 px-4 py-3">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 rounded text-white no-underline sm:gap-3"
          aria-label={`${settings.store_name} home`}
        >
          <Image src="/brand/logo.webp" alt="" width={48} height={48} unoptimized preload className="h-11 w-11 sm:h-12 sm:w-12" />
          <span className="font-heading text-base font-bold leading-none sm:text-xl">{settings.store_name}</span>
        </Link>

        <div className="order-last w-full md:order-none md:flex-1">
          <SearchForm id="header-search" />
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <MenuDisclosure
            summary={
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-lg border border-white/60 px-2.5 font-semibold sm:px-3 hover:bg-white/10 [&::-webkit-details-marker]:hidden">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
                {/* Short label on phones so the button fits beside the logo at 360px. */}
                <span className="sm:hidden">Menu</span>
                <span className="hidden sm:inline">Categories</span>
              </summary>
            }
          >
            <nav
              aria-label="Categories"
              className="absolute inset-x-0 top-full z-40 max-h-[75vh] overflow-y-auto border-t border-white/20 bg-brand-green px-4 pb-6 pt-2 shadow-lg"
            >
              <ul className="mx-auto grid max-w-6xl gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
                {tree.map((parent) => (
                  <li key={parent.id} className="border-b border-white/15 py-2 last:border-0 sm:border-0">
                    <Link
                      href={`/categories/${parent.slug}`}
                      className="flex min-h-11 items-center font-heading text-lg font-bold text-white no-underline hover:underline"
                    >
                      {parent.name}
                    </Link>
                    {parent.children.length > 0 && (
                      <ul>
                        {parent.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/categories/${child.slug}`}
                              className="flex min-h-11 items-center pl-3 text-white/95 no-underline hover:underline"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
                <li className="py-2 sm:col-span-2 lg:col-span-4">
                  <Link
                    href="/products"
                    className="flex min-h-11 items-center font-semibold text-white underline underline-offset-4"
                  >
                    Browse all products
                  </Link>
                </li>
              </ul>
            </nav>
          </MenuDisclosure>
          <CartLink />
        </div>
      </div>
      <BrandBand />
    </header>
  );
}
