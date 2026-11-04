import { describe, expect, it } from 'vitest';
import robots from './robots';
import sitemap from './sitemap';

describe('public search discovery controls', () => {
  it('allows rendering assets while retaining private-path crawler exclusions', () => {
    const rule = robots().rules;
    if (Array.isArray(rule)) throw new Error('Review robots rule precedence');
    const blocked = rule.disallow as string[];
    for (const path of [
      '/_next/static/chunks/app.js',
      '/_next/static/css/app.css',
      '/_next/image?url=logo.png',
    ]) {
      expect(blocked.some((prefix) => path.startsWith(prefix))).toBe(false);
    }
    expect(blocked).toEqual(expect.arrayContaining(['/api/', '/dashboard/', '/login']));
  });

  it('keeps intended URL coverage without inventing content-update dates', () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    expect(urls).toContain('https://pixelversestudios.io/services/seo');
    expect(urls).toContain('https://pixelversestudios.io/areas/bergen-county/ridgewood');
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.some((url) => /\/dashboard|\/docs\/|\/styleguide/.test(url))).toBe(false);
    expect(entries.every((entry) => !('lastModified' in entry))).toBe(true);
  });
});
