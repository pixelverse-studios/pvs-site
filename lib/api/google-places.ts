const PLACE_ID = 'ChIJP9TTk-nyGIgRJLhBiKpq0Nw';
const FALLBACK_BADGE = '⭐ 5.0 on Google • 5-Star Rated';

interface PlacesResponse {
  rating?: number;
  userRatingCount?: number;
}

export async function getGoogleRatingBadge(): Promise<string> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return FALLBACK_BADGE;

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

    if (!res.ok) return FALLBACK_BADGE;

    const data: PlacesResponse = await res.json();
    const { rating, userRatingCount } = data;

    if (!rating || !userRatingCount) return FALLBACK_BADGE;

    return `⭐ ${rating.toFixed(1)} on Google • ${userRatingCount} Reviews`;
  } catch {
    return FALLBACK_BADGE;
  }
}
