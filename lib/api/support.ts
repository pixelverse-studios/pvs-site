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
  console.log('[API] GET', url);
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    console.error('[API] Failed:', res.status, res.statusText);
    throw new Error('Failed to fetch support requests');
  }

  const data = await res.json();
  console.log('[API] Response:', data.items?.length ?? 0, 'support requests');
  return data;
}

/**
 * Get a single support request by ID
 */
export async function getSupportRequest(id: string): Promise<SupportRequest> {
  const url = `${getApiBaseUrl()}/api/domani/support/${id}`;
  console.log('[API] GET', url);
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    console.error('[API] Failed:', res.status, res.statusText);
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
  console.log('[API] PATCH', url);
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    console.error('[API] Failed:', res.status, res.statusText);
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
  console.log('[API] GET', url);
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    console.error('[API] Failed:', res.status, res.statusText);
    throw new Error('Failed to fetch support stats');
  }

  return res.json();
}
