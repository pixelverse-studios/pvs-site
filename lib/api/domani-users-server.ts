import 'server-only';
import { feedbackAccessToken } from './feedback-server';
import { getApiBaseUrl } from '@/lib/api-config';
import { usersQuery } from './domani-users-query';
import type { UsersListResponse, UsersQueryParams, UserStats } from '@/lib/types/domani-users';
async function read<T>(path: string): Promise<T> {
  const token = await feedbackAccessToken();
  if (!token) throw new Error('Your session has expired.');
  const res = await fetch(new URL(`/api/domani/users${path}`, getApiBaseUrl()), {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error('User insights unavailable');
  return res.json();
}
export const getServerDomaniUsers = (params: UsersQueryParams) =>
  read<UsersListResponse>(`?${usersQuery(params)}`);
export const getServerDomaniUserStats = () => read<UserStats>('/stats');
