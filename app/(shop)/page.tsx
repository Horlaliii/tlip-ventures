export default function HomePage() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-5 px-4 py-16 text-center">
      <p className="rounded-full bg-brand-gold/20 px-3 py-1 text-sm font-semibold text-ink">
        Home &amp; kitchen goods in Ghana
      </p>
      <h1 className="font-heading text-4xl font-bold text-brand-green sm:text-5xl">Coming soon</h1>
      <p className="max-w-md text-base leading-relaxed">
        Blenders, kettles, storage, laundry and more. Browse online and order straight on WhatsApp.
      </p>
      <span className="inline-flex min-h-11 items-center rounded-lg bg-brand-orange px-5 text-base font-bold text-white">
        Opening soon
      </span>
    </section>
  );
}
