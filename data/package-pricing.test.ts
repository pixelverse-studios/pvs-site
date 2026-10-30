import { describe, expect, it } from 'vitest';

import {
  carePlanMonthlyPrices,
  formatPackagePrice,
  getBillingTotal,
  packageBillingOptions,
  seoPackageMonthlyPrices,
} from './package-pricing';

const [monthly, quarterly, annual] = packageBillingOptions;

// Totals from the QuickBooks price sheet: 5% off quarterly, 10 months billed for annual.
const priceSheet: Array<[number, string, string]> = [
  [carePlanMonthlyPrices.care, '$139.65', '$490'],
  [carePlanMonthlyPrices.carePlus, '$196.65', '$690'],
  [carePlanMonthlyPrices.priority, '$282.15', '$990'],
  [seoPackageMonthlyPrices.oneLocation, '$783.75', '$2,750'],
  [seoPackageMonthlyPrices.threeLocations, '$1,567.50', '$5,500'],
  [seoPackageMonthlyPrices.fiveLocations, '$2,493.75', '$8,750'],
];

describe('package billing totals', () => {
  it.each(priceSheet)(
    '$%i/mo matches the price sheet',
    (monthlyPrice, quarterlyTotal, annualTotal) => {
      expect(getBillingTotal(monthlyPrice, monthly)).toBe(monthlyPrice);
      expect(formatPackagePrice(getBillingTotal(monthlyPrice, quarterly))).toBe(quarterlyTotal);
      expect(formatPackagePrice(getBillingTotal(monthlyPrice, annual))).toBe(annualTotal);
    },
  );
});

describe('formatPackagePrice', () => {
  it('omits cents for whole dollars and pads cents otherwise', () => {
    expect(formatPackagePrice(4350)).toBe('$4,350');
    expect(formatPackagePrice(1567.5)).toBe('$1,567.50');
  });
});
