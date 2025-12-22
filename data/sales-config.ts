export type SaleType =
  | 'holiday'
  | 'flash'
  | 'seasonal'
  | 'launch'
  | 'anniversary'
  | 'referral';

export type DiscountType = 'percentage' | 'fixed' | 'bonus' | 'bundle';

export type SaleTheme = 'sale' | 'gold' | 'primary';

export interface Sale {
  id: string;
  name: string;
  type: SaleType;
  active: boolean;

  // Timing
  startDate: string;
  endDate: string;
  showCountdown: boolean;

  // Discount details
  discountType: DiscountType;
  discountValue: number;
  discountLabel: string;

  // Display
  headline: string;
  subtext?: string;
  ctaText: string;
  ctaLink: string;

  // Targeting
  showOnPages: string[];
  excludePages?: string[];

  // Styling
  theme: SaleTheme;

  // Badge configuration (for package cards)
  showBadge: boolean;
  badgeText?: string;
  applyToPackages?: string[];

  // Monthly discount configuration (percentage discounts only)
  discountMonthly?: boolean;
  monthlyDiscountDuration?: number; // Number of months (e.g., 3 = "first 3 months")
}

/**
 * Current active sale configuration
 * Set `active: false` to disable the sale entirely
 */
export const currentSale: Sale | null = {
  id: 'holiday-2025',
  name: 'Holiday Sale 2025',
  type: 'holiday',
  active: true,

  startDate: '2025-12-20T00:00:00-05:00',
  endDate: '2026-01-05T23:59:59-05:00',
  showCountdown: true,

  discountType: 'percentage',
  discountValue: 20,
  discountLabel: '20% OFF',

  headline: 'New Year, New Website',
  subtext: 'Start 2026 with a fresh digital presence',
  ctaText: 'Claim Offer',
  ctaLink: '/contact?ref=holiday2025',

  showOnPages: ['/', '/services', '/packages'],
  excludePages: ['/dashboard', '/blog'],

  theme: 'sale',

  showBadge: true,
  badgeText: '20% OFF',
  // applyToPackages omitted = applies to ALL packages

  discountMonthly: true,
  monthlyDiscountDuration: 3, // First 3 months
};

/**
 * Check if a sale is currently active based on dates and active flag
 */
export function isSaleActive(sale: Sale | null): boolean {
  if (!sale || !sale.active) return false;
  const now = new Date();
  const start = new Date(sale.startDate);
  const end = new Date(sale.endDate);
  return now >= start && now <= end;
}

/**
 * Check if the sale should be shown on the current page
 */
export function shouldShowOnPage(sale: Sale, pathname: string): boolean {
  if (sale.excludePages?.some((page) => pathname.startsWith(page))) {
    return false;
  }
  if (sale.showOnPages.includes('*')) return true;
  return sale.showOnPages.some(
    (page) => pathname === page || pathname.startsWith(page + '/'),
  );
}

/**
 * Check if a package has the sale applied
 */
export function isPackageOnSale(sale: Sale | null, packageId: string): boolean {
  if (!sale || !isSaleActive(sale)) return false;
  if (!sale.applyToPackages || sale.applyToPackages.length === 0) return true;
  return sale.applyToPackages.includes(packageId);
}

/**
 * Calculate discounted price
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  sale: Sale,
): number {
  if (sale.discountType === 'percentage') {
    return originalPrice * (1 - sale.discountValue / 100);
  }
  if (sale.discountType === 'fixed') {
    return Math.max(0, originalPrice - sale.discountValue);
  }
  return originalPrice;
}

/**
 * Parse price string to number (e.g., "$2,000 setup + $79/mo" -> 2000)
 */
export function parseSetupPrice(priceString: string): number | null {
  const match = priceString.match(/\$([0-9,]+)/);
  if (!match) return null;
  return parseInt(match[1].replace(/,/g, ''), 10);
}

/**
 * Parse monthly price from string (e.g., "$2,000 setup + $79/mo" -> 79)
 */
export function parseMonthlyPrice(priceString: string): number | null {
  const match = priceString.match(/\+\s*\$([0-9,]+)\/mo/);
  if (!match) return null;
  return parseInt(match[1].replace(/,/g, ''), 10);
}
