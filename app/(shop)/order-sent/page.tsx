import type { Metadata } from "next";
import { OrderSentView } from "@/components/shop/order-sent-view";

export const metadata: Metadata = {
  title: "Send your order on WhatsApp",
  robots: { index: false },
};

export default function OrderSentPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-6">
      <OrderSentView />
    </div>
  );
}
