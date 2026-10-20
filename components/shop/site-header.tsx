import Image from "next/image";
import Link from "next/link";
import { BrandBand } from "@/components/ui/brand-band";

export function SiteHeader() {
  return (
    <header className="bg-brand-green text-white">
      <div className="mx-auto flex max-w-6xl items-center px-4 py-3">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-3 rounded text-white no-underline"
          aria-label="Tlip Ventures home"
        >
          <Image
            src="/brand/logo.svg"
            alt=""
            width={48}
            height={48}
            unoptimized
            priority
            className="h-12 w-12"
          />
          <span className="font-heading text-xl font-bold leading-none">Tlip Ventures</span>
        </Link>
      </div>
      <BrandBand />
    </header>
  );
}
