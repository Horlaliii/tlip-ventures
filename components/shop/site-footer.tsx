import { BrandBand } from "@/components/ui/brand-band";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-brand-green text-white">
      <BrandBand />
      <div className="mx-auto max-w-6xl space-y-1 px-4 py-6 text-sm">
        <p className="font-heading text-base font-bold">Tlip Ventures</p>
        <p>Home &amp; kitchen goods · Ghana</p>
        <p className="text-white/90">Judges 6:24</p>
      </div>
    </footer>
  );
}
