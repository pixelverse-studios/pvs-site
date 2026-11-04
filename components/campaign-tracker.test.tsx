// @vitest-environment jsdom
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const route = vi.hoisted(() => ({ pathname: '/', params: new URLSearchParams() }));
vi.mock('next/navigation', () => ({
  usePathname: () => route.pathname,
  useSearchParams: () => route.params,
}));
import { CampaignTracker } from './campaign-tracker';
import analytics from '@/lib/analytics';

let root: Root;
let container: HTMLDivElement;
const events = () => window.dataLayer as Array<Record<string, unknown>>;
beforeEach(() => {
  (globalThis as any).React = React;
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  route.pathname = '/';
  route.params = new URLSearchParams();
  window.history.replaceState({}, '', '/');
  window.sessionStorage.clear();
  window.dataLayer = [];
  window.sitebehaviourEventQueue = [];
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});
async function navigate(path: string, params = '') {
  window.history.replaceState({}, '', path + (params ? `?${params}` : ''));
  route.pathname = path;
  route.params = new URLSearchParams(params);
  await act(async () => root.render(<CampaignTracker />));
}

describe('public route tracking boundary', () => {
  it('enqueues one debug page event per public pathname, not query-only changes or render updates', async () => {
    await navigate('/services/seo');
    await navigate('/services/seo', 'interest=seo');
    await act(async () => root.render(<CampaignTracker />));
    await navigate('/contact/details');
    expect(
      events()
        .filter((event) => event.event === 'page_view')
        .map((event) => event.page_path),
    ).toEqual(['/services/seo', '/contact/details']);
    // Untagged acquisition persistence does not pretend to be a campaign event.
    expect(events().some((event) => event.event === 'campaign_landing')).toBe(false);
  });

  it('excludes direct and client-side dashboard views and all contact-intent helpers there', async () => {
    await navigate('/dashboard');
    analytics.trackPhoneClick('tel:+12015550100', '/dashboard');
    analytics.trackEmailClick('mailto:fixture@example.test', '/dashboard');
    expect(events()).toEqual([]);
    expect(window.sitebehaviourEventQueue).toEqual([]);
    await navigate('/services/seo');
    await navigate('/dashboard/domani');
    expect(events().filter((event) => event.event === 'page_view')).toHaveLength(1);
    expect(events()[0].page_path).toBe('/services/seo');
  });

  it('also rejects an excluded payload route before browser navigation has caught up', async () => {
    await navigate('/');
    window.dataLayer = [];
    analytics.trackPageView('/dashboard/domani');
    analytics.trackEvent('generate_lead', { page_path: '/dashboard' });
    expect(events()).toEqual([]);
  });
});
