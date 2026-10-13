import { TestProvider } from '../../components/mantine-test-provider';
// @vitest-environment jsdom
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { UsersToolbar } from './users-toolbar';
let root: Root, container: HTMLDivElement;
const change = vi.fn();
const button = (text: string) =>
  Array.from(document.querySelectorAll('button')).find((b) => b.textContent === text)!;
beforeEach(async () => {
  (globalThis as any).React = React;
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  change.mockClear();
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  await act(async () =>
    root.render(
      <TestProvider>
        {
          <UsersToolbar
            query={{ limit: 50, offset: 50, sort_by: 'joined_at', sort_order: 'desc' }}
            onChange={change}
          />
        }
      </TestProvider>,
    ),
  );
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});
it('batches filters until Apply, resets pagination, and includes deleted accounts when required', async () => {
  await act(async () => button('Filters').click());
  await act(async () =>
    (document.querySelector('[aria-label="Account status"]') as HTMLElement).click(),
  );
  await act(async () =>
    Array.from(document.querySelector('[role="dialog"]')!.querySelectorAll('[role="option"]'))
      .find((e) => e.textContent === 'Deleted')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true })),
  );
  expect(change).not.toHaveBeenCalled();
  await act(async () => button('Apply filters').click());
  expect(change).toHaveBeenCalledWith(
    expect.objectContaining({
      account_status: 'deleted',
      include_deleted: true,
      offset: 0,
      limit: 50,
    }),
  );
  expect(document.querySelector('[role="dialog"]')).toBeNull();
});
it('discards canceled changes when reopened', async () => {
  await act(async () => button('Filters').click());
  await act(async () =>
    (document.querySelector('[aria-label="Login provider"]') as HTMLElement).click(),
  );
  await act(async () =>
    Array.from(document.querySelector('[role="dialog"]')!.querySelectorAll('[role="option"]'))
      .find((e) => e.textContent === 'Apple')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true })),
  );
  await act(async () => button('Cancel').click());
  expect(change).not.toHaveBeenCalled();
  await act(async () => button('Filters').click());
  expect((document.querySelector('[aria-label="Login provider"]') as HTMLSelectElement).value).toBe(
    'All',
  );
});
