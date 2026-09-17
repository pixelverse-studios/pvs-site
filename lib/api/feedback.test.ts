import { afterEach, describe, expect, it, vi } from 'vitest';
import { feedbackQuery, getFeedbackItems, updateFeedbackStatus } from './feedback';
import { feedbackKey } from '../types/feedback';
afterEach(() => vi.restoreAllMocks());

describe('feedback requests', () => {
  it('sends global filters and zero offset, preserving special search characters', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}'));
    const controller = new AbortController();
    await getFeedbackItems(
      {
        search: 'a+b@example.com & help',
        status: 'unknown',
        source: 'support_request',
        offset: 0,
        limit: 50,
      },
      controller.signal,
    );
    const [url, options] = fetchMock.mock.calls[0];
    const query = new URL(String(url), 'https://local.test').searchParams;
    expect(query.get('search')).toBe('a+b@example.com & help');
    expect(query.get('offset')).toBe('0');
    expect(query.get('source')).toBe('support_request');
    expect(options?.signal).toBe(controller.signal);
    expect(options?.cache).toBe('no-store');
  });
  it('uses source plus id for updates and record identity', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}'));
    await updateFeedbackStatus('same-id', 'support_request', 'reviewed');
    expect(fetchMock.mock.calls[0][0]).toBe('/api/domani/feedback/support_request/same-id/status');
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({ status: 'reviewed' });
    expect(feedbackKey({ id: 'same-id', source: 'support_request' })).not.toBe(
      feedbackKey({ id: 'same-id', source: 'beta_feedback' }),
    );
  });
  it('reports authorization failures instead of returning an empty inbox', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 403 }));
    await expect(getFeedbackItems()).rejects.toThrow('staff access');
  });
  it('omits absent filters', () =>
    expect(feedbackQuery({ search: '', category: undefined, offset: 0 })).toBe('offset=0'));
});
