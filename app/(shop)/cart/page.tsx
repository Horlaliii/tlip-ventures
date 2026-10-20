import type { Metadata } from "next";
import { CartView } from "@/components/shop/cart-view";

export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-16 pt-6">
      <h1 className="text-3xl font-bold text-brand-green">Your cart</h1>
      <CartView />
    </div>
  );
}
