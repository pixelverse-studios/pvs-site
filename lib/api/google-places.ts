const PLACE_ID = 'ChIJ0yATFP2_hAURJJ-CH55gpKE';
const FALLBACK_BADGE = '⭐ 5.0 on Google • 5-Star Rated';

interface PlacesResponse {
  rating?: number;
  userRatingCount?: number;
}

export interface GoogleRatingData {
  rating: number;
  reviewCount: number;
}

const FALLBACK_RATING_DATA: GoogleRatingData = { rating: 5.0, reviewCount: 0 };

async function fetchPlacesData(): Promise<PlacesResponse | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=rating,userRatingCount`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'rating,userRatingCount',
        },
        next: { revalidate: 86400 },
      },
    );

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getGoogleRatingBadge(): Promise<string> {
  const data = await fetchPlacesData();
  if (!data?.rating || !data?.userRatingCount) return FALLBACK_BADGE;
  return `⭐ ${data.rating.toFixed(1)} on Google • ${data.userRatingCount} Reviews`;
}

export async function getGoogleRatingData(): Promise<GoogleRatingData> {
  const data = await fetchPlacesData();
  if (!data?.rating || !data?.userRatingCount) return FALLBACK_RATING_DATA;
  return { rating: data.rating, reviewCount: data.userRatingCount };
}
