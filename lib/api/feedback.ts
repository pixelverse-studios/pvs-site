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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  options.signal?.throwIfAborted();
  // Read the current browser session; the API independently verifies this token
  // and staff membership. Session contents are not an authorization decision.
  const { data, error } = await createClient().auth.getSession();
  options.signal?.throwIfAborted();
  if (error || !data.session?.access_token)
    throw new Error('Your session has expired. Please sign in again.');
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${data.session.access_token}`);
  const response = await fetch(new URL(`/api/domani/feedback${path}`, getApiBaseUrl()), {
    ...options,
    headers,
    credentials: 'omit',
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(
      response.status === 403
        ? 'You do not have staff access to feedback.'
        : response.status === 401
          ? 'Your session has expired. Please sign in again.'
          : 'Feedback service unavailable. Please try again.',
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
