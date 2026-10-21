import Image from "next/image";
import type { ProductImage as ProductImageData } from "@/lib/server/catalogue";

type Props = {
  image: ProductImageData | null;
  /** Passed to next/image so phones download a small file. */
  sizes: string;
  /** Load straight away: only for the main image above the fold. */
  eager?: boolean;
};

/** Square product photo from Cloudinary, or a plain placeholder when there is none yet. */
export function ProductImage({ image, sizes, eager = false }: Props) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
      {image ? (
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          className="object-contain"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-neutral-400" role="img" aria-label="No photo yet">
          <svg viewBox="0 0 24 24" className="h-1/3 w-1/3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="10" r="1.5" />
            <path d="m21 16-5-5-8 8" />
          </svg>
        </div>
      )}
    </div>
  );
}
