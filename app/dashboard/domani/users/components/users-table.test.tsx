// @vitest-environment jsdom
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { UserProfile } from '@/lib/types/domani-users';
import { USER_COLUMNS, UsersTable, type UserColumn } from './users-table';

let root: Root;
let container: HTMLDivElement;
const user: UserProfile = {
  id: '10000000-0000-4000-8000-000000000001',
  email: 'user@example.test',
  full_name: 'Timezone User',
  signup_cohort: 'general',
  signup_method: 'apple',
  timezone: 'America/New_York',
  created_at: '2026-09-20T22:30:00Z',
  joined_at: '2026-09-21T00:30:00+02:00',
  deleted_at: null,
  last_active_at: null,
  last_sign_in_at: '2026-09-20T23:00:00Z',
  login_providers: ['apple', 'google'],
  email_verification_status: 'verified',
  account_status: 'banned',
  latest_device_observation: {
    source: 'feedback',
    source_id: '20000000-0000-4000-8000-000000000001',
    observed_at: '2026-06-01T04:05:06Z',
    platform: 'ios',
    device_brand: 'Apple',
    device_model: 'iPhone',
    os_version: '18.0',
    app_version: '5.0',
    app_build: '500',
  },
};

beforeEach(() => {
  (globalThis as any).React = React;
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

describe('users table semantics', () => {
  it('renders every configurable column with UTC dates and historical-device labels', async () => {
    const columns = Object.keys(USER_COLUMNS) as UserColumn[];
    await act(async () => root.render(<UsersTable items={[user]} columns={columns} />));
    const headers = Array.from(container.querySelectorAll('th')).map((node) => node.textContent);
    for (const heading of Object.values(USER_COLUMNS)) expect(headers).toContain(heading);
    expect(container.querySelector('caption')?.textContent).toContain('All timestamps are UTC');
    expect(container.querySelector('[role="region"]')?.getAttribute('tabindex')).toBe('0');
    expect(container.textContent).toContain('2026-09-20');
    expect(container.textContent).toContain('22:30:00 UTC');
    expect(container.textContent).toContain('Not recorded');
    expect(container.textContent).toContain('apple, google');
    expect(container.textContent).toContain('feedback snapshot');
    expect(container.textContent).toContain('5.0 / 500');
    expect(container.textContent).toContain('banned');
  });

  it('exposes a keyboard button with the stable user identity to detail navigation', async () => {
    const open = vi.fn();
    await act(async () => root.render(<UsersTable items={[user]} columns={[]} onOpen={open} />));
    const trigger = container.querySelector<HTMLButtonElement>(
      '[aria-label="View details for Timezone User"]',
    )!;
    expect(trigger.type).toBe('button');
    await act(async () => trigger.click());
    expect(open).toHaveBeenCalledWith(user.id, trigger);
  });
});
