import { getApiBaseUrl } from '@/lib/api-config';
import { createClient } from '@/lib/supabase/client';
import { usersQuery } from './domani-users-query';
import { requireUsersList, requireUserStats, requireUserDetail } from './domani-users-contract';
import type { UsersQueryParams } from '@/lib/types/domani-users';
export class UsersRequestError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
  }
}

type UsersApiErrorBody = {
  error?: { code?: unknown; message?: unknown };
  message?: unknown;
};

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
  if (!response.ok) {
    const body = (await response
      .clone()
      .json()
      .catch(() => null)) as UsersApiErrorBody | null;
    const code = typeof body?.error?.code === 'string' ? body.error.code : undefined;
    throw new UsersRequestError(
      code === 'ORIGIN_NOT_ALLOWED'
        ? 'This dashboard origin is not allowed by the local API configuration.'
        : code === 'STAFF_ACCESS_REQUIRED'
          ? 'You do not have staff access to Users.'
          : response.status === 403
            ? 'The Users request was rejected by the API.'
            : response.status === 401
              ? 'Your session has expired. Please sign in again.'
              : response.status === 400
                ? 'Check the selected filters and date range.'
                : 'User insights unavailable. Please try again.',
      response.status,
      code,
    );
  }
  return response.json();
}
export const getDomaniUsers = (params?: UsersQueryParams, signal?: AbortSignal) =>
  read<unknown>(`?${usersQuery(params)}`, signal).then(requireUsersList);
export const getDomaniUser = (id: string, signal?: AbortSignal) =>
  read<unknown>(`/${encodeURIComponent(id)}`, signal).then((value) => requireUserDetail(value, id));
export const getDomaniUserStats = () => read<unknown>('/stats').then(requireUserStats);
