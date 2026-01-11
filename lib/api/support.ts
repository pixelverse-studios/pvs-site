import { getApiBaseUrl } from '@/lib/api-config';
import type { SupportRequest, FeedbackStatus, Platform } from '@/lib/types/feedback';

/**
 * Response type for support requests list
 */
export interface SupportListResponse {
  items: SupportRequest[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Query params for filtering support requests
 */
export interface SupportQueryParams {
  category?: string;
  status?: FeedbackStatus;
  platform?: Platform;
  limit?: number;
  offset?: number;
}

/**
 * Fetch support requests with optional filters
 */
export async function getSupportRequests(
  params?: SupportQueryParams,
): Promise<SupportListResponse> {
  const searchParams = new URLSearchParams();

  if (params?.category) searchParams.set('category', params.category);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.platform) searchParams.set('platform', params.platform);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const url = `${getApiBaseUrl()}/api/domani/support?${searchParams}`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch support requests');
  }

  return res.json();
}

/**
 * Get a single support request by ID
 */
export async function getSupportRequest(id: string): Promise<SupportRequest> {
  const url = `${getApiBaseUrl()}/api/domani/support/${id}`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch support request');
  }

  return res.json();
}

/**
 * Update support request status
 */
export async function updateSupportStatus(
  id: string,
  status: FeedbackStatus,
): Promise<SupportRequest> {
  const url = `${getApiBaseUrl()}/api/domani/support/${id}/status`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update support request status');
  }

  return res.json();
}

/**
 * Get support request statistics
 */
export async function getSupportStats(): Promise<{
  total: number;
  by_status: Record<FeedbackStatus, number>;
  by_category: Record<string, number>;
  by_platform: Record<string, number>;
}> {
  const url = `${getApiBaseUrl()}/api/domani/support/stats`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch support stats');
  }

  return res.json();
}
