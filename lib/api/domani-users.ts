import { getApiBaseUrl } from '@/lib/api-config';
import { createClient } from '@/lib/supabase/client';
import { usersQuery } from './domani-users-query';
import { requireUsersList, requireUserStats } from './domani-users-contract';
import type { UserProfile, UsersQueryParams } from '@/lib/types/domani-users';
export class UsersRequestError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
async function read<T>(path: string, signal?: AbortSignal): Promise<T> {
  signal?.throwIfAborted();
  const { data, error } = await createClient().auth.getSession();
  signal?.throwIfAborted();
  if (error || !data.session?.access_token)
    throw new UsersRequestError('Your session has expired. Please sign in again.', 401);
  const response = await fetch(new URL(`/api/domani/users${path}`, getApiBaseUrl()), {
    headers: { Authorization: `Bearer ${data.session.access_token}` },
    cache: 'no-store',
    credentials: 'omit',
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(15000)])
      : AbortSignal.timeout(15000),
  });
  if (!response.ok)
    throw new UsersRequestError(
      response.status === 403
        ? 'You do not have staff access to Users.'
        : response.status === 401
          ? 'Your session has expired. Please sign in again.'
          : response.status === 400
            ? 'Check the selected filters and date range.'
            : 'User insights unavailable. Please try again.',
      response.status,
    );
  return response.json();
}
export const getDomaniUsers = (params?: UsersQueryParams, signal?: AbortSignal) =>
  read<unknown>(`?${usersQuery(params)}`, signal).then(requireUsersList);
export const getDomaniUser = (id: string) => read<UserProfile>(`/${encodeURIComponent(id)}`);
export const getDomaniUserStats = () => read<unknown>('/stats').then(requireUserStats);
