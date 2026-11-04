// @vitest-environment jsdom
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import sitemap from '@/app/sitemap';
import { DownloadSitemapButton } from './download-sitemap-button';

afterEach(() => vi.restoreAllMocks());

describe('SEO URL CSV download', () => {
  it('downloads the complete unique live sitemap inventory and releases the temporary URL', async () => {
    (globalThis as any).React = React;
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    const urls = sitemap().map((entry) => entry.url);
    let downloaded: Blob | undefined;
    const create = vi.fn((blob: Blob) => {
      downloaded = blob;
      return 'blob:fixture-sitemap';
    });
    const revoke = vi.fn();
    vi.stubGlobal('URL', Object.assign(URL, { createObjectURL: create, revokeObjectURL: revoke }));
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      expect(this.download).toBe('pixelverse-sitemap-urls.csv');
      expect(this.getAttribute('href')).toBe('blob:fixture-sitemap');
    });
    try {
      await act(async () => root.render(<DownloadSitemapButton urls={[...urls, urls[0]]} />));
      await act(async () => container.querySelector('button')!.click());
      const csv = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsText(downloaded!);
      });
      expect(csv.split('\n')).toEqual(['url', ...Array.from(new Set(urls))]);
      expect(csv).toContain('https://pixelversestudios.io/services/seo');
      expect(csv).toContain('https://pixelversestudios.io/portfolio/iffers-pictures');
      expect(csv).not.toMatch(/\/dashboard|\/styleguide|\/docs\/seo/);
      expect(click).toHaveBeenCalledOnce();
      expect(revoke).toHaveBeenCalledWith('blob:fixture-sitemap');
      expect(container.querySelector('a')).toBeNull();
    } finally {
      await act(async () => root.unmount());
      container.remove();
      vi.unstubAllGlobals();
    }
  });
});
