import type {
  UnifiedFeedbackItem,
  FeedbackListResponse,
  FeedbackQueryParams,
  FeedbackSource,
  FeedbackStats,
  WritableFeedbackStatus,
} from '@/lib/types/feedback';

export function feedbackQuery(params: FeedbackQueryParams = {}): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') query.set(key, String(value));
  }
  return query.toString();
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/domani/feedback${path}`, { ...options, cache: 'no-store' });
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
