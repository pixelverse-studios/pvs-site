/**
 * Configuration for analytics and tracking exclusions.
 * Routes listed here will not have tracking scripts loaded or events fired.
 */

export const TRACKING_EXCLUDED_ROUTE_PREFIXES = ['/dashboard'] as const;

/**
 * Checks if a given pathname should be excluded from tracking.
 * Returns true if the pathname starts with any excluded prefix.
 */
export function isTrackingExcludedRoute(pathname: string): boolean {
  return TRACKING_EXCLUDED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
