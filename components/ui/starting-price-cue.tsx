export interface StartingPriceCueProps {
  label: string;
  price: string;
  note?: string;
  billingSuffix?: string;
  setup?: {
    label: string;
    price: string;
  };
}

export function StartingPriceCue({
  label,
  price,
  note,
  billingSuffix,
  setup,
}: StartingPriceCueProps) {
  if (setup) {
    return (
      <dl className="mx-auto grid w-full max-w-sm grid-cols-2 gap-x-5 border-t border-[var(--pv-border)] pt-4 text-left sm:gap-x-7">
        <div className="min-w-0">
          <dt className="min-h-9 text-xs font-medium leading-[1.125rem] text-[var(--pv-text-muted)] sm:min-h-0">
            {label}
          </dt>
          <dd className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
            <strong className="font-heading text-[1.875rem] font-semibold leading-none tracking-[-0.04em] text-[var(--pv-text)]">
              {price}
            </strong>
            {billingSuffix && (
              <span className="text-sm leading-none text-[var(--pv-text-muted)]">
                {billingSuffix}
              </span>
            )}
          </dd>
        </div>
        <div className="min-w-0 border-l border-[var(--pv-border)] pl-5 sm:pl-7">
          <dt className="min-h-9 text-xs font-medium leading-[1.125rem] text-[var(--pv-text-muted)] sm:min-h-0">
            {setup.label}
          </dt>
          <dd className="mt-1.5 font-heading text-2xl font-medium leading-none tracking-[-0.03em] text-[var(--pv-text-muted)]">
            {setup.price}
          </dd>
        </div>
      </dl>
    );
  }

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
