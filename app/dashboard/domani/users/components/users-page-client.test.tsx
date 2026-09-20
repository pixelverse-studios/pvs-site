// @vitest-environment jsdom
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ list: vi.fn(), auth: vi.fn() }));
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ auth: { onAuthStateChange: mocks.auth } }),
}));
vi.mock('@/lib/api/domani-users', () => ({
  getDomaniUsers: mocks.list,
  UsersRequestError: class extends Error {
    constructor(
      message: string,
      public status: number,
    ) {
      super(message);
    }
  },
}));
import { UsersPageClient } from './users-page-client';
import { UsersRequestError } from '@/lib/api/domani-users';
let root: Root, container: HTMLDivElement, authChange: (event: string, session: any) => void;
const response = (name = 'Synthetic User') => ({
  items: [
    {
      id: 'one',
      email: 'synthetic@example.test',
      full_name: name,
      created_at: '2026-09-01T00:00:00Z',
      joined_at: '2026-09-01T00:00:00Z',
      last_active_at: null,
      last_sign_in_at: null,
      login_providers: ['apple', 'google'],
      account_status: 'active',
      latest_device_observation: null,
    },
  ],
  total: 125,
  stats: { active_30d: 0, activity_unknown: 125 },
  data_as_of: '2026-09-20T00:00:00Z',
});
const tick = () =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(210);
  });
beforeEach(() => {
  (globalThis as any).React = React;
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  vi.useFakeTimers();
  vi.clearAllMocks();
  localStorage.clear();
  mocks.list.mockReset().mockResolvedValue(response());
  mocks.auth.mockImplementation((callback) => {
    authChange = callback;
    callback('INITIAL_SESSION', { user: { id: 'staff-a' } });
    return { data: { subscription: { unsubscribe: vi.fn() } } };
  });
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.useRealTimers();
});
const mount = () => act(async () => root.render(<UsersPageClient />));
describe('Users table contract', () => {
  it('renders authoritative counts, unknown activity and linked providers without treating sign-in as activity', async () => {
    await mount();
    await tick();
    expect(container.textContent).toContain('125 matching users');
    expect(container.textContent).toContain('125 activity not recorded');
    expect(container.textContent).toContain('apple, google');
    expect(container.textContent).toContain('Not recorded');
    expect(container.textContent).not.toContain('Never');
    expect(container.textContent).toContain('UTC');
    await act(async () => authChange('TOKEN_REFRESHED', { user: { id: 'staff-a' } }));
    expect(container.textContent).toContain('Synthetic User');
  });
  it('ignores obsolete responses and searches the full dataset on the server', async () => {
    let resolveOld!: (r: any) => void;
    mocks.list.mockReturnValueOnce(new Promise((r) => (resolveOld = r)));
    await mount();
    await tick();
    await act(async () =>
      Simulate.change(container.querySelector('input[aria-label="Search users"]')!, {
        target: { value: 'new search' },
      } as any),
    );
    await tick();
    expect(mocks.list.mock.calls[1][0]).toMatchObject({ search: 'new search', offset: 0 });
    expect(mocks.list.mock.calls[0][1].aborted).toBe(true);
    await act(async () => resolveOld(response('Obsolete user')));
    expect(container.textContent).not.toContain('Obsolete user');
    expect(container.textContent).toContain('Synthetic User');
  });
  it('stores column IDs per staff account and clears data on sign-out', async () => {
    await mount();
    await tick();
    const checkbox = Array.from(container.querySelectorAll('label'))
      .find((e) => e.textContent === 'Timezone')!
      .querySelector('input')!;
    await act(async () => checkbox.click());
    expect(localStorage.getItem('domani-users-columns:staff-a')).toContain('timezone');
    expect(localStorage.getItem('domani-users-columns:staff-a')).not.toContain('synthetic');
    await act(async () => authChange('SIGNED_OUT', null));
    expect(container.textContent).not.toContain('Synthetic User');
    expect(container.textContent).toContain('Session expired');
  });
  it.each([401, 403, 503])(
    'distinguishes API failure %s from an empty directory',
    async (status) => {
      mocks.list.mockRejectedValueOnce(new UsersRequestError('Test request failure', status));
      await mount();
      await tick();
      expect(container.querySelector('[role="alert"]')).not.toBeNull();
      expect(container.textContent).not.toContain('No users match');
      expect(container.textContent).toContain(
        status === 401
          ? 'Session expired'
          : status === 403
            ? 'Staff access required'
            : 'Users unavailable',
      );
    },
  );
});
