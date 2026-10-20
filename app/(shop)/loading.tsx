// Shown straight away while a shop page loads, so slow connections get feedback.
export default function ShopLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6" aria-busy="true">
      <p className="sr-only" role="status">
        Loading…
      </p>
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-neutral-200" />
      <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-5" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <li key={i} className="space-y-2">
            <div className="aspect-square animate-pulse rounded-lg bg-neutral-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-200" />
          </li>
        ))}
      </ul>
    </div>
  );
}
