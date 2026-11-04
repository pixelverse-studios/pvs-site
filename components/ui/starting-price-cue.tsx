export interface StartingPriceCueProps {
  label: string;
  price: string;
  note?: string;
}

export function StartingPriceCue({ label, price, note }: StartingPriceCueProps) {
  const cue = (
    <div
      className="inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-2 rounded-pv border border-[var(--pv-border)] bg-[color-mix(in_srgb,var(--pv-bg)_78%,transparent)] px-4 py-3 text-[0.95rem] leading-none text-[var(--pv-text-muted)] shadow-[0_14px_32px_-28px_rgba(17,17,17,0.28)]"
      aria-label={`${label} ${price}`}
    >
      <span className="min-w-0">{label}</span>
      <strong className="shrink-0 font-heading text-[1.65rem] font-semibold leading-none tracking-[-0.04em] text-[var(--pv-primary)]">
        {price}
      </strong>
    </div>
  );

  if (!note) return cue;

  return (
    <div className="inline-flex max-w-full flex-col items-start gap-2">
      {cue}
      <p className="text-sm leading-6 text-[var(--pv-text-muted)]">{note}</p>
    </div>
  );
}
