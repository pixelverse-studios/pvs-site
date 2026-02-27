const BUSINESS_QUERY = 'PixelVerse Studios 79 Edgewater Road Cliffside Park NJ';
const FALLBACK_BADGE = '⭐ 5.0 on Google • 5-Star Rated';

interface PlacesResponse {
  rating?: number;
  userRatingCount?: number;
}

interface SearchResult {
  id: string;
  rating?: number;
  userRatingCount?: number;
}

export interface GoogleRatingData {
  rating: number;
  reviewCount: number;
}

// reviewCount: 0 intentionally triggers auto-hide in AboutGoogleReviewsSection
const FALLBACK_RATING_DATA: GoogleRatingData = { rating: 5.0, reviewCount: 0 };

/**
 * Resolves the current Place ID dynamically by searching for the business by
 * name and address. This avoids stale hardcoded IDs — Google periodically
 * rotates Place IDs, especially after listing edits or re-verification.
 *
 * Result is cached for 24 hours via Next.js fetch cache (same as rating data).
 */
async function resolvePlaceId(apiKey: string): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.rating,places.userRatingCount',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ textQuery: BUSINESS_QUERY }),
      next: { revalidate: 86400 },
      signal: controller.signal,
    });

    if (!res.ok) return null;
    const data = await res.json();
    const place = data?.places?.[0] as SearchResult | undefined;
    return place?.id ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchPlacesData(): Promise<PlacesResponse | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  const placeId = await resolvePlaceId(apiKey);
  if (!placeId) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'rating,userRatingCount',
      },
      next: { revalidate: 86400 },
      signal: controller.signal,
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function isValidPlacesResponse(
  data: PlacesResponse | null,
): data is Required<PlacesResponse> {
  return (
    data !== null &&
    typeof data.rating === 'number' &&
    typeof data.userRatingCount === 'number' &&
    data.userRatingCount > 0
  );
}

export async function getGoogleRatingBadge(): Promise<string> {
  const data = await fetchPlacesData();
  if (!isValidPlacesResponse(data)) return FALLBACK_BADGE;
  return `⭐ ${data.rating.toFixed(1)} on Google • ${data.userRatingCount} Reviews`;
}

export async function getGoogleRatingData(): Promise<GoogleRatingData> {
  const data = await fetchPlacesData();
  if (!isValidPlacesResponse(data)) return FALLBACK_RATING_DATA;
  return { rating: data.rating, reviewCount: data.userRatingCount };
}
