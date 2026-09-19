'use client';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  getFeedbackMessages,
  reconcileFeedbackReply,
  retryFeedbackReply,
  type FeedbackMessage,
  type FeedbackReplyState,
} from '@/lib/api/feedback';
import { feedbackDelivery } from '@/lib/feedback-delivery';
import type { UnifiedFeedbackItem } from '@/lib/types/feedback';

const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const date = (value: string) =>
  Number.isFinite(Date.parse(value)) ? new Date(value).toLocaleString() : 'Unknown time';
export function FeedbackConversationHistory({
  item,
  revision,
  onChanged,
  onReplyState,
}: {
  item: UnifiedFeedbackItem;
  revision: number;
  onChanged?: () => void;
  onReplyState?: (key: string, result: FeedbackReplyState) => void;
}) {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const [previous, setPrevious] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string>();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [allCollapsed, setAllCollapsed] = useState(false);
  const allCollapsedRef = useRef(false);
  const request = useRef(0);
  const alive = useRef(true);
  const actionLock = useRef(false);
  const loadingRef = useRef(false);
  const region = useRef<HTMLDivElement>(null);
  const initialScroll = useRef(false);
  const scrollRestore = useRef<{ node: HTMLElement; top: number; height: number }>();
  const control =
    'rounded-lg border border-[var(--pv-border)] px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--pv-primary)] disabled:opacity-50';
  const load = useCallback(
    async (before?: string) => {
      const version = ++request.current;
      loadingRef.current = true;
      setLoading(true);
      setError('');
      try {
        const current = messagesRef.current;
        const oldest = current[0]?.id;
        let page = await getFeedbackMessages(item.id, item.source, { latest: true, before });
        let incoming = page.items;
        // Refresh all loaded messages, including new messages since the last page.
        // First open reads just the newest page; older pages load only on demand.
        while (
          !before &&
          oldest &&
          !incoming.some((m) => m.id === oldest) &&
          page.previous_cursor
        ) {
          if (!alive.current || version !== request.current) return;
          page = await getFeedbackMessages(item.id, item.source, {
            latest: true,
            before: page.previous_cursor,
          });
          incoming = [...page.items, ...incoming];
        }
        if (!alive.current || version !== request.current) return;
        let previousCursor = page.previous_cursor || null;
        if (!before && oldest) {
          const boundary = incoming.findIndex((message) => message.id === oldest);
          if (boundary > 0) {
            incoming = incoming.slice(boundary);
            previousCursor = oldest;
          }
        }
        if (before) {
          const scroll = region.current?.closest<HTMLElement>('[data-feedback-scroll]');
          if (scroll)
            scrollRestore.current = {
              node: scroll,
              top: scroll.scrollTop,
              height: scroll.scrollHeight,
            };
        }
        const seen = new Set(incoming.map((m) => m.id));
        setMessages(before ? [...incoming, ...current.filter((m) => !seen.has(m.id))] : incoming);
        if (allCollapsedRef.current)
          setCollapsed((ids) => new Set([...Array.from(ids), ...incoming.map((m) => m.id)]));
        setPrevious(previousCursor);
      } catch (failure) {
        if (alive.current && version === request.current)
          setError(failure instanceof Error ? failure.message : 'Conversation unavailable.');
      } finally {
        if (alive.current && version === request.current) {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    },
    [item.id, item.source],
  );
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      request.current++;
    };
  }, []);
  useEffect(() => {
    void load();
  }, [load, revision]);
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible' && !actionLock.current && !loadingRef.current)
        void load();
    }, 30000);
    return () => clearInterval(timer);
  }, [load]);
  useClientLayoutEffect(() => {
    const restore = scrollRestore.current;
    if (restore) {
      restore.node.scrollTop = restore.top + restore.node.scrollHeight - restore.height;
      scrollRestore.current = undefined;
    } else if (messages.length && !initialScroll.current) {
      initialScroll.current = true;
      if (
        !(document.activeElement instanceof HTMLInputElement) &&
        !(document.activeElement instanceof HTMLTextAreaElement)
      ) {
        region.current
          ?.querySelector<HTMLElement>('article:last-of-type')
          ?.scrollIntoView?.({ block: 'end' });
      }
    }
  }, [messages]);
  async function action(message: FeedbackMessage, retry: boolean) {
    if (!message.request_key || actionLock.current) return;
    actionLock.current = true;
    setBusy(message.id);
    setError('');
    try {
      const result = await (retry ? retryFeedbackReply : reconcileFeedbackReply)(
        item.id,
        item.source,
        message.request_key,
      );
      if (alive.current) {
        onReplyState?.(message.request_key, result);
        await load();
        onChanged?.();
      }
    } catch (failure) {
      if (alive.current)
        setError(failure instanceof Error ? failure.message : 'Could not check this reply.');
    } finally {
      actionLock.current = false;
      if (alive.current) setBusy(undefined);
    }
  }
  return (
    <div ref={region} className="space-y-3" aria-label="Conversation history">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">Conversation</h3>
        <button type="button" className={control} disabled={loading} onClick={() => void load()}>
          Refresh history
        </button>
      </div>
      {messages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={control}
            onClick={() => {
              allCollapsedRef.current = false;
              setAllCollapsed(false);
              setCollapsed(new Set());
            }}
          >
            Expand all
          </button>
          <button
            type="button"
            className={control}
            onClick={() => {
              allCollapsedRef.current = true;
              setAllCollapsed(true);
              setCollapsed(new Set(messages.map((m) => m.id)));
            }}
          >
            Collapse all
          </button>
        </div>
      )}
      {loading && (
        <p role="status" className="text-sm text-[var(--pv-text-muted)]">
          Refreshing conversation…
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}{' '}
          <button type="button" className="underline" onClick={() => void load()}>
            Retry history
          </button>
        </p>
      )}
      {!loading && !error && messages.length === 0 && (
        <p className="text-sm text-[var(--pv-text-muted)]">No replies yet.</p>
      )}
      {previous && (
        <button
          type="button"
          className={control}
          disabled={loading}
          onClick={() => void load(previous)}
        >
          Load earlier replies
        </button>
      )}
      {messages.map((message) => {
        const open = !collapsed.has(message.id);
        const delivery = feedbackDelivery(message.delivery_status);
        const contentId = `feedback-message-${item.source}-${message.id}`;
        return (
          <article
            key={message.id}
            className="overflow-hidden rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] text-sm"
          >
            <button
              type="button"
              aria-expanded={open}
              aria-controls={contentId}
              className="flex w-full items-start gap-3 p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--pv-primary)]"
              onClick={() => {
                allCollapsedRef.current = false;
                setAllCollapsed(false);
                setCollapsed((ids) => {
                  const next = new Set(ids);
                  if (next.has(message.id)) next.delete(message.id);
                  else next.add(message.id);
                  return next;
                });
              }}
            >
              <ChevronDown
                aria-hidden
                className={`mt-1 h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none ${open ? '' : '-rotate-90'}`}
              />
              <span className="min-w-0 flex-1 space-y-1">
                <span className="block break-words font-medium">{message.subject}</span>
                <span className="block break-words text-xs text-[var(--pv-text-muted)]">
                  {message.direction === 'outbound' ? 'Reply by' : 'From'} {message.author.email} ·{' '}
                  <time dateTime={message.created_at}>{date(message.created_at)}</time>
                </span>
                <span className="block text-xs font-medium">{delivery.label}</span>
              </span>
            </button>
            <div
              id={contentId}
              hidden={!open}
              className="space-y-3 border-t border-[var(--pv-border)] p-4"
            >
              <p className="break-words text-xs text-[var(--pv-text-muted)]">
                From: {message.sender_email || message.author.email}
                <br />
                To: {message.recipient_email || item.email || 'Unknown recipient'}
              </p>
              <p className="whitespace-pre-wrap break-words">{message.text}</p>
              <p className="text-xs text-[var(--pv-text-muted)]">
                {delivery.detail}
                {message.delivery_event_at && (
                  <>
                    {' '}
                    Updated{' '}
                    <time dateTime={message.delivery_event_at}>
                      {date(message.delivery_event_at)}
                    </time>
                    .
                  </>
                )}
              </p>
              {message.request_key && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={control}
                    disabled={!!busy}
                    onClick={() => void action(message, false)}
                  >
                    {busy === message.id ? 'Checking…' : 'Check status'}
                  </button>
                  {message.can_retry && (
                    <button
                      type="button"
                      className={control}
                      disabled={!!busy}
                      onClick={() => void action(message, true)}
                    >
                      Retry same reply
                    </button>
                  )}
                </div>
              )}
            </div>
          </article>
        );
      })}
      <span className="sr-only" role="status">
        {allCollapsed ? 'All responses collapsed' : ''}
      </span>
    </div>
  );
}
