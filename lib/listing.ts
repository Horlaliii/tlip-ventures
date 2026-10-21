import { z } from "zod";

export const SORTS = {
  newest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
} as const;

export type Sort = keyof typeof SORTS;

const first = (v: unknown) => (Array.isArray(v) ? v[0] : v);

// Bad or missing values fall back to defaults, so a mangled link still shows a page.
const listingParamsSchema = z.object({
  page: z.preprocess(first, z.coerce.number().int().min(1).max(10_000)).catch(1),
  sort: z.preprocess(first, z.enum(Object.keys(SORTS) as [Sort, ...Sort[]])).catch("newest"),
  q: z.preprocess(first, z.string().trim().max(100)).catch(""),
});

export type ListingParams = z.infer<typeof listingParamsSchema>;

/** Reads page, sort and search text from a page's searchParams. */
export function parseListingParams(searchParams: Record<string, string | string[] | undefined>): ListingParams {
  return listingParamsSchema.parse(searchParams);
}

/** Builds "?q=…&sort=…&page=…" for listing links, leaving out defaults. */
export function listingQuery(params: Partial<ListingParams>): string {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.sort && params.sort !== "newest") query.set("sort", params.sort);
  if (params.page && params.page > 1) query.set("page", String(params.page));
  const s = query.toString();
  return s ? `?${s}` : "";
}

/** Product and category slugs, as the database allows them. */
export const slugSchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(200);
