export interface StartingPriceCueProps {
  label: string;
  price: string;
}

export function StartingPriceCue({ label, price }: StartingPriceCueProps) {
  return (
    <div
      className="inline-flex max-w-full items-center gap-3 rounded-pv border border-[var(--pv-border)] bg-[color-mix(in_srgb,var(--pv-bg)_78%,transparent)] px-4 py-3 text-[0.95rem] leading-none text-[var(--pv-text-muted)] shadow-[0_14px_32px_-28px_rgba(17,17,17,0.28)]"
      aria-label={`${label} ${price}`}
    >
      <span className="min-w-0">{label}</span>
      <strong className="shrink-0 font-heading text-[1.65rem] font-semibold leading-none tracking-[-0.04em] text-[var(--pv-primary)]">
        {price}
      </strong>
    </div>
  );
}
