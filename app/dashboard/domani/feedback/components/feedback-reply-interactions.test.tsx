// @vitest-environment jsdom
import React, { useEffect, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FeedbackReplyComposer, emptyReplyDraft, type ReplyDraft } from './feedback-reply-composer';
import { FeedbackDraftsProvider, useFeedbackDrafts } from '@/components/feedback-drafts-provider';

const mocks = vi.hoisted(() => ({
  status: vi.fn(),
  send: vi.fn(),
  auth: vi.fn(),
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
  getFeedbackMessages: async () => ({ items: [], next_cursor: null }),
  getFeedbackReplyState: mocks.status,
  sendFeedbackReply: mocks.send,
  retryFeedbackReply: vi.fn(),
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
