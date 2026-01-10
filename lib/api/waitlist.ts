import { getApiBaseUrl } from '@/lib/api-config';
import type { WaitlistEntry, WaitlistListResponse, WaitlistQueryParams } from '@/lib/types/waitlist';

/**
 * Fetch waitlist entries with optional filters
 */
export async function getWaitlistEntries(
  params?: WaitlistQueryParams,
): Promise<WaitlistListResponse> {
  const searchParams = new URLSearchParams();

  if (params?.status) searchParams.set('status', params.status);
  if (params?.confirmed !== undefined) searchParams.set('confirmed', String(params.confirmed));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const url = `${getApiBaseUrl()}/api/domani/waitlist?${searchParams}`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch waitlist entries');
  }

  return res.json();
}

/**
 * Get a single waitlist entry by ID
 */
export async function getWaitlistEntry(id: string): Promise<WaitlistEntry> {
  const res = await fetch(`${getApiBaseUrl()}/api/domani/waitlist/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch waitlist entry');
  }

  return res.json();
}

/**
 * Get waitlist statistics
 */
export async function getWaitlistStats(): Promise<{
  total: number;
  confirmed: number;
  unconfirmed: number;
  invited: number;
  by_referral_type: Record<string, number>;
}> {
  const res = await fetch(`${getApiBaseUrl()}/api/domani/waitlist/stats`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch waitlist stats');
  }

  return res.json();
}
