export const packageStartingPrices = {
  web: 750,
  seoMonthly: 200,
} as const;

export const packageBillingOptions = [
  { id: 'monthly', label: 'Monthly', months: 1, discount: 0, suffix: '/mo' },
  { id: 'quarterly', label: 'Quarterly', months: 3, discount: 0.15, suffix: '/qtr' },
  { id: 'annual', label: 'Annual', months: 12, discount: 0.2, suffix: '/yr' },
] as const;

export type PackageBillingOption = (typeof packageBillingOptions)[number];
export type PackageBillingOptionId = PackageBillingOption['id'];

export function formatStartingPrice(price: number) {
  return `$${price.toLocaleString('en-US')}`;
}

export function formatMonthlyStartingPrice(price: number) {
  return `${formatStartingPrice(price)}/mo`;
}
