import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
const session = vi.hoisted(() => vi.fn());
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ auth: { getSession: session } }),
}));
vi.mock('@/lib/api-config', () => ({ getApiBaseUrl: () => 'https://api.test' }));
import { getDomaniUsers, getDomaniUserStats } from './domani-users';
const validResponse = {
  items: [],
  total: 0,
  limit: 50,
  offset: 0,
  stats: {
    total: 0,
    non_deleted: 0,
    deleted: 0,
    active_30d: 0,
    activity_unknown: 0,
    activity_window_days: 30,
  },
  data_as_of: '2026-09-20T00:00:00Z',
};
afterEach(() => vi.restoreAllMocks());
beforeEach(() => session.mockResolvedValue({ data: { session: { access_token: 'staff-token' } } }));
describe('staff user API', () => {
  it.each([
    { items: [], total: 1, limit: 50, offset: 0 },
    { ...validResponse, stats: null },
    { ...validResponse, stats: { active_30d: 0 } },
  ])('rejects incompatible list responses before they reach rendering', async (payload) => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify(payload)));
    await expect(getDomaniUsers()).rejects.toThrow('incompatible Users response');
  });
  it('rejects incompatible overview stats without inventing zero counts', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}'));
    await expect(getDomaniUserStats()).rejects.toThrow('incompatible Users response');
  });
  it('passes all global query options and an abort signal directly to the server', async () => {
    const fetch = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify(validResponse)));
    const abort = new AbortController();
    await getDomaniUsers(
      {
        search: 'a+b & c',
        cohort: 'general',
        provider: 'apple',
        offset: 0,
        limit: 100,
        include_deleted: false,
        sort_by: 'last_sign_in_at',
        sort_order: 'asc',
      },
      abort.signal,
    );
    const [url, options] = fetch.mock.calls[0];
    expect(new URL(String(url)).searchParams.get('search')).toBe('a+b & c');
    expect(new URL(String(url)).searchParams.get('offset')).toBe('0');
    expect(new Headers(options?.headers).get('Authorization')).toBe('Bearer staff-token');
    expect(options?.signal?.aborted).toBe(false);
    abort.abort();
    expect(options?.signal?.aborted).toBe(true);
    expect(options?.cache).toBe('no-store');
  });
  it('does not fetch after an expired session or cancellation during session retrieval', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch');
    session.mockResolvedValueOnce({ data: { session: null } });
    await expect(getDomaniUsers()).rejects.toMatchObject({ status: 401 });
    const c = new AbortController();
    session.mockImplementationOnce(async () => {
      c.abort();
      return { data: { session: { access_token: 'token' } } };
    });
    await expect(getDomaniUsers({}, c.signal)).rejects.toThrow();
    expect(fetch).not.toHaveBeenCalled();
  });
  it.each([401, 403, 503])('preserves actionable error status %s', async (status) => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('private details', { status }));
    await expect(getDomaniUsers()).rejects.toMatchObject({ status });
  });
});
