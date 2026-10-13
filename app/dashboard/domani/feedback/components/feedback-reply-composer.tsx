'use client';
import { TextInput, Textarea } from '@mantine/core';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { UnifiedFeedbackItem } from '@/lib/types/feedback';
import {
  FeedbackRequestError,
  getFeedbackReplyState,
  retryFeedbackReply,
  sendFeedbackReply,
  type FeedbackReplyState,
} from '@/lib/api/feedback';

import { FeedbackConversationHistory } from './feedback-conversation-history';
import { emptyReplyDraft, type ReplyDraft } from '@/lib/feedback-reply-draft';
export { emptyReplyDraft, hasUnsentReply, type ReplyDraft } from '@/lib/feedback-reply-draft';
const accepted = (result?: FeedbackReplyState) =>
  !!result &&
  ['accepted', 'delayed', 'delivered', 'bounced', 'complained'].includes(result.delivery_status);
export function FeedbackReplyComposer({
  item,
  draft,
  onChange,
  onHistoryChanged,
}: {
  item: UnifiedFeedbackItem;
  draft: ReplyDraft;
  onChange: (draft: ReplyDraft) => void;
  onHistoryChanged?: () => void;
}) {
  const [historyRevision, setHistoryRevision] = useState(0);
  const [checking, setChecking] = useState(false);
  const lock = useRef(false);
  const mounted = useRef(true);
  const current = useRef(draft);
  current.current = draft;
  const callback = useRef(onChange);
  callback.current = onChange;
  const change = useCallback((next: ReplyDraft) => {
    current.current = next;
    callback.current(next);
  }, []);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      // A remounted composer must reconcile a request still running elsewhere,
      // rather than remain permanently pending or offer a duplicate send.
      if (current.current.phase === 'pending') {
        change({ ...current.current, phase: 'unknown' });
      }
    };
  }, [change]);
  const recipientValid =
    !!item.email && item.email.length <= 320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email);
  const locked = draft.phase !== 'draft';

  const loadHistory = useCallback(() => {
    setHistoryRevision((value) => value + 1);
    onHistoryChanged?.();
  }, [onHistoryChanged]);

  const syncReplyState = useCallback(
    (key: string, result: FeedbackReplyState) => {
      const snapshot = current.current;
      // A history action may finish after the staff member starts another draft.
      if (snapshot.key !== key || snapshot.phase === 'draft' || snapshot.phase === 'pending')
        return;
      change({ ...snapshot, result, phase: 'submitted', error: undefined, missingIntent: false });
    },
    [change],
  );

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
    const pending: ReplyDraft = { ...snapshot, key, phase: 'pending', error: undefined };
    change(pending);
    try {
      const result = retry
        ? await retryFeedbackReply(item.id, item.source, key)
        : await sendFeedbackReply(item.id, item.source, {
            subject: snapshot.subject,
            text: snapshot.text,
            request_key: key,
          });
      if (!mounted.current || current.current !== pending) return;
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
      if (!mounted.current || current.current !== pending) return;
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
      if (!mounted.current || current.current !== snapshot) return;
      change({ ...snapshot, result, phase: 'submitted', error: undefined, missingIntent: false });
      if (accepted(result) && !accepted(snapshot.result)) void loadHistory();
    } catch (error) {
      if (!mounted.current || current.current !== snapshot) return;
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
          : status === 'delayed'
            ? 'Delivery delayed. The email provider will keep trying.'
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
          <TextInput
            aria-label="Reply subject"
            classNames={{ input: fieldClass }}
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
          <Textarea
            aria-label="Reply message"
            classNames={{ input: fieldClass }}
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
              disabled={checking}
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
          {draft.phase !== 'pending' && accepted(draft.result) && (
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
        Drafts stay in this tab while you navigate. Reloading, closing the tab, or signing out
        clears them. Sending does not resolve the feedback.
      </p>
      <FeedbackConversationHistory
        item={item}
        revision={historyRevision}
        onChanged={onHistoryChanged}
        onReplyState={syncReplyState}
      />
    </section>
  );
}
