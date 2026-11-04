import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { captureAttributionFromUrl, getConversionAttribution } from './attribution';

let store: Map<string, string>;
let sessionStorage: { getItem: ReturnType<typeof vi.fn>; setItem: ReturnType<typeof vi.fn> };
const empty = () => new URLSearchParams();
const conversion = () =>
  getConversionAttribution('lead', '/contact/details?email=private@example.com');

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-04T12:00:00Z'));
  store = new Map();
  sessionStorage = {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => store.set(key, value)),
  };
  vi.stubGlobal('window', { sessionStorage, location: { origin: 'https://pixelversestudios.io' } });
  vi.stubGlobal('document', { referrer: 'https://www.google.com/search?q=private@example.com' });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('session acquisition context', () => {
  it('retains an untagged search entry without dispatching a campaign landing', () => {
    expect(
      captureAttributionFromUrl('/services/seo?email=private@example.com#form', empty()),
    ).toBeUndefined();
    captureAttributionFromUrl('/contact/details', empty());
    expect(conversion().first_touch).toMatchObject({
      landing_page: '/services/seo',
      referrer: 'https://www.google.com',
    });
    expect(conversion().latest_touch?.landing_page).toBe('/services/seo');
    expect(JSON.stringify(conversion())).not.toContain('private@example.com');
    expect(conversion().conversion.conversion_page).toBe('/contact/details');
  });

  it('retains only the origin of external referrals', () => {
    vi.stubGlobal('document', {
      referrer: 'https://partner.example/client/private-name?email=secret',
    });
    captureAttributionFromUrl('/services/seo', empty());
    expect(conversion().first_touch?.referrer).toBe('https://partner.example');
  });

  it.each(['', 'https://pixelversestudios.io/about', 'not a url', 'file:///private/name'])(
    'keeps unavailable/internal referrer unknown: %s',
    (referrer) => {
      vi.stubGlobal('document', { referrer });
      captureAttributionFromUrl('/services/seo', empty());
      expect(conversion().first_touch?.landing_page).toBe('/services/seo');
      expect(conversion().first_touch?.referrer).toBeUndefined();
      expect(conversion().first_touch?.utm_medium).toBeUndefined();
    },
  );

  it('preserves first touch while recording a later explicit campaign', () => {
    captureAttributionFromUrl('/services/seo', empty());
    expect(
      captureAttributionFromUrl(
        '/contact/details',
        new URLSearchParams('utm_source=chamber&utm_medium=referral'),
      ),
    ).toMatchObject({ utm_source: 'chamber' });
    expect(conversion().first_touch?.landing_page).toBe('/services/seo');
    expect(conversion().latest_touch?.utm_source).toBe('chamber');
  });

  it('expires old sessions without reusing a stale document referrer on SPA navigation', () => {
    captureAttributionFromUrl('/services/seo', empty());
    vi.advanceTimersByTime(31 * 60 * 1000);
    expect(conversion().first_touch).toBeUndefined();
    captureAttributionFromUrl('/contact/details', empty());
    expect(conversion().first_touch?.landing_page).toBe('/contact/details');
    expect(conversion().first_touch?.referrer).toBeUndefined();
  });

  it('refreshes the capture activity boundary on internal navigation', () => {
    captureAttributionFromUrl('/services/seo', empty());
    vi.advanceTimersByTime(20 * 60 * 1000);
    captureAttributionFromUrl('/about', empty());
    vi.advanceTimersByTime(20 * 60 * 1000);
    expect(conversion().first_touch?.landing_page).toBe('/services/seo');
  });

  it('does not capture dashboard visits', () => {
    captureAttributionFromUrl('/dashboard/clients', new URLSearchParams('utm_source=test'));
    expect(sessionStorage.setItem).not.toHaveBeenCalled();
  });

  it('keeps forms usable when storage throws and does not manufacture acquisition context', () => {
    sessionStorage.getItem.mockImplementation(() => {
      throw new Error('blocked');
    });
    sessionStorage.setItem.mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => captureAttributionFromUrl('/services/seo', empty())).not.toThrow();
    expect(conversion().first_touch).toBeUndefined();
    expect(conversion().conversion.conversion_type).toBe('lead');
  });
});
