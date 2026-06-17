'use client';

import { useMemo, useState } from 'react';

import { TrackedLink } from '@/components/analytics/tracked-link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import {
  seoBillingOptions,
  type SeoBillingOption,
  type SeoBillingOptionId,
  type SeoPricingPackage,
} from '@/data/seo-content';
import { cn } from '@/lib/utils';

export interface SeoPackagePricingSectionProps {
  eyebrow: string;
  title: string;
  intro: string;
  packages: SeoPricingPackage[];
}

function formatCurrency(amount: number) {
  return `$${Math.floor(amount).toLocaleString('en-US')}`;
}

function getPackageHref(packageName: SeoPricingPackage['name']) {
  const details =
    packageName === 'Custom'
      ? "I'm interested in a custom SEO package."
      : `I'm interested in the ${packageName} SEO package.`;

  return `/contact/details?interest=seo&details=${encodeURIComponent(details)}`;
}

function getPriceDetails(pkg: SeoPricingPackage, billing: SeoBillingOption) {
  if (pkg.monthlyPrice === null) {
    return {
      price: 'Custom',
      suffix: '',
      originalPrice: null,
      discountLabel: pkg.note ?? 'Scoped after review',
    };
  }

  const baseTotal = pkg.monthlyPrice * billing.months;
  const total = Math.floor(baseTotal * (1 - billing.discount));

  return {
    price: formatCurrency(total),
    suffix: billing.suffix,
    originalPrice: billing.discount > 0 ? formatCurrency(baseTotal) : null,
    discountLabel:
      billing.discount > 0
        ? `${Math.round(billing.discount * 100)}% off`
        : 'Full monthly flexibility',
  };
}

export function SeoPackagePricingSection({
  eyebrow,
  title,
  intro,
  packages,
}: SeoPackagePricingSectionProps) {
  const [billingId, setBillingId] = useState<SeoBillingOptionId>('monthly');

  const selectedBilling = useMemo(
    () => seoBillingOptions.find((option) => option.id === billingId) ?? seoBillingOptions[0],
    [billingId],
  );

  return (
    <section
      aria-labelledby="seo-pricing-heading"
      className="border-y border-[var(--pv-border)] bg-[var(--pv-surface)] py-16 md:py-24"
    >
      <Container>
        <div className="space-y-10">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--pv-text-muted)]">
                {eyebrow}
              </p>
              <h2
                id="seo-pricing-heading"
                className="mx-auto max-w-2xl font-heading text-3xl font-semibold leading-tight text-[var(--pv-text)] md:text-4xl"
              >
                {title}
              </h2>
              <p className="text-base leading-7 text-[var(--pv-text-muted)] md:text-lg">
                {intro}
              </p>
            </div>

          <div className="flex justify-center">
            <div
              className="inline-grid w-full max-w-md grid-cols-3 rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-1 shadow-[0_18px_40px_-34px_rgba(17,17,17,0.35)]"
              aria-label="SEO billing frequency"
            >
              {seoBillingOptions.map((option) => {
                const active = option.id === billingId;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setBillingId(option.id)}
                    className={cn(
                      'min-h-10 rounded-[calc(var(--pv-radius)-2px)] px-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98]',
                      active
                        ? 'bg-[var(--pv-primary)] text-white shadow-[0_10px_24px_-18px_rgba(63,0,233,0.8)]'
                        : 'text-[var(--pv-text-muted)] hover:bg-[var(--pv-surface)] hover:text-[var(--pv-text)]',
                    )}
                    aria-pressed={active}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {packages.map((pkg) => {
              const price = getPriceDetails(pkg, selectedBilling);
              const isAdvanced = pkg.name === 'Advanced';

              return (
                <article
                  key={pkg.name}
                  className={cn(
                    'group flex min-h-[30rem] flex-col rounded-pv-lg border bg-[var(--pv-bg)] p-6 transition-all duration-300 hover:-translate-y-1',
                    isAdvanced
                      ? 'border-[color-mix(in_srgb,var(--pv-primary)_34%,var(--pv-border))] shadow-[0_24px_60px_-46px_rgba(63,0,233,0.7)]'
                      : 'border-[var(--pv-border)] shadow-[0_18px_42px_-38px_rgba(17,17,17,0.28)]',
                  )}
                >
                  <div className="grid min-h-[8.75rem] grid-rows-[auto_1fr]">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-heading text-2xl font-semibold text-[var(--pv-text)]">
                        {pkg.name}
                      </h3>
                      {isAdvanced && (
                        <span className="shrink-0 rounded-full border border-[color-mix(in_srgb,var(--pv-primary)_20%,var(--pv-border))] bg-[color-mix(in_srgb,var(--pv-primary)_6%,transparent)] px-3 py-1 text-xs font-semibold text-[var(--pv-primary)]">
                          Most Popular
                        </span>
                      )}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-[var(--pv-text-muted)]">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="border-t border-[var(--pv-border)] pt-6">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="font-heading text-3xl font-semibold leading-none tracking-[-0.04em] text-[var(--pv-text)] sm:text-4xl xl:text-3xl">
                        {price.price}
                      </span>
                      {price.suffix && (
                        <span className="pb-1 text-sm font-medium text-[var(--pv-text-muted)]">
                          {price.suffix}
                        </span>
                      )}
                      {price.originalPrice && (
                        <span className="text-sm font-medium text-[var(--pv-text-muted)] line-through">
                          {price.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 min-h-6 text-xs">
                      <span className="rounded-full bg-[color-mix(in_srgb,var(--pv-primary)_7%,transparent)] px-2.5 py-1 font-medium text-[var(--pv-primary)]">
                        {price.discountLabel}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-3 text-sm leading-6 text-[var(--pv-text)]">
                    {pkg.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--pv-primary)]"
                          aria-hidden="true"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <Button
                      asChild
                      variant={isAdvanced ? 'cta' : 'ctaGhost'}
                      className="w-full"
                    >
                      <TrackedLink
                        href={getPackageHref(pkg.name)}
                        trackingKind="cta"
                        trackingLabel={`SEO package pricing: ${pkg.name}`}
                      >
                        Ask about {pkg.name}
                      </TrackedLink>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
