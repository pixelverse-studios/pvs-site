'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { UnifiedFeedbackItem } from '@/lib/types/feedback';
import {
  FeedbackRequestError,
  getFeedbackMessages,
  getFeedbackReplyState,
  retryFeedbackReply,
  sendFeedbackReply,
  type FeedbackReplyState,
  type FeedbackMessage,
} from '@/lib/api/feedback';

export interface ReplyDraft {
  subject: string;
  text: string;
  key?: string;
  result?: FeedbackReplyState;
  phase: 'draft' | 'pending' | 'submitted' | 'unknown';
  error?: string;
  missingIntent?: boolean;
}
export const emptyReplyDraft = (): ReplyDraft => ({
  subject: 'Re: Your Domani feedback',
  text: '',
  phase: 'draft',
});
export const hasUnsentReply = (draft: ReplyDraft) =>
  !!draft.text &&
  !['accepted', 'delivered', 'bounced', 'complained'].includes(draft.result?.delivery_status || '');
const accepted = (result?: FeedbackReplyState) =>
  !!result && ['accepted', 'delivered', 'bounced', 'complained'].includes(result.delivery_status);
export function FeedbackReplyComposer({
  item,
  draft,
  onChange,
}: {
  item: UnifiedFeedbackItem;
  draft: ReplyDraft;
  onChange: (draft: ReplyDraft) => void;
}) {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState('');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const lock = useRef(false);
  const current = useRef(draft);
  current.current = draft;
  const callback = useRef(onChange);
  callback.current = onChange;
  const change = useCallback((next: ReplyDraft) => {
    current.current = next;
    callback.current(next);
  }, []);
  const recipientValid =
    !!item.email && item.email.length <= 320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email);
  const locked = draft.phase !== 'draft';

  const loadHistory = useCallback(
    async (after?: string) => {
      setHistoryLoading(true);
      setHistoryError('');
      try {
        const result = await getFeedbackMessages(item.id, item.source, after);
        setMessages((previous) =>
          after
            ? [...previous, ...result.items.filter((m) => !previous.some((p) => p.id === m.id))]
            : result.items,
        );
        setCursor(result.next_cursor);
      } catch (error) {
        setHistoryError(error instanceof Error ? error.message : 'Conversation unavailable.');
      } finally {
        setHistoryLoading(false);
      }
    },
    [item.id, item.source],
  );
  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  async function submit(retry = false) {
    if (lock.current || current.current.phase === 'pending') return;
    const snapshot = current.current;
    if (
      !recipientValid ||
      !snapshot.subject.trim() ||
      !snapshot.text.trim() ||
      snapshot.subject.length > 200 ||
      snapshot.text.length > 20000 ||
      /[\r\n]/.test(snapshot.subject)
    ) {
      change({
        ...snapshot,
        error:
          'Enter a subject (up to 200 characters) and a message (up to 20,000 characters), with a usable recipient.',
      });
      return;
    }
    lock.current = true;
    const key = snapshot.key || crypto.randomUUID();
    change({ ...snapshot, key, phase: 'pending', error: undefined });
    try {
      const result = retry
        ? await retryFeedbackReply(item.id, item.source, key)
        : await sendFeedbackReply(item.id, item.source, {
            subject: snapshot.subject,
            text: snapshot.text,
            request_key: key,
          });
      change({
        ...snapshot,
        key,
        result,
        phase: 'submitted',
        error: undefined,
        missingIntent: false,
      });
      if (accepted(result)) void loadHistory();
    } catch (error) {
      // Only definitive pre-dispatch rejections allow editing. Network/5xx outcomes
      // retain immutable content and request key until the server confirms state.
      const rejected =
        snapshot.phase === 'draft' &&
        !retry &&
        error instanceof FeedbackRequestError &&
        ([400, 401, 403, 404, 422].includes(error.status) || error.code === 'SENDING_DISABLED');
      change({
        ...snapshot,
        key,
        phase: rejected ? 'draft' : 'unknown',
        error: error instanceof Error ? error.message : 'Unable to confirm this send.',
      });
    } finally {
      lock.current = false;
    }
  }
  const checkStatus = useCallback(async () => {
    const snapshot = current.current;
    if (!snapshot.key || lock.current) return;
    lock.current = true;
    setChecking(true);
    try {
      const result = await getFeedbackReplyState(item.id, item.source, snapshot.key);
      change({ ...snapshot, result, phase: 'submitted', error: undefined, missingIntent: false });
      if (accepted(result) && !accepted(snapshot.result)) void loadHistory();
    } catch (error) {
      if (error instanceof FeedbackRequestError && error.status === 404) {
        // No stored intent yet. Keep the same key so a still-running first request
        // and the next attempt can never create two messages.
        change({
          ...snapshot,
          phase: 'unknown',
          missingIntent: true,
          error: 'No reply is recorded yet. Retry the same request to safely recover it.',
        });
      } else
        change({
          ...snapshot,
          error: error instanceof Error ? error.message : 'Unable to check status.',
        });
    } finally {
      lock.current = false;
      setChecking(false);
    }
  }, [item.id, item.source, loadHistory, change]);
  const shouldPoll =
    !!draft.key &&
    !draft.error &&
    !(draft.result?.needs_reconciliation && !draft.result.can_retry) &&
    draft.phase !== 'draft' &&
    draft.phase !== 'pending' &&
    !accepted(draft.result) &&
    draft.result?.delivery_status !== 'failed';
  useEffect(() => {
    if (!shouldPoll) return;
    const timer = setInterval(() => {
      void checkStatus();
    }, 5000);
    return () => clearInterval(timer);
  }, [shouldPoll, checkStatus]);

  const status = draft.result?.delivery_status;
  const statusText =
    draft.phase === 'pending'
      ? 'Saving your reply…'
      : draft.phase === 'unknown'
        ? 'Send outcome is unconfirmed. Check status before taking another action.'
        : status === 'accepted'
          ? 'Accepted by the email provider. Delivery is not confirmed yet.'
          : status === 'delivered'
            ? 'Delivered.'
            : status === 'unknown'
              ? 'The provider outcome is uncertain. Do not send a duplicate reply.'
              : status === 'failed'
                ? 'The reply could not be sent.'
                : status === 'bounced' || status === 'complained'
                  ? 'This reply has a delivery issue.'
                  : status === 'queued' || status === 'sending'
                    ? 'Your reply is queued for sending.'
                    : '';
  const fieldClass =
    'w-full rounded-lg border border-[var(--pv-border)] bg-[var(--pv-bg)] p-3 text-sm text-[var(--pv-text)] focus:outline-none focus:ring-2 focus:ring-[var(--pv-primary)] disabled:opacity-60';
  const buttonClass =
    'rounded-lg border border-[var(--pv-border)] px-4 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--pv-primary)] disabled:opacity-50';
  return (
    <section
      aria-label="Reply to feedback"
      className="space-y-4 border-t border-[var(--pv-border)] pt-6"
    >
      <h3 className="text-lg font-semibold">Reply</h3>
      <div className="break-words text-sm text-[var(--pv-text-muted)]">
        <p>From: Domani &lt;hello@domani-app.com&gt;</p>
        <p>To: {item.email || 'No email available'}</p>
      </div>
      {!recipientValid && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          This feedback has no usable recipient email. A reply cannot be sent.
        </p>
      )}
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <label className="block space-y-1 text-sm">
          <span>Subject</span>
          <input
            aria-label="Reply subject"
            className={fieldClass}
            value={draft.subject}
            disabled={locked}
            maxLength={200}
            onChange={(e) =>
              change({ ...draft, subject: e.target.value, key: undefined, error: undefined })
            }
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Message</span>
          <textarea
            aria-label="Reply message"
            className={fieldClass}
            rows={6}
            value={draft.text}
            disabled={locked}
            maxLength={20000}
            onChange={(e) =>
              change({ ...draft, text: e.target.value, key: undefined, error: undefined })
            }
          />
          <span className="text-xs text-[var(--pv-text-muted)]">
            {draft.text.length.toLocaleString()} / 20,000 · Plain text
          </span>
        </label>
        <div role="status" aria-live="polite" className="text-sm">
          {statusText}
        </div>
        {draft.error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {draft.error}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {draft.phase === 'draft' && (
            <button
              type="submit"
              className={`${buttonClass} bg-[var(--pv-primary)] text-white`}
              disabled={!recipientValid || !draft.text.trim()}
            >
              Send reply
            </button>
          )}
          {draft.key && locked && (
            <button
              type="button"
              className={buttonClass}
              disabled={checking || draft.phase === 'pending'}
              onClick={() => void checkStatus()}
            >
              Check status
            </button>
          )}
          {draft.missingIntent && draft.phase !== 'pending' && (
            <button type="button" className={buttonClass} onClick={() => void submit()}>
              Retry same request
            </button>
          )}
          {draft.phase === 'submitted' && draft.result?.can_retry && (
            <button
              type="button"
              className={buttonClass}
              disabled={draft.phase === 'pending'}
              onClick={() => void submit(true)}
            >
              Retry same reply
            </button>
          )}
          {draft.result?.delivery_status === 'failed' && draft.phase === 'submitted' && (
            <button
              type="button"
              className={buttonClass}
              onClick={() => change({ subject: draft.subject, text: draft.text, phase: 'draft' })}
            >
              Edit as a new reply
            </button>
          )}
          {accepted(draft.result) && (
            <button type="button" className={buttonClass} onClick={() => change(emptyReplyDraft())}>
              Write another reply
            </button>
          )}
          {draft.phase === 'draft' && draft.text && (
            <button
              type="button"
              className={buttonClass}
              onClick={() => {
                if (window.confirm('Discard this unsent reply?')) change(emptyReplyDraft());
              }}
            >
              Discard draft
            </button>
          )}
        </div>
      </form>
      <p className="text-xs text-[var(--pv-text-muted)]">
        Closing this dialog keeps your draft while you stay on this page. Sending does not resolve
        the feedback.
      </p>
      <div className="space-y-3" aria-label="Conversation history">
        <h3 className="font-semibold">Conversation</h3>
        {historyLoading && (
          <p role="status" className="text-sm">
            Loading conversation…
          </p>
        )}
        {historyError && (
          <p role="alert" className="text-sm">
            {historyError}{' '}
            <button className="underline" onClick={() => void loadHistory()}>
              Retry history
            </button>
          </p>
        )}
        {!historyLoading && !historyError && messages.length === 0 && (
          <p className="text-sm text-[var(--pv-text-muted)]">No replies yet.</p>
        )}
        {messages.map((message) => (
          <article
            key={message.id}
            className="rounded-lg border border-[var(--pv-border)] bg-[var(--pv-surface)] p-3 text-sm"
          >
            <p className="font-medium">
              {message.direction === 'outbound' ? 'Domani' : message.author.email} ·{' '}
              {message.delivery_status}
            </p>
            <p className="font-medium">{message.subject}</p>
            <p className="whitespace-pre-wrap break-words">{message.text}</p>
          </article>
        ))}
        {cursor && (
          <button
            className={buttonClass}
            disabled={historyLoading}
            onClick={() => void loadHistory(cursor)}
          >
            Load more replies
          </button>
        )}
      </div>
    </section>
  );
}
