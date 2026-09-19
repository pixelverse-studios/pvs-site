import { createClient } from '@/lib/supabase/client';
import { getApiBaseUrl } from '@/lib/api-config';
import { feedbackQuery } from './feedback-query';
export { feedbackQuery } from './feedback-query';
import type {
  UnifiedFeedbackItem,
  FeedbackListResponse,
  FeedbackQueryParams,
  FeedbackSource,
  FeedbackStats,
  WritableFeedbackStatus,
} from '@/lib/types/feedback';

export class FeedbackRequestError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
  }
}
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  options.signal?.throwIfAborted();
  // Read the current browser session; the API independently verifies this token
  // and staff membership. Session contents are not an authorization decision.
  const { data, error } = await createClient().auth.getSession();
  options.signal?.throwIfAborted();
  if (error || !data.session?.access_token)
    throw new FeedbackRequestError('Your session has expired. Please sign in again.', 401);
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${data.session.access_token}`);
  const response = await fetch(new URL(`/api/domani/feedback${path}`, getApiBaseUrl()), {
    ...options,
    headers,
    credentials: 'omit',
    cache: 'no-store',
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const code = body?.error?.code;
    const safe: Record<string, string> = {
      SENDING_DISABLED: 'Feedback email sending is not enabled yet. Your draft is saved here.',
      RECIPIENT_UNAVAILABLE: 'This feedback has no usable recipient email.',
      REPLY_CONFLICT: 'This reply cannot be changed or retried. Check its status.',
      INVALID_REQUEST: 'Check the subject and message length before sending.',
    };
    throw new FeedbackRequestError(
      response.status === 403
        ? 'You do not have staff access to feedback.'
        : response.status === 401
          ? 'Your session has expired. Please sign in again.'
          : safe[code] || 'Feedback service unavailable. Please try again.',
      response.status,
      code,
    );
  }
  return response.json();
}

export function getFeedbackItems(
  params?: FeedbackQueryParams,
  signal?: AbortSignal,
): Promise<FeedbackListResponse> {
  return request(`?${feedbackQuery(params)}`, { signal });
}
export function getFeedbackItem(id: string, source: FeedbackSource): Promise<UnifiedFeedbackItem> {
  return request(`/${source}/${encodeURIComponent(id)}`);
}
export function updateFeedbackStatus(
  id: string,
  source: FeedbackSource,
  status: WritableFeedbackStatus,
): Promise<UnifiedFeedbackItem> {
  return request(`/${source}/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}
export function getFeedbackStats(): Promise<FeedbackStats> {
  return request('/stats');
}

export interface FeedbackReplyState {
  message_id: string;
  request_key: string;
  subject: string;
  text: string;
  delivery_status:
    | 'queued'
    | 'sending'
    | 'accepted'
    | 'delayed'
    | 'delivered'
    | 'failed'
    | 'unknown'
    | 'bounced'
    | 'complained';
  can_retry: boolean;
  needs_reconciliation: boolean;
  error_code: string | null;
}
export interface FeedbackMessage {
  id: string;
  direction: 'inbound' | 'outbound';
  subject: string;
  text: string;
  author: { id: string | null; email: string };
  created_at: string;
  delivery_status: string;
  delivery_event_at?: string | null;
  sender_email?: string;
  recipient_email?: string;
  request_key?: string | null;
  can_retry?: boolean;
  needs_reconciliation?: boolean;
}
export const getFeedbackMessages = (
  id: string,
  source: FeedbackSource,
  page?: string | { before?: string; latest: true },
) => {
  const params = new URLSearchParams({ limit: '20' });
  if (typeof page === 'string') params.set('after', page);
  else if (page) {
    params.set('latest', 'true');
    if (page.before) params.set('before', page.before);
  }
  return request<{
    items: FeedbackMessage[];
    next_cursor: string | null;
    previous_cursor?: string | null;
  }>(`/${source}/${encodeURIComponent(id)}/messages?${params}`, {
    signal: AbortSignal.timeout(15000),
  });
};
export const reconcileFeedbackReply = (id: string, source: FeedbackSource, key: string) =>
  request<FeedbackReplyState>(
    `/${source}/${encodeURIComponent(id)}/replies/${encodeURIComponent(key)}/reconcile`,
    {
      method: 'POST',
      signal: AbortSignal.timeout(15000),
    },
  );
export const sendFeedbackReply = (
  id: string,
  source: FeedbackSource,
  body: { subject: string; text: string; request_key: string },
) =>
  request<FeedbackReplyState>(`/${source}/${encodeURIComponent(id)}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });
export const getFeedbackReplyState = (id: string, source: FeedbackSource, key: string) =>
  request<FeedbackReplyState>(
    `/${source}/${encodeURIComponent(id)}/replies/${encodeURIComponent(key)}`,
  );
export const retryFeedbackReply = (id: string, source: FeedbackSource, key: string) =>
  request<FeedbackReplyState>(
    `/${source}/${encodeURIComponent(id)}/replies/${encodeURIComponent(key)}/retry`,
    { method: 'POST', signal: AbortSignal.timeout(20000) },
  );
