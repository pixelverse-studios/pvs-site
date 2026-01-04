'use client';

import {
  currentSale,
  isSaleActive,
  isPackageOnSale,
  calculateDiscountedPrice,
  parseSetupPrice,
  parseMonthlyPrice,
} from '@/data/sales-config';

interface DiscountedPriceProps {
  packageId: string;
  priceString: string;
  showSavings?: boolean;
  className?: string;
}

export function DiscountedPrice({
  packageId,
  priceString,
  showSavings = true,
  className = '',
}: DiscountedPriceProps) {
  const isOnSale = isSaleActive(currentSale) && isPackageOnSale(currentSale, packageId);

  if (!isOnSale || !currentSale) {
    return <span className={className}>{priceString}</span>;
  }

  const originalPrice = parseSetupPrice(priceString);

  if (originalPrice === null) {
    return <span className={className}>{priceString}</span>;
  }

  const discountedPrice = calculateDiscountedPrice(originalPrice, currentSale);
  const setupSavings = originalPrice - discountedPrice;

  // Parse monthly price and calculate discount if applicable
  const originalMonthly = parseMonthlyPrice(priceString);
  const shouldDiscountMonthly =
    currentSale.discountMonthly &&
    currentSale.discountType === 'percentage' &&
    originalMonthly !== null;

  const discountedMonthly = shouldDiscountMonthly
    ? calculateDiscountedPrice(originalMonthly, currentSale)
    : null;

  const monthlyDuration = currentSale.monthlyDiscountDuration;
  const monthlySavingsPerMonth =
    shouldDiscountMonthly && discountedMonthly !== null ? originalMonthly - discountedMonthly : 0;

  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      {/* Original price with strikethrough */}
      <span className="text-sm font-medium text-[var(--pv-text-muted)] line-through decoration-1">
        ${originalPrice.toLocaleString()} setup
        {originalMonthly !== null && ` + $${originalMonthly}/mo`}
      </span>

      {/* Discounted price */}
      <span
        className="font-heading text-lg font-bold text-[var(--pv-text)]"
        style={{
          animation: 'priceReveal 0.3s ease-out',
        }}
      >
        ${Math.round(discountedPrice).toLocaleString()} setup
        {shouldDiscountMonthly && discountedMonthly !== null ? (
          <>
            {' '}
            + ${Math.round(discountedMonthly)}/mo
            {monthlyDuration && (
              <span className="text-sm font-medium text-[var(--pv-text-muted)]">
                {' '}
                for {monthlyDuration} mo
              </span>
            )}
          </>
        ) : originalMonthly !== null ? (
          ` + $${originalMonthly}/mo`
        ) : null}
      </span>

      {/* "Then" price after promotional period */}
      {shouldDiscountMonthly && monthlyDuration && originalMonthly !== null && (
        <span
          className="text-xs text-[var(--pv-text-muted)]"
          style={{
            animation: 'priceReveal 0.3s ease-out 0.05s both',
          }}
        >
          then ${originalMonthly}/mo
        </span>
      )}

      {/* Savings badge */}
      {showSavings && (setupSavings > 0 || monthlySavingsPerMonth > 0) && (
        <span
          className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-[var(--pv-sale)]"
          style={{
            animation: 'priceReveal 0.3s ease-out 0.1s both',
          }}
        >
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          Save ${Math.round(setupSavings).toLocaleString()}
          {monthlySavingsPerMonth > 0 && ` + $${Math.round(monthlySavingsPerMonth)}/mo`}
        </span>
      )}

      <style jsx>{`
        @keyframes priceReveal {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

interface InlineDiscountedPriceProps {
  packageId: string;
  priceString: string;
  className?: string;
}

export function InlineDiscountedPrice({
  packageId,
  priceString,
  className = '',
}: InlineDiscountedPriceProps) {
  const isOnSale = isSaleActive(currentSale) && isPackageOnSale(currentSale, packageId);

  if (!isOnSale || !currentSale) {
    return <span className={className}>{priceString}</span>;
  }

  const originalPrice = parseSetupPrice(priceString);

  if (originalPrice === null) {
    return <span className={className}>{priceString}</span>;
  }

  const discountedPrice = calculateDiscountedPrice(originalPrice, currentSale);

  // Parse monthly price and calculate discount if applicable
  const originalMonthly = parseMonthlyPrice(priceString);
  const shouldDiscountMonthly =
    currentSale.discountMonthly &&
    currentSale.discountType === 'percentage' &&
    originalMonthly !== null;

  const discountedMonthly = shouldDiscountMonthly
    ? calculateDiscountedPrice(originalMonthly, currentSale)
    : null;

  const monthlyDuration = currentSale.monthlyDiscountDuration;

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-2 ${className}`}>
      <span className="font-heading font-bold">
        ${Math.round(discountedPrice).toLocaleString()} setup
        {shouldDiscountMonthly && discountedMonthly !== null ? (
          <>
            {' '}
            + ${Math.round(discountedMonthly)}/mo
            {monthlyDuration && (
              <span className="text-sm font-normal text-[var(--pv-text-muted)]">
                {' '}
                for {monthlyDuration} mo
              </span>
            )}
          </>
        ) : originalMonthly !== null ? (
          ` + $${originalMonthly}/mo`
        ) : null}
      </span>
      <span className="text-sm text-[var(--pv-text-muted)] line-through">
        ${originalPrice.toLocaleString()}
        {originalMonthly !== null && ` + $${originalMonthly}/mo`}
      </span>
    </span>
  );
}
