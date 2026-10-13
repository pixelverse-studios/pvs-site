import { TestProvider } from '../../components/mantine-test-provider';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
vi.mock('@/lib/api/feedback', () => ({ FeedbackRequestError: class extends Error {} }));
import { FeedbackReplyComposer, emptyReplyDraft, hasUnsentReply } from './feedback-reply-composer';
const item = { id: 'fixture', source: 'beta_feedback', email: 'fixture@example.test' } as any;
describe('reply composer states', () => {
  it('labels immutable sender and recipient, with a plain-text editor', () => {
    const html = renderToStaticMarkup(
      <TestProvider>
        {<FeedbackReplyComposer item={item} draft={emptyReplyDraft()} onChange={() => {}} />}
      </TestProvider>,
    );
    expect(html).toContain('hello@domani-app.com');
    expect(html).toContain('fixture@example.test');
    expect(html).toContain('aria-label="Reply subject"');
    expect(html).toContain('aria-label="Reply message"');
    expect(html).toContain('maxLength="20000"');
  });
  it('locks uncertain content and offers only same-request recovery', () => {
    const html = renderToStaticMarkup(
      <TestProvider>
        {
          <FeedbackReplyComposer
            item={item}
            draft={{
              ...emptyReplyDraft(),
              text: '<unsafe>',
              key: 'key',
              phase: 'unknown',
              missingIntent: true,
            }}
            onChange={() => {}}
          />
        }
      </TestProvider>,
    );
    expect(html).toContain('Retry same request');
    expect(html).not.toContain('>Send reply<');
    expect(html).toContain('&lt;unsafe&gt;');
    expect(html).not.toContain('<unsafe>');
    expect(html.match(/disabled=""/g)?.length).toBe(2);
  });
  it('keeps pending/unconfirmed replies in the unsent-work guard', () => {
    expect(hasUnsentReply({ ...emptyReplyDraft(), text: 'Draft', phase: 'pending' })).toBe(true);
    expect(hasUnsentReply({ ...emptyReplyDraft(), text: 'Draft', phase: 'unknown' })).toBe(true);
    expect(
      hasUnsentReply({
        ...emptyReplyDraft(),
        text: 'Sent',
        result: { delivery_status: 'accepted' } as any,
      }),
    ).toBe(false);
  });
});
