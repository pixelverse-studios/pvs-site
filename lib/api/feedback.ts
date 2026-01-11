import { getApiBaseUrl } from '@/lib/api-config';
import type {
  UnifiedFeedbackItem,
  FeedbackListResponse,
  FeedbackQueryParams,
  FeedbackStatus,
} from '@/lib/types/feedback';

/**
 * Fetch combined feedback and support requests
 */
export async function getFeedbackItems(
  params?: FeedbackQueryParams,
): Promise<FeedbackListResponse> {
  const searchParams = new URLSearchParams();

  if (params?.category) searchParams.set('category', params.category);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.platform) searchParams.set('platform', params.platform);
  if (params?.source) searchParams.set('source', params.source);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.start_date) searchParams.set('start_date', params.start_date);
  if (params?.end_date) searchParams.set('end_date', params.end_date);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));
  if (params?.sort_by) searchParams.set('sort_by', params.sort_by);
  if (params?.sort_order) searchParams.set('sort_order', params.sort_order);

  const url = `${getApiBaseUrl()}/api/domani/feedback?${searchParams}`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch feedback items');
  }

  return res.json();
}

/**
 * Get a single feedback item by ID
 */
export async function getFeedbackItem(id: string): Promise<UnifiedFeedbackItem> {
  const res = await fetch(`${getApiBaseUrl()}/api/domani/feedback/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch feedback item');
  }

  return res.json();
}

/**
 * Update feedback status (works for both beta_feedback and support_requests)
 */
export async function updateFeedbackStatus(
  id: string,
  source: 'beta_feedback' | 'support_request',
  status: FeedbackStatus,
): Promise<UnifiedFeedbackItem> {
  const res = await fetch(`${getApiBaseUrl()}/api/domani/feedback/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, status }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update feedback status');
  }

  return res.json();
}

/**
 * Get feedback statistics (counts by status, category, etc.)
 */
export async function getFeedbackStats(): Promise<{
  total: number;
  by_status: Record<FeedbackStatus, number>;
  by_category: Record<string, number>;
  by_platform: Record<string, number>;
}> {
  const res = await fetch(`${getApiBaseUrl()}/api/domani/feedback/stats`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch feedback stats');
  }

  return res.json();
}
