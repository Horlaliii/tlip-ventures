"use client";

import Link from "next/link";
import { cartCount } from "@/lib/cart";
import { useCart, useCartHydrated } from "@/lib/cart-store";

/** Header cart button with the number of items. The count appears once the saved cart has loaded. */
export function CartLink() {
  const hydrated = useCartHydrated();
  const count = useCart((s) => cartCount(s.lines));
  const shown = hydrated ? count : 0;

  return (
    <Link
      href="/cart"
      aria-label={shown > 0 ? `Cart, ${shown} ${shown === 1 ? "item" : "items"}` : "Cart"}
      className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/60 text-white hover:bg-white/10"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6.2" />
        <circle cx="9.5" cy="19.5" r="1.5" />
        <circle cx="17" cy="19.5" r="1.5" />
      </svg>
      {shown > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-gold px-1 text-xs font-bold text-ink"
        >
          {shown > 99 ? "99+" : shown}
        </span>
      )}
    </Link>
  );
}
