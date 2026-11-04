import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { publicContact, unratedBusinessBadge } from '@/data/public-contact';
import { homepageHero } from '@/data/homepage';
import { getGoogleRatingBadge, getGoogleRatingData } from './google-places';

const confirmedPlace = { id: 'pixelverse-place', websiteUri: 'https://pixelversestudios.io/' };
const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

beforeEach(() => {
  vi.stubEnv('GOOGLE_PLACES_API_KEY', 'local-test-key');
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe('Google rating evidence', () => {
  it('uses neutral service copy without credentials, with no fabricated rating data', async () => {
    vi.stubEnv('GOOGLE_PLACES_API_KEY', '');
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('unexpected fetch'));
    expect(await getGoogleRatingBadge()).toBe(unratedBusinessBadge);
    expect(await getGoogleRatingData()).toBeNull();
    expect(homepageHero.badge).toBe(unratedBusinessBadge);
    expect(unratedBusinessBadge).not.toMatch(/\d|stars?|reviews?|Google/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('selects the confirmed website rather than the first search result', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        jsonResponse({
          places: [
            { id: 'other-agency', websiteUri: 'https://other-agency.example/' },
            { ...confirmedPlace, websiteUri: 'https://www.pixelversestudios.io/?ref=maps' },
          ],
        }),
      )
      .mockResolvedValueOnce(jsonResponse({ rating: 4.8, userRatingCount: 12 }));

    expect(await getGoogleRatingBadge()).toBe('⭐ 4.8 on Google • 12 Reviews');
    expect(fetchMock.mock.calls[1]?.[0]).toBe(
      'https://places.googleapis.com/v1/places/pixelverse-place',
    );
    const searchOptions = fetchMock.mock.calls[0]?.[1];
    expect(JSON.parse(String(searchOptions?.body))).toEqual({
      textQuery: `PixelVerse Studios ${publicContact.base}`,
    });
    expect(searchOptions?.headers).toMatchObject({
      'X-Goog-FieldMask': 'places.id,places.websiteUri',
    });
  });

  it.each([
    'https://pixelversestudios.io.other-agency.example/',
    'https://other-agency.example/pixelversestudios.io',
    'https://pixelversestudios.io@other-agency.example/',
    'javascript:pixelversestudios.io',
    'not a URL',
    undefined,
  ])('rejects a different or unverified business website: %s', async (websiteUri) => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(jsonResponse({ places: [{ id: 'unverified', websiteUri }] }));
    expect(await getGoogleRatingBadge()).toBe(unratedBusinessBadge);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not choose between multiple matching business branches', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        jsonResponse({ places: [confirmedPlace, { ...confirmedPlace, id: 'another-branch' }] }),
      );
    expect(await getGoogleRatingData()).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each([
    jsonResponse({ error: 'unavailable' }, 503),
    jsonResponse({ places: [] }),
    jsonResponse({ places: 'invalid' }),
    jsonResponse({ places: [null, {}, { id: 7, websiteUri: confirmedPlace.websiteUri }] }),
  ])('returns neutral copy when search cannot establish the business', async (response) => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(response);
    expect(await getGoogleRatingBadge()).toBe(unratedBusinessBadge);
  });

  it('returns neutral copy when the service throws', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network unavailable'));
    expect(await getGoogleRatingBadge()).toBe(unratedBusinessBadge);
  });

  it('returns neutral copy when the verified place detail request fails', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ places: [confirmedPlace] }))
      .mockResolvedValueOnce(jsonResponse({ error: 'unavailable' }, 503));
    expect(await getGoogleRatingBadge()).toBe(unratedBusinessBadge);
  });

  it.each([
    { rating: 5, userRatingCount: 0 },
    { rating: 6, userRatingCount: 10 },
    { rating: 0, userRatingCount: 10 },
    { rating: '5', userRatingCount: 10 },
    { rating: 4.8, userRatingCount: -1 },
    { rating: 4.8, userRatingCount: 1.5 },
    { userRatingCount: 10 },
    null,
  ])('does not turn invalid rating data into a review claim: %j', async (details) => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ places: [confirmedPlace] }))
      .mockResolvedValueOnce(jsonResponse(details));
    expect(await getGoogleRatingData()).toBeNull();
  });

  it('retains an available verified rating and review count for the About page', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ places: [confirmedPlace] }))
      .mockResolvedValueOnce(jsonResponse({ rating: 4.7, userRatingCount: 9 }));
    expect(await getGoogleRatingData()).toEqual({ rating: 4.7, reviewCount: 9 });
  });
});
