export const websitePackagePrices = {
  starter: 1000,
  smallBusiness: 2300,
  customGrowth: 4350,
} as const;

export const carePlanMonthlyPrices = {
  care: 49,
  carePlus: 69,
  priority: 99,
} as const;

export const seoPackageMonthlyPrices = {
  oneLocation: 275,
  threeLocations: 550,
  fiveLocations: 875,
} as const;

export const seoStrategySetupPrice = 800;

export interface PricingPackage {
  name: string;
  shortName: string;
  featured?: boolean;
  carePlan?: string;
  description: string;
  highlights: string[];
  monthlyPrice: number | null;
  setupPrice?: number | null;
  note?: string;
}

export const packageStartingPrices = {
  web: websitePackagePrices.starter,
  seoMonthly: seoPackageMonthlyPrices.oneLocation,
} as const;

// Quarterly prepay is 5% off; annual prepay bills 10 months for 12 (2 months free).
export const packageBillingOptions = [
  {
    id: 'monthly',
    label: 'Monthly',
    months: 1,
    billedMonths: 1,
    discount: 0,
    badge: null,
    suffix: '/mo',
  },
  {
    id: 'quarterly',
    label: 'Quarterly',
    months: 3,
    billedMonths: 3,
    discount: 0.05,
    badge: '5% off',
    suffix: '/qtr',
  },
  {
    id: 'annual',
    label: 'Annual',
    months: 12,
    billedMonths: 10,
    discount: 0,
    badge: '2 months free',
    suffix: '/yr',
  },
] as const;

export type PackageBillingOption = (typeof packageBillingOptions)[number];
export type PackageBillingOptionId = PackageBillingOption['id'];

export function getBillingTotal(monthlyPrice: number, billing: PackageBillingOption) {
  return Math.round(monthlyPrice * billing.billedMonths * (1 - billing.discount) * 100) / 100;
}

// Whole dollars stay whole; prepay totals with cents show both digits ($1,567.50).
export function formatPackagePrice(amount: number) {
  const fractionDigits = Number.isInteger(amount) ? 0 : 2;
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

export function formatStartingPrice(price: number) {
  return formatPackagePrice(price);
}

export function formatMonthlyStartingPrice(price: number) {
  return `${formatStartingPrice(price)}/mo`;
}
