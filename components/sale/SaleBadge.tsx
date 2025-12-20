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
  sale: 'bg-gradient-to-r from-[var(--pv-sale)] to-[#ff6b35] shadow-[0_4px_12px_-2px_var(--pv-sale-glow)]',
  gold: 'bg-gradient-to-r from-[var(--pv-gold-dark)] via-[var(--pv-gold)] to-[var(--pv-gold-dark)] shadow-[0_4px_12px_-2px_var(--pv-gold-glow)] text-[#1a1400]',
  primary: 'bg-[var(--pv-gradient)] shadow-[0_4px_12px_-2px_rgba(63,0,233,0.4)]',
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
        absolute right-[-8px] top-4
        px-4 py-1.5 text-white
        font-heading text-xs font-bold uppercase tracking-wider
        ${variantStyles[badgeVariant]}
        transition-transform duration-200
        group-hover:translate-x-[-2px]
        ${className}
      `}
      style={{
        clipPath: 'polygon(12px 0, 100% 0, 100% 100%, 0 100%)',
      }}
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
