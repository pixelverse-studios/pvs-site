import { getApiBaseUrl } from '@/lib/api-config';
import type { UserProfile, UsersListResponse, UsersQueryParams } from '@/lib/types/domani-users';

/**
 * Fetch Domani users with optional filters
 */
export async function getDomaniUsers(params?: UsersQueryParams): Promise<UsersListResponse> {
  const searchParams = new URLSearchParams();

  if (params?.tier) searchParams.set('tier', params.tier);
  if (params?.cohort) searchParams.set('cohort', params.cohort);
  if (params?.include_deleted !== undefined)
    searchParams.set('include_deleted', String(params.include_deleted));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const url = `${getApiBaseUrl()}/api/domani/users?${searchParams}`;
  console.log('[API] GET', url);
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    console.error('[API] Failed:', res.status, res.statusText);
    throw new Error('Failed to fetch Domani users');
  }

  const data = await res.json();
  console.log('[API] Response:', data.items?.length ?? 0, 'users');
  return data;
}

/**
 * Get a single user profile by ID
 */
export async function getDomaniUser(id: string): Promise<UserProfile> {
  const res = await fetch(`${getApiBaseUrl()}/api/domani/users/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return res.json();
}

/**
 * Get user statistics
 */
export async function getDomaniUserStats(): Promise<{
  total: number;
  active: number;
  deleted: number;
  by_tier: Record<string, number>;
  by_cohort: Record<string, number>;
  by_signup_method: Record<string, number>;
}> {
  const res = await fetch(`${getApiBaseUrl()}/api/domani/users/stats`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user stats');
  }

  return res.json();
}
