import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center px-6 py-24 text-center">
      <div className="space-y-6 max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-2 text-sm text-[var(--pv-text-muted)] shadow-sm">
          PixelVerse Studios
        </span>
        <h1 className="font-heading text-4xl font-semibold md:text-5xl">
          Design system foundations built with Next.js and Tailwind CSS
        </h1>
        <p className="text-lg text-[var(--pv-text-muted)]">
          Explore the components, tokens, and theming primitives crafted for the PixelVerse platform.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-pv bg-[var(--pv-gradient)] px-6 py-3 text-base font-medium text-white shadow-pv transition-colors-opacity-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-bg)] focus-visible:ring-[var(--pv-ring)]"
            href="/styleguide"
          >
            View style guide
          </Link>
        </div>
      </div>
    </main>
  );
}
