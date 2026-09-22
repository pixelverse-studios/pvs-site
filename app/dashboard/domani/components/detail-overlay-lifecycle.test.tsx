// @vitest-environment jsdom
import './mantine-test-provider';
import React, { useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { createRoot, type Root } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FeedbackDetailDrawer } from '../feedback/components/feedback-detail-drawer';
import { CampaignDetailModal } from '../campaigns/components/campaign-detail-modal';
import type { UnifiedFeedbackItem } from '@/lib/types/feedback';
import type { Campaign } from '@/lib/types/email-campaign';

let root: Root;
let container: HTMLDivElement;
const settle = (ms: number) =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
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

function Harness({ kind }: { kind: 'feedback' | 'campaign' }) {
  const [selection, setSelection] = useState<number | null>(null);
  const close = () => setSelection(null);
  const feedback =
    selection === null
      ? null
      : ({
          id: String(selection),
          source: 'beta_feedback',
          category: 'general',
          status: 'new',
          message: `Selected record ${selection}`,
          email: 'test@example.com',
          created_at: null,
        } as UnifiedFeedbackItem);
  const campaign =
    selection === null
      ? null
      : ({
          id: String(selection),
          subject: `Selected record ${selection}`,
          template_type: 'custom',
          recipient_count: 0,
          successful: 0,
          failed: 0,
          recipients: [],
          html_content: '',
        } as unknown as Campaign);
  return (
    <MantineProvider>
      <button onClick={() => setSelection(1)}>Open first</button>
      <button onClick={() => setSelection(2)}>Open second</button>
      {kind === 'feedback' ? (
        <FeedbackDetailDrawer
          item={feedback}
          isOpen={selection !== null}
          composer={selection !== null ? <p>Draft for {selection}</p> : undefined}
          onClose={close}
          onStatusChange={async () => {}}
        />
      ) : (
        <CampaignDetailModal campaign={campaign} isOpen={selection !== null} onClose={close} />
      )}
    </MantineProvider>
  );
}

describe.each(['feedback', 'campaign'] as const)('%s overlay lifecycle', (kind) => {
  it('preserves exiting content and returns focus when the parent clears selection', async () => {
    await act(async () => root.render(<Harness kind={kind} />));
    const [first, second] = Array.from(container.querySelectorAll('button'));
    first.focus();
    await act(async () => Simulate.click(first));
    await settle(350);
    const dialog = document.querySelector('[role="dialog"]')!;
    expect(dialog.textContent).toContain('Selected record 1');
    (dialog.querySelector('button') as HTMLElement).focus();
    await act(async () =>
      document.activeElement!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      ),
    );
    expect(document.querySelector('[role="dialog"]')?.textContent).toContain('Selected record 1');
    if (kind === 'feedback')
      expect(document.querySelector('[role="dialog"]')?.textContent).toContain('Draft for 1');
    await settle(350);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(first);
    second.focus();
    await act(async () => Simulate.click(second));
    await settle(350);
    expect(document.querySelector('[role="dialog"]')?.textContent).toContain('Selected record 2');
    expect(document.querySelector('[role="dialog"]')?.textContent).not.toContain(
      'Selected record 1',
    );
  });
});
