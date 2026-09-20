import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const session = vi.hoisted(() => vi.fn());
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ auth: { getSession: session } }),
}));
vi.mock('@/lib/api-config', () => ({ getApiBaseUrl: () => 'https://api.test' }));
import { feedbackQuery, getFeedbackItems, updateFeedbackStatus } from './feedback';
import { feedbackKey } from '../types/feedback';
afterEach(() => vi.restoreAllMocks());
beforeEach(() =>
  session.mockResolvedValue({ data: { session: { access_token: 'current-token' } }, error: null }),
);

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
    expect(new URL(String(url)).origin).toBe('https://api.test');
    expect(new Headers(options?.headers).get('Authorization')).toBe('Bearer current-token');
    expect(options?.credentials).toBe('omit');
  });
  it('uses source plus id for updates and record identity', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}'));
    await updateFeedbackStatus('same-id', 'support_request', 'reviewed');
    expect(String(fetchMock.mock.calls[0][0])).toBe(
      'https://api.test/api/domani/feedback/support_request/same-id/status',
    );
    expect(new Headers(fetchMock.mock.calls[0][1]?.headers).get('Content-Type')).toBe(
      'application/json',
    );
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
  it('does not call the API without a session', async () => {
    session.mockResolvedValue({ data: { session: null }, error: null });
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    await expect(getFeedbackItems()).rejects.toThrow('session has expired');
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('uses the current token on each request rather than retaining an old token', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async () => new Response('{}'));
    await getFeedbackItems();
    session.mockResolvedValue({
      data: { session: { access_token: 'refreshed-token' } },
      error: null,
    });
    await getFeedbackItems();
    expect(new Headers(fetchMock.mock.calls[1][1]?.headers).get('Authorization')).toBe(
      'Bearer refreshed-token',
    );
  });
  it('does not dispatch an obsolete request cancelled during session retrieval', async () => {
    const controller = new AbortController();
    session.mockImplementation(async () => {
      controller.abort();
      return { data: { session: { access_token: 'current-token' } }, error: null };
    });
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    await expect(getFeedbackItems({}, controller.signal)).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('reply request safety', () => {
  it('reuses the caller request key with a direct authenticated POST', async () => {
    const { sendFeedbackReply } = await import('./feedback');
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async () => new Response('{}'));
    const body = { subject: 'Subject', text: 'Text', request_key: 'same-key' };
    await sendFeedbackReply('id', 'support_request', body);
    await sendFeedbackReply('id', 'support_request', body);
    expect(
      fetchMock.mock.calls.map(([, options]) => JSON.parse(String(options?.body)).request_key),
    ).toEqual(['same-key', 'same-key']);
    expect(String(fetchMock.mock.calls[0][0])).toContain('/support_request/id/messages');
    expect(new Headers(fetchMock.mock.calls[0][1]?.headers).get('Authorization')).toBe(
      'Bearer current-token',
    );
  });
  it('preserves safe sending-disabled guidance without exposing raw server errors', async () => {
    const { sendFeedbackReply, FeedbackRequestError } = await import('./feedback');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ error: { code: 'SENDING_DISABLED', message: 'private SQL' } }),
        { status: 503 },
      ),
    );
    await expect(
      sendFeedbackReply('id', 'beta_feedback', {
        subject: 'Subject',
        text: 'Text',
        request_key: 'key',
      }),
    ).rejects.toMatchObject({ status: 503, code: 'SENDING_DISABLED' });
  });
});

describe('operation-specific validation errors', () => {
  it('does not show send validation guidance for rejected history requests', async () => {
    const { getFeedbackMessages } = await import('./feedback');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ error: { code: 'INVALID_REQUEST', message: 'private detail' } }),
        { status: 400 },
      ),
    );
    await expect(getFeedbackMessages('id', 'beta_feedback', { latest: true })).rejects.toThrow(
      'This feedback request could not be processed. Refresh and try again.',
    );
  });
  it('retains composer validation guidance for reply submission', async () => {
    const { sendFeedbackReply } = await import('./feedback');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: { code: 'INVALID_REQUEST' } }), { status: 400 }),
    );
    await expect(
      sendFeedbackReply('id', 'beta_feedback', { subject: '', text: '', request_key: 'key' }),
    ).rejects.toThrow('Check the subject and message length before sending.');
  });
});
