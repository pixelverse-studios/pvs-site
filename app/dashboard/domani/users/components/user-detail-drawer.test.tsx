// @vitest-environment jsdom
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
const mock = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock('@/lib/api/domani-users', () => ({
  getDomaniUser: mock.get,
  UsersRequestError: class extends Error {
    constructor(
      message: string,
      public status: number,
    ) {
      super(message);
    }
  },
}));
import { UserDetailDrawer } from './user-detail-drawer';
import { UsersRequestError } from '@/lib/api/domani-users';
const id = '10000000-0000-4000-8000-000000000001';
const user = {
  id,
  full_name: 'Sample user',
  email: 'relay@privaterelay.appleid.com',
  login_providers: ['apple', 'google'],
  signup_method: 'apple',
  last_active_at: null,
  latest_device_observation: null,
  feedback_count: 3,
  data_as_of: '2026-09-20T00:00:00Z',
};
let root: Root, container: HTMLDivElement;
const close = vi.fn(),
  restore = vi.fn();
const render = (value: string | null = id) =>
  act(async () =>
    root.render(<UserDetailDrawer id={value} onClose={close} returnFocus={restore} />),
  );
beforeEach(() => {
  (globalThis as any).React = React;
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  vi.clearAllMocks();
  mock.get.mockReset().mockResolvedValue(user);
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});
describe('user detail drawer', () => {
  it('keeps missing observations honest and links feedback by user ID', async () => {
    await render();
    const dialog = document.querySelector('[role="dialog"]')!;
    expect(dialog.textContent).toContain('apple, google');
    expect(dialog.textContent).toContain('No device observations recorded');
    expect(dialog.textContent).toContain('Original signup method');
    expect(dialog.textContent).toContain('3 feedback and support submissions');
    expect(dialog.querySelector('a')?.getAttribute('href')).toBe(
      `/dashboard/domani/feedback?user_id=${id}`,
    );
    expect(dialog.querySelector('a')?.getAttribute('target')).toBe('_blank');
    const copy = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: copy },
    });
    const button = Array.from(dialog.querySelectorAll('button')).find(
      (b) => b.textContent === 'Copy user ID',
    )!;
    await act(async () => Simulate.click(button));
    expect(copy).toHaveBeenCalledWith(id);
    expect(dialog.textContent).toContain('User ID copied');
  });
  it('aborts obsolete detail loads and restores focus after close', async () => {
    let resolve!: (value: any) => void;
    mock.get.mockReturnValueOnce(
      new Promise((r) => {
        resolve = r;
      }),
    );
    await render();
    const signal = mock.get.mock.calls[0][1];
    await render('20000000-0000-4000-8000-000000000001');
    expect(signal.aborted).toBe(true);
    await act(async () => resolve({ ...user, full_name: 'Obsolete result' }));
    expect(document.body.textContent).not.toContain('Obsolete result');
    await render(null);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });
    expect(restore).toHaveBeenCalled();
  });
  it.each([
    [404, 'User not found'],
    [403, 'Staff access required'],
    [401, 'Session expired'],
    [503, 'User details unavailable'],
  ])('handles status %s', async (status, text) => {
    mock.get.mockRejectedValue(new UsersRequestError('Request failed', status as number));
    await render();
    expect(document.querySelector('[role="alert"]')?.textContent).toContain(text);
    expect(document.querySelector('a[href*="user_id"]')).toBeNull();
  });
});
