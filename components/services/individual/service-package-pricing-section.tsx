'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { TrackedLink } from '@/components/analytics/tracked-link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import {
  packageBillingOptions,
  type PackageBillingOption,
  type PackageBillingOptionId,
} from '@/data/package-pricing';
import { cn } from '@/lib/utils';

export interface ServicePricingPackage {
  name: 'Basic' | 'Advanced' | 'Pro' | 'Custom';
  description: string;
  highlights: string[];
  monthlyPrice: number | null;
  setupPrice?: number | null;
  note?: string;
}

export interface ServicePackagePricingSectionProps {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  packages: ServicePricingPackage[];
  serviceLabel: string;
  interest: 'seo' | 'web-design';
  detailsLabel: string;
  recurringLabel?: string | null;
  setupLabel?: string;
}

function formatCurrency(amount: number) {
  return `$${Math.floor(amount).toLocaleString('en-US')}`;
}

function getPackageHref(
  packageName: ServicePricingPackage['name'],
  interest: ServicePackagePricingSectionProps['interest'],
  detailsLabel: string,
) {
  const details =
    packageName === 'Custom'
      ? `I'm interested in a custom ${detailsLabel} package.`
      : `I'm interested in the ${packageName} ${detailsLabel} package.`;

  return `/contact/details?interest=${interest}&details=${encodeURIComponent(details)}`;
}

function getRecurringPriceDetails(pkg: ServicePricingPackage, billing: PackageBillingOption) {
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
    discountLabel: null,
  };
}

function getSetupPriceDetails(pkg: ServicePricingPackage) {
  if (typeof pkg.setupPrice === 'undefined') {
    return null;
  }

  if (pkg.setupPrice === null) {
    return 'Custom';
  }

  return formatCurrency(pkg.setupPrice);
}

function getPriceSizeClasses(hasSetupPrice: boolean) {
  return hasSetupPrice
    ? 'text-[1.375rem] sm:text-[1.625rem] xl:text-[1.375rem]'
    : 'text-3xl sm:text-4xl xl:text-3xl';
}

export function ServicePackagePricingSection({
  id,
  eyebrow,
  title,
  intro,
  packages,
  serviceLabel,
  interest,
  detailsLabel,
  recurringLabel,
  setupLabel = 'Project starts at',
}: ServicePackagePricingSectionProps) {
  const [billingId, setBillingId] = useState<PackageBillingOptionId>('monthly');
  const [visualBillingId, setVisualBillingId] = useState<PackageBillingOptionId | null>('monthly');
  const visualTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedBilling = useMemo(
    () => packageBillingOptions.find((option) => option.id === billingId) ?? packageBillingOptions[0],
    [billingId],
  );
  const billingIndex = packageBillingOptions.findIndex((option) => option.id === billingId);

  useEffect(() => {
    return () => {
      if (visualTimerRef.current) {
        clearTimeout(visualTimerRef.current);
      }
    };
  }, []);

  function handleBillingChange(nextBillingId: PackageBillingOptionId) {
    setBillingId(nextBillingId);
    setVisualBillingId(null);

    if (visualTimerRef.current) {
      clearTimeout(visualTimerRef.current);
    }

    visualTimerRef.current = setTimeout(() => {
      setVisualBillingId(nextBillingId);
    }, 180);
  }

  return (
    <section
      aria-labelledby={id}
      className="border-y border-[var(--pv-border)] bg-[var(--pv-surface)] py-16 md:py-24"
    >
      <Container>
        <div className="space-y-10">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--pv-text-muted)]">
              {eyebrow}
            </p>
            <h2
              id={id}
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
              className="relative inline-grid w-full max-w-md grid-cols-3 rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-1 shadow-[0_18px_40px_-34px_rgba(17,17,17,0.35)]"
              aria-label={`${serviceLabel} billing frequency`}
            >
              <span
                className="pointer-events-none absolute bottom-1 left-1 top-1 w-[calc((100%-0.5rem)/3)] rounded-[calc(var(--pv-radius)-2px)] bg-[color-mix(in_srgb,var(--pv-primary)_18%,transparent)] opacity-70 blur-[1px] transition-transform duration-500 will-change-transform"
                style={{
                  transform: `translateX(${billingIndex * 100}%)`,
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute bottom-1 left-1 top-1 w-[calc((100%-0.5rem)/3)] rounded-[calc(var(--pv-radius)-2px)] bg-[var(--pv-primary)] shadow-[0_10px_24px_-18px_rgba(63,0,233,0.8)] transition-transform duration-300 will-change-transform"
                style={{
                  transform: `translateX(${billingIndex * 100}%)`,
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                aria-hidden="true"
              />
              {packageBillingOptions.map((option) => {
                const selected = option.id === billingId;
                const visuallyActive = option.id === visualBillingId;
                const discountPercent = Math.round(option.discount * 100);
                const showDiscount = selected && option.discount > 0;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleBillingChange(option.id)}
                    className={cn(
                      'relative z-[1] flex min-h-10 flex-col items-center justify-center rounded-[calc(var(--pv-radius)-2px)] px-2 text-sm font-semibold leading-tight outline-none transition-colors duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--pv-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-bg)] sm:px-3',
                      visuallyActive
                        ? 'text-white'
                        : 'text-[var(--pv-text-muted)] hover:text-[var(--pv-text)]',
                    )}
                    aria-pressed={selected}
                  >
                    {option.label}
                    {showDiscount && (
                      <span className="text-xs font-semibold leading-none">
                        ({discountPercent}% off)
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {packages.map((pkg) => {
              const recurringPrice = getRecurringPriceDetails(pkg, selectedBilling);
              const setupPrice = getSetupPriceDetails(pkg);
              const showCombinedPrice = setupPrice && pkg.monthlyPrice !== null;
              const isAdvanced = pkg.name === 'Advanced';

              return (
                <article
                  key={pkg.name}
                  className={cn(
                    'group flex min-h-[32rem] flex-col rounded-pv-lg border bg-[var(--pv-bg)] p-6 transition-all duration-300 hover:-translate-y-1',
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
                    {setupPrice && (
                      <div className="mb-5">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--pv-text-muted)]">
                          {setupLabel}
                        </p>
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <span className="font-heading text-3xl font-semibold leading-none tracking-[-0.04em] text-[var(--pv-text)] sm:text-4xl xl:text-3xl">
                            {setupPrice}
                          </span>
                          {showCombinedPrice && (
                            <>
                              <span className="self-center pb-1 text-lg font-semibold leading-none text-[var(--pv-text-muted)]">
                                +
                              </span>
                              <span
                                className={cn(
                                  'font-heading font-semibold leading-none tracking-[-0.04em] text-[var(--pv-text)]',
                                  getPriceSizeClasses(true),
                                )}
                              >
                                {recurringPrice.price}
                              </span>
                              {recurringPrice.suffix && (
                                <span className="relative shrink-0 pb-1 text-xs font-medium text-[var(--pv-text-muted)]">
                                  {recurringPrice.originalPrice && (
                                    <span className="absolute bottom-full left-0 mb-0.5 whitespace-nowrap text-xs font-medium leading-none text-[var(--pv-text-muted)] line-through">
                                      {recurringPrice.originalPrice}
                                    </span>
                                  )}
                                  {recurringPrice.suffix}
                                </span>
                              )}
                            </>
                          )}
                          {!showCombinedPrice && recurringPrice.discountLabel && (
                            <span className="rounded-full bg-[color-mix(in_srgb,var(--pv-primary)_7%,transparent)] px-2.5 py-1 text-xs font-medium text-[var(--pv-primary)]">
                              {recurringPrice.discountLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {!setupPrice && (
                      <div>
                        {recurringLabel && (
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--pv-text-muted)]">
                            {recurringLabel}
                          </p>
                        )}
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <span
                            className={cn(
                              'font-heading font-semibold leading-none tracking-[-0.04em] text-[var(--pv-text)]',
                              getPriceSizeClasses(false),
                            )}
                          >
                            {recurringPrice.price}
                          </span>
                          {recurringPrice.suffix && (
                            <span className="pb-1 text-sm font-medium text-[var(--pv-text-muted)]">
                              {recurringPrice.suffix}
                            </span>
                          )}
                          {recurringPrice.originalPrice && (
                            <span className="text-sm font-medium text-[var(--pv-text-muted)] line-through">
                              {recurringPrice.originalPrice}
                            </span>
                          )}
                        </div>
                        {recurringPrice.discountLabel && (
                          <div className="mt-3 min-h-6 text-xs">
                            <span className="rounded-full bg-[color-mix(in_srgb,var(--pv-primary)_7%,transparent)] px-2.5 py-1 font-medium text-[var(--pv-primary)]">
                              {recurringPrice.discountLabel}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
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
                        href={getPackageHref(pkg.name, interest, detailsLabel)}
                        trackingKind="cta"
                        trackingLabel={`${serviceLabel} package pricing: ${pkg.name}`}
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
