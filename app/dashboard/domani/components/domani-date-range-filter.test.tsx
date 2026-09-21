// @vitest-environment jsdom
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { TestProvider } from './mantine-test-provider';
import { DateRangeFilter } from './domani-date-range-filter';
let root: Root, container: HTMLDivElement;
const change = vi.fn();
beforeEach(async () => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  change.mockClear();
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  await act(async () =>
    root.render(
      <TestProvider>
        <DateRangeFilter
          value={{ preset: 'all', startDate: null, endDate: null }}
          onChange={change}
        />
      </TestProvider>,
    ),
  );
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});
const click = async (selector: string) =>
  act(async () => (container.querySelector(selector) as HTMLElement).click());
it('keeps custom date changes local until both dates are selected and applied', async () => {
  await click('button');
  await click('input');
  await act(async () =>
    Array.from(container.querySelectorAll('[role="option"]'))
      .find((e) => e.textContent === 'Custom range')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true })),
  );
  expect(change).not.toHaveBeenCalled();
  const inputs = Array.from(container.querySelectorAll('input')).filter(
    (e) => !e.readOnly && e.type !== 'hidden',
  );
  await act(async () => inputs[0].click());
  // Select two calendar days from the displayed month; values must stay date-only.
  const dayButtons = Array.from(container.querySelectorAll('button')).filter((e) =>
    /^\d{1,2} \w+ \d{4}$/.test(e.getAttribute('aria-label') || ''),
  );
  await act(async () => dayButtons[10].click());
  expect(change).not.toHaveBeenCalled();
  await act(async () => inputs[1].click());
  const endButtons = Array.from(container.querySelectorAll('button')).filter(
    (e) => !e.disabled && /^\d{1,2} \w+ \d{4}$/.test(e.getAttribute('aria-label') || ''),
  );
  await act(async () => endButtons[0].click());
  await act(async () =>
    Array.from(container.querySelectorAll('button'))
      .find((e) => e.textContent === 'Apply')!
      .click(),
  );
  expect(change).toHaveBeenCalledTimes(1);
  expect(change.mock.calls[0][0]).toMatchObject({
    preset: 'custom',
    startDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    endDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
  });
});
