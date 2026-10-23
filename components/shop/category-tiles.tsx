import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/categories";

/** Grid of category links. Uses the category image when there is one. */
export function CategoryTiles({ categories }: { categories: Category[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={`/categories/${category.slug}`}
            className="flex h-full min-h-20 items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 text-ink no-underline hover:border-brand-green"
          >
            {category.image_url && (
              <Image
                src={category.image_url}
                alt=""
                width={56}
                height={56}
                sizes="56px"
                className="h-14 w-14 shrink-0 rounded object-cover"
              />
            )}
            <span className="font-heading text-base font-bold leading-snug text-brand-green">{category.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
