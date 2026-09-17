import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
const token = vi.hoisted(() => vi.fn());
vi.mock('@/lib/api/feedback-server', () => ({ feedbackAccessToken: token }));
vi.mock('@/lib/api-config', () => ({ getApiBaseUrl: () => 'https://upstream.test' }));
import { GET, PATCH } from './route';
const context = (path: string[] = []) => ({ params: Promise.resolve({ path }) });
beforeEach(() => token.mockResolvedValue('verified-token'));
afterEach(() => vi.restoreAllMocks());
describe('feedback proxy', () => {
  it('forwards verified bearer and filters, with no-store in both directions', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"items":[]}'));
    const response = await GET(
      new NextRequest('https://dashboard.test/api/domani/feedback?search=test'),
      context(),
    );
    expect(String(fetchMock.mock.calls[0][0])).toBe(
      'https://upstream.test/api/domani/feedback?search=test',
    );
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      cache: 'no-store',
      headers: { Authorization: 'Bearer verified-token' },
    });
    expect(response.headers.get('cache-control')).toBe('no-store');
  });
  it('blocks anonymous reads without calling upstream', async () => {
    token.mockResolvedValue(null);
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    const response = await GET(
      new NextRequest('https://dashboard.test/api/domani/feedback'),
      context(),
    );
    expect(response.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('rejects cross-origin mutations and invalid paths', async () => {
    const request = new NextRequest(
      'https://dashboard.test/api/domani/feedback/beta_feedback/id/status',
      {
        method: 'PATCH',
        headers: { origin: 'https://other.test', 'content-type': 'application/json' },
        body: '{"status":"new"}',
      },
    );
    expect((await PATCH(request, context(['beta_feedback', 'id', 'status']))).status).toBe(403);
    expect(
      (
        await GET(
          new NextRequest('https://dashboard.test/api/domani/feedback'),
          context(['..', 'users']),
        )
      ).status,
    ).toBe(404);
  });
  it('preserves upstream access denial without exposing its body', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('private details', { status: 403 }),
    );
    const response = await GET(
      new NextRequest('https://dashboard.test/api/domani/feedback'),
      context(),
    );
    expect(response.status).toBe(403);
    expect(await response.text()).not.toContain('private details');
  });
  it('forwards a valid same-origin status mutation', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}'));
    const response = await PATCH(
      new NextRequest('https://dashboard.test/api/domani/feedback/beta_feedback/id/status', {
        method: 'PATCH',
        headers: { origin: 'https://dashboard.test', 'content-type': 'application/json' },
        body: '{"status":"reviewed"}',
      }),
      context(['beta_feedback', 'id', 'status']),
    );
    expect(response.status).toBe(200);
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      method: 'PATCH',
      body: '{"status":"reviewed"}',
    });
  });
  it.each([
    ['invalid JSON', '{', {}, 400],
    ['invalid status', '{"status":"unknown"}', {}, 400],
    ['extra fields', '{"status":"new","source":"support_request"}', {}, 400],
    ['declared oversized body', '{"status":"new"}', { 'content-length': '8193' }, 413],
    [
      'actual UTF-8 oversized body',
      JSON.stringify({ status: 'new', padding: '界'.repeat(3000) }),
      {},
      413,
    ],
  ])('rejects %s without upstream writes', async (_, body, extraHeaders, status) => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    const response = await PATCH(
      new NextRequest('https://dashboard.test/api/domani/feedback/beta_feedback/id/status', {
        method: 'PATCH',
        headers: {
          origin: 'https://dashboard.test',
          'content-type': 'application/json',
          ...extraHeaders,
        },
        body,
      }),
      context(['beta_feedback', 'id', 'status']),
    );
    expect(response.status).toBe(status);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
