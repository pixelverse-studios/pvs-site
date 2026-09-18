export function DomaniPageLoading({ title }: { title: string }) {
  return (
    <section aria-busy="true" aria-label={title} className="space-y-5">
      <h2 className="font-heading text-2xl font-bold text-[var(--pv-text)]">{title}</h2>
      <div role="status" aria-live="polite" className="space-y-5">
        <span className="sr-only">Loading {title.toLowerCase()}…</span>
        <div
          aria-hidden="true"
          className="h-12 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] motion-safe:animate-pulse"
        />
        <div
          aria-hidden="true"
          className="h-72 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] motion-safe:animate-pulse"
        />
      </div>
    </section>
  );
}
