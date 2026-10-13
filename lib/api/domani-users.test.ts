import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
const session = vi.hoisted(() => vi.fn());
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ auth: { getSession: session } }),
}));
vi.mock('@/lib/api-config', () => ({ getApiBaseUrl: () => 'https://api.test' }));
import { getDomaniUsers, getDomaniUserStats, getDomaniUser } from './domani-users';
const validUser = {
  id: '10000000-0000-4000-8000-000000000001',
  email: null,
  full_name: null,
  signup_cohort: null,
  signup_method: null,
  timezone: null,
  created_at: null,
  profile_created_at: null,
  joined_at: null,
  last_sign_in_at: null,
  last_active_at: null,
  activity_source: null,
  deleted_at: null,
  deletion_scheduled_for: null,
  email_confirmed_at: null,
  email_verification_status: 'unknown',
  account_status: 'unknown',
  login_providers: [],
  latest_device_observation: null,
  feedback_count: 0,
};
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
  it('accepts an explicitly unknown user without inventing account details', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ...validResponse, items: [validUser], total: 1 })),
    );
    await expect(getDomaniUsers()).resolves.toMatchObject({ items: [validUser] });
  });

  it.each([
    { ...validUser, account_status: undefined },
    { ...validUser, login_providers: 'google' },
    { ...validUser, latest_device_observation: { source: 'feedback' } },
  ])('rejects incomplete or mistyped user records', async (item) => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ...validResponse, items: [item], total: 1 })),
    );
    await expect(getDomaniUsers()).rejects.toThrow('incompatible Users response');
  });

  it('rejects incomplete user details', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: validUser.id, data_as_of: validResponse.data_as_of })),
    );
    await expect(getDomaniUser(validUser.id)).rejects.toThrow('incompatible Users response');
  });

  it('accepts complete user details with a historical device snapshot', async () => {
    const detail = {
      ...validUser,
      latest_device_observation: {
        source_id: '20000000-0000-4000-8000-000000000001',
        source: 'feedback',
        observed_at: '2026-09-20T00:00:00Z',
        platform: 'ios',
        device_brand: null,
        device_model: null,
        os_version: null,
        app_version: null,
        app_build: null,
      },
      data_as_of: validResponse.data_as_of,
    };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify(detail)));
    await expect(getDomaniUser(validUser.id)).resolves.toMatchObject(detail);
  });

  it('rejects a detail response for another user', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: 'other', data_as_of: validResponse.data_as_of })),
    );
    await expect(getDomaniUser('expected')).rejects.toThrow('incompatible Users response');
  });
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
  it('preserves an origin rejection instead of mislabeling it as missing staff access', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          error: { code: 'ORIGIN_NOT_ALLOWED', message: 'Request origin is not allowed' },
        }),
        { status: 403 },
      ),
    );
    await expect(getDomaniUsers()).rejects.toMatchObject({
      status: 403,
      code: 'ORIGIN_NOT_ALLOWED',
      message: 'This dashboard origin is not allowed by the local API configuration.',
    });
  });
});
