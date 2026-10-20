import Form from "next/form";

type Props = {
  defaultValue?: string;
  /** Unique per page, since the header and the search page both have a search box. */
  id: string;
};

/** GET form to /search?q=…; works without JavaScript. */
export function SearchForm({ defaultValue = "", id }: Props) {
  return (
    <Form action="/search" role="search" className="flex w-full">
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <input
        id={id}
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Search blenders, kettles, stools…"
        maxLength={100}
        autoComplete="off"
        enterKeyHint="search"
        className="min-h-11 w-full min-w-0 rounded-l-lg border border-r-0 border-neutral-300 bg-white px-3 text-base text-ink placeholder:text-neutral-500"
      />
      <button
        type="submit"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-r-lg bg-brand-orange px-3 text-base font-bold text-white hover:bg-brand-orange-dark"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="sr-only">Search</span>
      </button>
    </Form>
  );
}
