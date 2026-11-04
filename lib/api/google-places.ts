import { publicContact, unratedBusinessBadge } from '@/data/public-contact';
import { sharedMetadata } from '@/lib/metadata';

const BUSINESS_QUERY = `${sharedMetadata.siteName} ${publicContact.base}`;
const BUSINESS_HOST = new URL(sharedMetadata.siteUrl).hostname.replace(/^www\./, '');

interface PlacesResponse {
  rating?: number;
  userRatingCount?: number;
}

interface SearchResult {
  id?: string;
  websiteUri?: string;
}

export interface GoogleRatingData {
  rating: number;
  reviewCount: number;
}

function matchesBusinessWebsite(website: unknown): boolean {
  if (typeof website !== 'string') return false;
  try {
    const url = new URL(website);
    return (
      ['https:', 'http:'].includes(url.protocol) &&
      url.hostname.replace(/^www\./, '') === BUSINESS_HOST
    );
  } catch {
    return false;
  }
}

/**
 * Resolves the current Place ID dynamically by searching for the business by
 * name and public base town, then confirming its website. Search order is not
 * an identity check, and the private service-area address is not needed.
 *
 * Result is cached for 24 hours via Next.js fetch cache (same as rating data).
 */
async function resolvePlaceId(): Promise<string | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.websiteUri',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ textQuery: BUSINESS_QUERY }),
      next: { revalidate: 86400 },
      signal: controller.signal,
    });

    if (!res.ok) return null;
    const data = await res.json();
    const places: SearchResult[] = Array.isArray(data?.places) ? data.places : [];
    const matches = places.filter(
      (place) =>
        place &&
        typeof place.id === 'string' &&
        place.id.trim().length > 0 &&
        matchesBusinessWebsite(place.websiteUri),
    );
    // Multiple matching branches are ambiguous: do not borrow a rating.
    return matches.length === 1 ? matches[0].id!.trim() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchPlacesData(): Promise<PlacesResponse | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!apiKey) return null;

  const placeId = await resolvePlaceId();
  if (!placeId) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'rating,userRatingCount',
        },
        next: { revalidate: 86400 },
        signal: controller.signal,
      },
    );

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function isValidPlacesResponse(data: PlacesResponse | null): data is Required<PlacesResponse> {
  return (
    data !== null &&
    typeof data.rating === 'number' &&
    Number.isFinite(data.rating) &&
    data.rating >= 1 &&
    data.rating <= 5 &&
    typeof data.userRatingCount === 'number' &&
    Number.isInteger(data.userRatingCount) &&
    data.userRatingCount > 0
  );
}

export async function getGoogleRatingBadge(): Promise<string> {
  const data = await fetchPlacesData();
  if (!isValidPlacesResponse(data)) return unratedBusinessBadge;
  return `⭐ ${data.rating.toFixed(1)} on Google • ${data.userRatingCount} Reviews`;
}

export async function getGoogleRatingData(): Promise<GoogleRatingData | null> {
  const data = await fetchPlacesData();
  if (!isValidPlacesResponse(data)) return null;
  return { rating: data.rating, reviewCount: data.userRatingCount };
}
