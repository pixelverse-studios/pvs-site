// @vitest-environment jsdom
import React, { useEffect, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FeedbackReplyComposer, emptyReplyDraft, type ReplyDraft } from './feedback-reply-composer';
import { FeedbackDraftsProvider, useFeedbackDrafts } from '@/components/feedback-drafts-provider';

const mocks = vi.hoisted(() => ({
  history: vi.fn(),
  status: vi.fn(),
  send: vi.fn(),
  auth: vi.fn(),
  reconcile: vi.fn(),
  read: vi.fn(),
  retry: vi.fn(),
}));
vi.mock('@/lib/api/feedback', () => ({
  FeedbackRequestError: class extends Error {
    constructor(
      message: string,
      public status: number,
    ) {
      super(message);
    }
  },
  getFeedbackMessages: mocks.history,
  getFeedbackReplyState: mocks.status,
  sendFeedbackReply: mocks.send,
  retryFeedbackReply: mocks.retry,
  reconcileFeedbackReply: mocks.reconcile,
  markFeedbackRead: mocks.read,
}));
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ auth: { onAuthStateChange: mocks.auth } }),
}));
const item = { id: 'fixture', source: 'beta_feedback', email: 'fixture@example.test' } as any;
let container: HTMLDivElement;
let root: Root;
let authChanged: (event: string, session: any) => void;
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  vi.clearAllMocks();
  mocks.history.mockReset().mockResolvedValue({ items: [], next_cursor: null });
  mocks.auth.mockImplementation((callback) => {
    authChanged = callback;
    callback('INITIAL_SESSION', { user: { id: 'staff-one' } });
    return { data: { subscription: { unsubscribe: vi.fn() } } };
  });
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});
async function click(text: string) {
  const button = Array.from(container.querySelectorAll('button')).find(
    (b) => b.textContent === text,
  );
  expect(button, text).toBeTruthy();
  await act(async () => button!.click());
}
async function type(text: string) {
  const textarea = container.querySelector('textarea')!;
  await act(async () => Simulate.change(textarea, { target: { value: text } } as any));
}
function deferred() {
  let resolve!: (value: any) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

describe('reply async ownership', () => {
  it.each(['accepted', 'failed'])(
    'keeps a new draft after a late %s status response',
    async (status) => {
      const request = deferred();
      mocks.status.mockReturnValue(request.promise);
      function Composer() {
        const [draft, setDraft] = useState<ReplyDraft>({
          ...emptyReplyDraft(),
          text: 'Old reply',
          key: 'old-key',
          phase: 'submitted',
          result: { delivery_status: status } as any,
        });
        return <FeedbackReplyComposer item={item} draft={draft} onChange={setDraft} />;
      }
      await act(async () => root.render(<Composer />));
      await click('Check status');
      await click(status === 'accepted' ? 'Write another reply' : 'Edit as a new reply');
      await type('My new reply');
      await act(async () => request.resolve({ delivery_status: status }));
      expect(container.querySelector('textarea')!.value).toBe('My new reply');
      expect(container.querySelector('textarea')!.disabled).toBe(false);
    },
  );
  it('ignores a late status error after starting another reply', async () => {
    const request = deferred();
    mocks.status.mockReturnValue(request.promise);
    function Composer() {
      const [draft, setDraft] = useState<ReplyDraft>({
        ...emptyReplyDraft(),
        text: 'Old reply',
        key: 'old-key',
        phase: 'submitted',
        result: { delivery_status: 'accepted' } as any,
      });
      return <FeedbackReplyComposer item={item} draft={draft} onChange={setDraft} />;
    }
    await act(async () => root.render(<Composer />));
    await click('Check status');
    await click('Write another reply');
    await type('Keep this');
    await act(async () => request.reject(new Error('Old request failed')));
    expect(container.querySelector('textarea')!.value).toBe('Keep this');
    expect(container.textContent).not.toContain('Old request failed');
  });
});

function StoredComposer() {
  const { drafts, setDrafts } = useFeedbackDrafts();
  return (
    <FeedbackReplyComposer
      item={item}
      draft={drafts.fixture || emptyReplyDraft()}
      onChange={(draft) => setDrafts((prev) => ({ ...prev, fixture: draft }))}
    />
  );
}
function Routes() {
  const [page, setPage] = useState('feedback');
  useEffect(() => {
    const pop = (event: PopStateEvent) => setPage(event.state.page);
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, []);
  return page === 'feedback' ? <StoredComposer /> : <p>Releases</p>;
}
async function navigate(page: string) {
  await act(async () => window.dispatchEvent(new PopStateEvent('popstate', { state: { page } })));
}
describe('draft lifetime across route transitions', () => {
  it('restores text after history navigation and warns before document unload even on another page', async () => {
    await act(async () =>
      root.render(
        <FeedbackDraftsProvider>
          <Routes />
        </FeedbackDraftsProvider>,
      ),
    );
    await type('Retain through Back and Forward');
    await navigate('releases');
    const unload = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(unload);
    expect(unload.defaultPrevented).toBe(true);
    await navigate('feedback');
    expect(container.querySelector('textarea')!.value).toBe('Retain through Back and Forward');
  });
  it.each(['SIGNED_OUT', 'SIGNED_IN'])(
    'clears sensitive drafts on %s / changed account',
    async (event) => {
      await act(async () =>
        root.render(
          <FeedbackDraftsProvider>
            <Routes />
          </FeedbackDraftsProvider>,
        ),
      );
      await type('Private draft');
      await navigate('releases');
      await act(async () =>
        authChanged(event, event === 'SIGNED_OUT' ? null : { user: { id: 'staff-two' } }),
      );
      await navigate('feedback');
      expect(container.querySelector('textarea')!.value).toBe('');
    },
  );
  it('does not restore a cleared account draft when its send finishes late', async () => {
    const request = deferred();
    mocks.send.mockReturnValue(request.promise);
    await act(async () =>
      root.render(
        <FeedbackDraftsProvider>
          <Routes />
        </FeedbackDraftsProvider>,
      ),
    );
    await type('Private pending message');
    await click('Send reply');
    await act(async () => authChanged('SIGNED_IN', { user: { id: 'staff-two' } }));
    await act(async () => request.resolve({ delivery_status: 'accepted' }));
    expect(container.querySelector('textarea')!.value).toBe('');
  });
  it('reconciles a send interrupted by navigation without losing its request key', async () => {
    const request = deferred();
    mocks.send.mockReturnValue(request.promise);
    mocks.status.mockResolvedValue({ delivery_status: 'accepted' });
    await act(async () =>
      root.render(
        <FeedbackDraftsProvider>
          <Routes />
        </FeedbackDraftsProvider>,
      ),
    );
    await type('Send once');
    await click('Send reply');
    const key = mocks.send.mock.calls[0][2].request_key;
    await navigate('releases');
    await navigate('feedback');
    expect(container.textContent).toContain('Send outcome is unconfirmed');
    await click('Check status');
    expect(mocks.status).toHaveBeenCalledWith(item.id, item.source, key);
    await click('Write another reply');
    await type('Do not overwrite');
    await act(async () => request.resolve({ delivery_status: 'accepted' }));
    expect(container.querySelector('textarea')!.value).toBe('Do not overwrite');
    expect(mocks.send).toHaveBeenCalledTimes(1);
  });
});

describe('paginated history after acceptance', () => {
  const message = (n: number) => ({
    id: `message-${n}`,
    direction: 'outbound',
    author: { email: 'hello@domani-app.com' },
    subject: `Reply ${n}`,
    text: `History message ${n}`,
    delivery_status: 'accepted',
  });
  it.each(['send', 'status'])(
    'preserves loaded pages and fetches through the new reply after %s',
    async (action) => {
      let accepted = false;
      mocks.history.mockImplementation(async (_id, _source, page) => {
        const total = accepted ? 45 : 40;
        const end = page?.before ? Number(page.before.split('-')[1]) - 1 : total;
        const start = Math.max(0, end - 20);
        return {
          items: Array.from({ length: end - start }, (_, i) => message(start + i + 1)),
          previous_cursor: start > 0 ? `message-${start + 1}` : null,
          next_cursor: null,
        };
      });
      const accept = async () => {
        accepted = true;
        return { message_id: 'message-45', delivery_status: 'accepted' };
      };
      mocks.send.mockImplementation(accept);
      mocks.status.mockImplementation(accept);
      function Composer() {
        const [draft, setDraft] = useState<ReplyDraft>({
          ...emptyReplyDraft(),
          text: 'New reply',
          ...(action === 'status' ? { key: 'pending-key', phase: 'unknown' as const } : {}),
        });
        return <FeedbackReplyComposer item={item} draft={draft} onChange={setDraft} />;
      }
      await act(async () => root.render(<Composer />));
      await click('Load earlier replies');
      expect(container.querySelectorAll('article')).toHaveLength(40);
      await click(action === 'send' ? 'Send reply' : 'Check status');
      expect(container.querySelectorAll('article')).toHaveLength(45);
      expect(container.querySelectorAll('article')[44].textContent).toContain('History message 45');
      expect(mocks.history).toHaveBeenLastCalledWith(item.id, item.source, {
        latest: true,
        before: 'message-6',
      });
    },
  );
  it('retains displayed replies when a later refresh page fails and retries through acceptance', async () => {
    let accepted = false;
    let fail = true;
    mocks.history.mockImplementation(async (_id, _source, page) => {
      if (page?.before && fail) throw new Error('History temporarily unavailable');
      if (page?.before) return { items: [message(1)], previous_cursor: null };
      return {
        items: Array.from({ length: 20 }, (_, i) => message(i + (accepted ? 2 : 1))),
        previous_cursor: accepted ? 'message-2' : null,
      };
    });
    mocks.send.mockImplementation(async () => {
      accepted = true;
      return { message_id: 'message-21', delivery_status: 'accepted' };
    });
    function Composer() {
      const [draft, setDraft] = useState<ReplyDraft>({ ...emptyReplyDraft(), text: 'New reply' });
      return <FeedbackReplyComposer item={item} draft={draft} onChange={setDraft} />;
    }
    await act(async () => root.render(<Composer />));
    await click('Send reply');
    expect(container.querySelectorAll('article')).toHaveLength(20);
    expect(container.textContent).toContain('History temporarily unavailable');
    fail = false;
    await click('Retry history');
    expect(container.querySelectorAll('article')).toHaveLength(21);
    expect(container.textContent).toContain('History message 21');
    expect(mocks.send).toHaveBeenCalledTimes(1);
  });
});

describe('collapsible delivery history', () => {
  const fixture = (id: string, status: string, canRetry = false) => ({
    id,
    request_key: `key-${id}`,
    direction: 'outbound',
    subject: `Subject ${id}`,
    text: '<img src="https://tracker.test/pixel"> Plain text reply',
    author: { email: 'staff@example.test' },
    sender_email: 'hello@domani-app.com',
    recipient_email: 'fixture@example.test',
    created_at: '2026-09-18T12:00:00Z',
    delivery_status: status,
    can_retry: canRetry,
  });
  function Composer() {
    const [draft, setDraft] = useState<ReplyDraft>(emptyReplyDraft());
    return <FeedbackReplyComposer item={item} draft={draft} onChange={setDraft} />;
  }
  it('opens all responses initially and preserves individual collapse choices during refresh', async () => {
    mocks.history.mockResolvedValue({
      items: [fixture('one', 'accepted'), fixture('two', 'delivered')],
      previous_cursor: null,
    });
    await act(async () => root.render(<Composer />));
    const expanded = () =>
      Array.from(container.querySelectorAll('button[aria-expanded]')).map((b) =>
        b.getAttribute('aria-expanded'),
      );
    expect(expanded()).toEqual(['true', 'true']);
    await act(async () =>
      (container.querySelector('button[aria-expanded]') as HTMLButtonElement).click(),
    );
    await type('Keep this draft');
    await click('Refresh history');
    expect(expanded()).toEqual(['false', 'true']);
    expect(container.querySelector('textarea')!.value).toBe('Keep this draft');
    await click('Collapse all');
    expect(expanded()).toEqual(['false', 'false']);
    await click('Expand all');
    expect(expanded()).toEqual(['true', 'true']);
    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).toContain('staff@example.test');
    expect(container.textContent).toContain('Delivered');
  });
  it('shows retry only when permitted and checks provider status without sending another reply', async () => {
    mocks.history.mockResolvedValue({
      items: [fixture('one', 'failed', true), fixture('two', 'complained')],
      previous_cursor: null,
    });
    mocks.reconcile.mockResolvedValue({ delivery_status: 'delivered' });
    mocks.retry.mockResolvedValue({ delivery_status: 'queued' });
    await act(async () => root.render(<Composer />));
    expect(
      Array.from(container.querySelectorAll('button')).filter(
        (b) => b.textContent === 'Retry same reply',
      ),
    ).toHaveLength(1);
    await click('Check status');
    expect(mocks.reconcile).toHaveBeenCalledWith(item.id, item.source, 'key-one');
    expect(mocks.send).not.toHaveBeenCalled();
    await click('Retry same reply');
    expect(mocks.retry).toHaveBeenCalledWith(item.id, item.source, 'key-one');
    expect(container.textContent).toContain('marked this email as spam');
  });
});

describe('review regressions', () => {
  it('keeps the oldest loaded boundary on refresh and still allows earlier replies', async () => {
    let total = 40;
    mocks.history.mockImplementation(async (_id, _source, page) => {
      const end = page?.before ? Number(page.before.split('-')[1]) - 1 : total;
      const start = Math.max(0, end - 20);
      return {
        items: Array.from({ length: end - start }, (_, i) => ({
          id: `message-${start + i + 1}`,
          direction: 'outbound',
          author: { email: 'staff@example.test' },
          subject: `Reply ${start + i + 1}`,
          text: 'Body',
          delivery_status: 'accepted',
          created_at: '2026-09-18T12:00:00Z',
        })),
        previous_cursor: start > 0 ? `message-${start + 1}` : null,
      };
    });
    await act(async () =>
      root.render(
        <FeedbackReplyComposer item={item} draft={emptyReplyDraft()} onChange={() => {}} />,
      ),
    );
    expect(container.querySelectorAll('article')).toHaveLength(20);
    total = 41;
    await click('Refresh history');
    expect(container.querySelectorAll('article')).toHaveLength(21);
    expect(container.querySelector('article')!.textContent).toContain('Reply 21');
    await click('Load earlier replies');
    expect(mocks.history).toHaveBeenLastCalledWith(item.id, item.source, {
      latest: true,
      before: 'message-21',
    });
    expect(container.querySelectorAll('article')).toHaveLength(41);
    expect(container.querySelector('article')!.textContent).toContain('Reply 1');
  });

  it.each([false, true])(
    'syncs history reconciliation without overwriting a newer draft (%s)',
    async (newDraft) => {
      const pending = deferred();
      let status = newDraft ? 'accepted' : 'unknown';
      mocks.history.mockImplementation(async () => ({
        items: [
          {
            id: 'message',
            request_key: 'same-key',
            direction: 'outbound',
            author: { email: 'staff@example.test' },
            subject: 'Reply',
            text: 'Body',
            delivery_status: status,
            created_at: '2026-09-18T12:00:00Z',
          },
        ],
      }));
      mocks.reconcile.mockReturnValue(pending.promise);
      function Composer() {
        const [draft, setDraft] = useState<ReplyDraft>({
          ...emptyReplyDraft(),
          key: 'same-key',
          text: 'Body',
          phase: 'submitted',
          result: {
            delivery_status: status,
            needs_reconciliation: !newDraft,
            can_retry: false,
          } as any,
        });
        return <FeedbackReplyComposer item={item} draft={draft} onChange={setDraft} />;
      }
      await act(async () => root.render(<Composer />));
      const button = Array.from(
        container.querySelector('article')!.querySelectorAll('button'),
      ).find((b) => b.textContent === 'Check status')!;
      await act(async () => button.click());
      if (newDraft) {
        await click('Write another reply');
        await type('Keep this new draft');
      }
      status = 'delivered';
      await act(async () =>
        pending.resolve({
          message_id: 'message',
          request_key: 'same-key',
          delivery_status: 'delivered',
          can_retry: false,
          needs_reconciliation: false,
        }),
      );
      expect(container.querySelector('article')!.textContent).toContain('Delivered');
      if (newDraft) {
        expect(container.querySelector('textarea')!.value).toBe('Keep this new draft');
        expect(container.querySelector('textarea')!.disabled).toBe(false);
      } else {
        expect(container.textContent).toContain('Write another reply');
        expect(container.textContent).not.toContain('The provider outcome is uncertain');
      }
    },
  );
});

describe('incoming replies', () => {
  const incoming = (id: string, unread = true) => ({
    id,
    direction: 'inbound',
    subject: 'Re: Feedback',
    text: 'Thanks!\n\n> Old quoted reply\n<img src="https://tracking.test/pixel">',
    author: { email: 'user@example.test' },
    sender_email: 'user@example.test',
    recipient_email: 'route@replies.domani-app.com',
    created_at: '2026-09-18T12:00:00Z',
    delivery_status: 'received',
    unread,
    attachment_count: 1,
  });
  function Composer() {
    const [draft, setDraft] = useState(emptyReplyDraft());
    return <FeedbackReplyComposer item={item} draft={draft} onChange={setDraft} />;
  }
  it('shows unread incoming text safely with quoted content and omitted attachments', async () => {
    mocks.history.mockResolvedValue({ items: [incoming('one')] });
    await act(async () => root.render(<Composer />));
    expect(container.textContent).toContain('Unread reply');
    expect(container.textContent).toContain('user@example.test');
    expect(container.textContent).toContain('attachment(s) omitted');
    expect(container.querySelector('details summary')!.textContent).toBe('Quoted message');
    expect(container.querySelector('img')).toBeNull();
    expect(mocks.read).not.toHaveBeenCalled();
  });
  it('marks only the loaded boundary and preserves a later arriving reply and draft', async () => {
    let later = false;
    mocks.history.mockImplementation(async () => ({
      items: later ? [incoming('one', false), incoming('two')] : [incoming('one')],
    }));
    mocks.read.mockImplementation(async () => {
      later = true;
      return { last_read_message_id: 'one' };
    });
    await act(async () => root.render(<Composer />));
    await type('Keep composing');
    await click('Mark conversation read');
    expect(mocks.read).toHaveBeenCalledWith(item.id, item.source, 'one');
    expect(container.querySelectorAll('article')).toHaveLength(2);
    expect(container.textContent).toContain('1 unread replies in loaded history');
    expect(container.querySelector('textarea')!.value).toBe('Keep composing');
  });
  it('retains unread replies and exposes retry when marking read fails', async () => {
    mocks.history.mockResolvedValue({ items: [incoming('one')] });
    mocks.read.mockRejectedValue(new Error('Unavailable'));
    await act(async () => root.render(<Composer />));
    await click('Mark conversation read');
    expect(container.textContent).toContain('Could not mark replies read');
    expect(container.textContent).toContain('Unread reply');
    expect(container.textContent).toContain('Mark conversation read');
  });
});
