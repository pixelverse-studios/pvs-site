/**
 * Dynamic API configuration that automatically selects the correct API URL
 * based on the current environment (development vs production)
 */

// Production API URL - hardcoded since we can't access server env vars on client
const PRODUCTION_API_URL = 'https://pvs-server-62hx7.ondigitalocean.app';

// Development API URL
const DEVELOPMENT_API_URL = 'http://localhost:5001';

/**
 * Get the appropriate API base URL for the current environment
 * - In development: uses localhost:5001
 * - In production: uses the PVS server URL
 *
 * Works in both server and client components
 */
export function getApiBaseUrl(): string {
  // In browser context, check window.location.hostname
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1';
    return isLocalhost ? DEVELOPMENT_API_URL : PRODUCTION_API_URL;
  }

  // In server context, check NODE_ENV or use PVS_API_URL if available
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Try to use PVS_API_URL from server environment if available
  if (!isDevelopment && process.env.PVS_API_URL) {
    return process.env.PVS_API_URL;
  }

  return isDevelopment ? DEVELOPMENT_API_URL : PRODUCTION_API_URL;
}

/**
 * Pre-configured API base URL for direct import
 * Note: For client components, this will be evaluated at runtime
 */
export const API_BASE_URL = getApiBaseUrl();