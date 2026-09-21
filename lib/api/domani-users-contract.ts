import { z } from 'zod';
import type { UsersListResponse, UserStats } from '@/lib/types/domani-users';

const count = z.number().int().nonnegative();
const stats = z.object({
  total: count,
  non_deleted: count,
  deleted: count,
  active_30d: count,
  activity_unknown: count,
  activity_window_days: z.number().int().positive(),
});
const freshness = z.string().datetime({ offset: true });
const list = z.object({
  items: z.array(z.object({ id: z.string() })),
  total: count,
  limit: z.number().int().positive(),
  offset: count,
  stats,
  data_as_of: freshness,
});
const message =
  'The server returned an incompatible Users response. Update or restart the API with the Users insights migration applied, then retry.';

export function requireUsersList(value: unknown): UsersListResponse {
  if (!list.safeParse(value).success) throw new Error(message);
  return value as UsersListResponse;
}

export function requireUserStats(value: unknown): UserStats {
  if (!stats.extend({ data_as_of: freshness }).safeParse(value).success) throw new Error(message);
  return value as UserStats;
}

export function requireUserDetail(value: unknown, id: string) {
  const result = z.object({ id: z.literal(id), data_as_of: freshness }).safeParse(value);
  if (!result.success) throw new Error(message);
  return value as import('@/lib/types/domani-users').UserProfile;
}
