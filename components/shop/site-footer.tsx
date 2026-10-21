import Link from "next/link";
import { BrandBand } from "@/components/ui/brand-band";
import { formatGhanaPhone } from "@/lib/phone";
import { getSettings } from "@/lib/server/catalogue";

export async function SiteFooter() {
  const settings = await getSettings();
  const socials = Object.entries(settings.social_links);

  return (
    <footer className="mt-auto bg-brand-green text-white">
      <BrandBand />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm sm:grid-cols-3">
        <div className="space-y-1">
          <p className="font-heading text-lg font-bold">{settings.store_name}</p>
          <p>Home &amp; kitchen goods · Ghana</p>
          {settings.tagline && <p className="text-white/90">{settings.tagline}</p>}
        </div>

        <div className="space-y-1">
          <h2 className="font-heading text-base font-bold">Visit or call</h2>
          {settings.shop_address && <p className="whitespace-pre-line">{settings.shop_address}</p>}
          {settings.opening_hours && <p className="whitespace-pre-line">{settings.opening_hours}</p>}
          <p>
            WhatsApp:{" "}
            <a
              href={`https://wa.me/${settings.whatsapp_number}`}
              className="inline-flex min-h-11 items-center font-semibold text-white underline underline-offset-4"
            >
              {formatGhanaPhone(settings.whatsapp_number)}
            </a>
          </p>
        </div>

        <div className="space-y-1">
          <h2 className="font-heading text-base font-bold">Shop</h2>
          <ul>
            <li>
              <Link href="/products" className="inline-flex min-h-11 items-center text-white underline underline-offset-4">
                All products
              </Link>
            </li>
            <li>
              <Link href="/categories" className="inline-flex min-h-11 items-center text-white underline underline-offset-4">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/how-to-order" className="inline-flex min-h-11 items-center text-white underline underline-offset-4">
                How to order
              </Link>
            </li>
            <li>
              <Link href="/about" className="inline-flex min-h-11 items-center text-white underline underline-offset-4">
                About and contact
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="inline-flex min-h-11 items-center text-white underline underline-offset-4">
                Privacy
              </Link>
            </li>
            {socials.map(([name, url]) => (
              <li key={name}>
                <a
                  href={url}
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center capitalize text-white underline underline-offset-4"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
