import Link from "next/link";
import { listingQuery, SORTS, type ListingParams, type Sort } from "@/lib/listing";
import { pageCount } from "@/lib/pagination";

type Base = { basePath: string; params: ListingParams };

/** Sort options as plain links, so they work without JavaScript. */
export function SortLinks({ basePath, params }: Base) {
  return (
    <nav aria-label="Sort products" className="-mx-4 overflow-x-auto px-4">
      <ul className="flex gap-2 whitespace-nowrap">
        {(Object.entries(SORTS) as [Sort, string][]).map(([sort, label]) => {
          const current = params.sort === sort;
          return (
            <li key={sort}>
              <Link
                href={`${basePath}${listingQuery({ q: params.q, sort })}`}
                aria-current={current ? "true" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium no-underline ${
                  current
                    ? "border-brand-green bg-brand-green text-white"
                    : "border-neutral-300 bg-white text-ink hover:border-brand-green"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Pagination({ basePath, params, total }: Base & { total: number }) {
  const pages = pageCount(total);
  if (pages <= 1) return null;
  const { page } = params;
  const href = (p: number) => `${basePath}${listingQuery({ ...params, page: p })}`;
  const linkClass =
    "inline-flex min-h-11 min-w-24 items-center justify-center rounded-lg border border-brand-green px-4 font-semibold text-brand-green no-underline hover:bg-brand-green hover:text-white";

  return (
    <nav aria-label="Pages" className="flex items-center justify-between gap-3 pt-8">
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" className={linkClass}>
          ← Previous
        </Link>
      ) : (
        <span className="min-w-24" />
      )}
      <p className="text-sm text-neutral-700">
        Page {page} of {pages}
      </p>
      {page < pages ? (
        <Link href={href(page + 1)} rel="next" className={linkClass}>
          Next →
        </Link>
      ) : (
        <span className="min-w-24" />
      )}
    </nav>
  );
}

export type Crumb = { name: string; href: string };

/** Breadcrumb trail. The last crumb is the current page and is not a link. */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className="text-neutral-700">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link href={crumb.href} className="inline-flex min-h-11 items-center underline-offset-2 hover:underline">
                    {crumb.name}
                  </Link>
                  <span aria-hidden="true" className="text-neutral-500">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
