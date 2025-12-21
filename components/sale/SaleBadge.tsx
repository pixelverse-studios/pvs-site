'use client';

import { currentSale, isSaleActive, isPackageOnSale } from '@/data/sales-config';

type BadgeVariant = 'sale' | 'gold' | 'primary';

interface SaleBadgeProps {
  packageId?: string;
  text?: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  sale: 'bg-gradient-to-r from-[var(--pv-sale)] to-[#ff6b5b] shadow-[0_4px_14px_-4px_var(--pv-sale-glow)]',
  gold: 'bg-gradient-to-r from-[var(--pv-gold-dark)] via-[var(--pv-gold)] to-[var(--pv-gold-dark)] shadow-[0_4px_14px_-4px_var(--pv-gold-glow)]',
  primary: 'bg-gradient-to-r from-[var(--pv-primary)] to-[var(--pv-primary-2)] shadow-[0_4px_14px_-4px_rgba(63,0,233,0.5)]',
};

export function SaleBadge({
  packageId,
  text,
  variant,
  className = '',
}: SaleBadgeProps) {
  // If packageId is provided, check if sale applies to this package
  if (packageId && !isPackageOnSale(currentSale, packageId)) {
    return null;
  }

  // If no active sale, don't render
  if (!isSaleActive(currentSale)) {
    return null;
  }

  const badgeText = text || currentSale?.badgeText || 'SALE';
  const badgeVariant = variant || (currentSale?.theme as BadgeVariant) || 'sale';

  return (
    <div
      className={`
        absolute -right-1 top-5
        rounded-l-full rounded-r-sm
        px-4 py-1.5
        text-white
        font-heading text-xs font-bold uppercase tracking-wider
        ${variantStyles[badgeVariant]}
        transition-all duration-200
        group-hover:translate-x-[-2px] group-hover:shadow-[0_6px_20px_-4px_var(--pv-sale-glow)]
        ${className}
      `}
      aria-label={`${badgeText} offer`}
    >
      {badgeText}
    </div>
  );
}

interface SaleBadgeWrapperProps {
  packageId: string;
  children: React.ReactNode;
  className?: string;
}

export function SaleBadgeWrapper({
  packageId,
  children,
  className = '',
}: SaleBadgeWrapperProps) {
  return (
    <div className={`group relative overflow-visible ${className}`}>
      {children}
      <SaleBadge packageId={packageId} />
    </div>
  );
}
