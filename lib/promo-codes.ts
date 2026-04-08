/**
 * Hardcoded promo code registry.
 *
 * Used to validate codes that arrive via `?promo=` URL params and to
 * surface a friendly confirmation label when a known code auto-populates
 * the contact form. Manually-typed codes are NOT validated against this
 * list — the server trusts whatever the form submits, and we honor codes
 * manually for now. This list only controls which codes auto-populate
 * from a URL.
 *
 * When PVS launches a real promo dashboard / DB-backed promo system,
 * this file becomes the migration source.
 */

export type PromoCode = {
  /** Canonical uppercase code (e.g. 'NJCC2026'). Stored verbatim in submissions. */
  code: string;
  /** Short user-facing label shown when the code auto-populates the form. */
  label: string;
  /** Where the code is being shared (analytics/attribution only). */
  source?: string;
  /** Set false to disable the code without removing it. */
  active: boolean;
  /** Optional ISO date — codes past this date will not auto-populate. */
  expiresAt?: string;
};

export const PROMO_CODES: readonly PromoCode[] = [
  {
    code: 'NJCC2026',
    label: 'NJ Chamber of Commerce 2026 deal',
    source: 'chamber-of-commerce',
    active: true,
  },
];

/**
 * Look up a promo code by raw input. Case-insensitive. Returns the
 * canonical record only if the code exists, is active, and has not
 * expired. Returns null otherwise.
 */
export function findPromoCode(raw: string | null | undefined): PromoCode | null {
  if (!raw) return null;
  const normalized = raw.trim().toUpperCase();
  if (!normalized) return null;

  const match = PROMO_CODES.find((p) => p.code === normalized);
  if (!match) return null;
  if (!match.active) return null;
  if (match.expiresAt && Date.parse(match.expiresAt) < Date.now()) return null;

  return match;
}

/** Convenience boolean check. */
export function isValidPromoCode(raw: string | null | undefined): boolean {
  return findPromoCode(raw) !== null;
}
