import type { UsersQueryParams } from '@/lib/types/domani-users';
export function usersQuery(params: UsersQueryParams = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params))
    if (value !== undefined && value !== '') query.set(key, String(value));
  return query.toString();
}
