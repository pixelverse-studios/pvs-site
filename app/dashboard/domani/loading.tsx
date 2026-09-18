export default function DomaniLoading() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading Domani content" className="space-y-5">
      <span className="sr-only">Loading…</span>
      <div
        aria-hidden="true"
        className="h-12 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] motion-safe:animate-pulse"
      />
      <div
        aria-hidden="true"
        className="h-72 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] motion-safe:animate-pulse"
      />
    </div>
  );
}
