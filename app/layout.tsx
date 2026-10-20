import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Slab } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tlip Ventures — Home & Kitchen",
    template: "%s | Tlip Ventures",
  },
  description: "Home and kitchen goods in Ghana. Order on WhatsApp.",
};

export const viewport: Viewport = {
  themeColor: "#0f6b43",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GH" className={`${inter.variable} ${robotoSlab.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
