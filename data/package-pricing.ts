export const packageStartingPrices = {
  web: 750,
  seoMonthly: 200,
} as const;

export function formatStartingPrice(price: number) {
  return `$${price.toLocaleString('en-US')}`;
}

export function formatMonthlyStartingPrice(price: number) {
  return `${formatStartingPrice(price)}/mo`;
}
