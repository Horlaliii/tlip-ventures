import type { Metadata, Viewport } from "next";
import { Roboto_Slab } from "next/font/google";
import localFont from "next/font/local";
import { Suspense } from "react";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Self-hosted Inter that includes the cedi sign ₵ (see app/fonts/README.md).
const inter = localFont({
  src: "./fonts/inter-latin-cedi.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const description =
  "Blenders, kettles, cookware, storage, laundry and more for homes in Ghana. Browse online and order on WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tlip Ventures — Home & Kitchen Goods in Ghana",
    template: "%s | Tlip Ventures",
  },
  description,
  applicationName: "Tlip Ventures",
  openGraph: {
    type: "website",
    siteName: "Tlip Ventures",
    locale: "en_GH",
    title: "Tlip Ventures — Home & Kitchen Goods in Ghana",
    description,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0f6b43",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GH" className={`${inter.variable} ${robotoSlab.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/* useSearchParams needs a Suspense boundary. */}
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
