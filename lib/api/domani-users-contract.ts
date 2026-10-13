import { z } from 'zod';
import type { UserProfile, UsersListResponse, UserStats } from '@/lib/types/domani-users';

const count = z.number().int().nonnegative();
const timestamp = z.string().datetime({ offset: true });
const nullableTimestamp = timestamp.nullable();
const nullableString = z.string().nullable();
const device = z.object({
  source_id: z.string(),
  source: z.enum(['feedback', 'support']),
  observed_at: nullableTimestamp,
  platform: nullableString,
  device_brand: nullableString,
  device_model: nullableString,
  os_version: nullableString,
  app_version: nullableString,
  app_build: nullableString,
});
const user = z.object({
  id: z.string().uuid(),
  email: nullableString,
  full_name: nullableString,
  signup_cohort: z.enum(['friends_family', 'early_adopter', 'general']).nullable(),
  signup_method: nullableString,
  timezone: nullableString,
  created_at: nullableTimestamp,
  profile_created_at: nullableTimestamp,
  joined_at: nullableTimestamp,
  last_sign_in_at: nullableTimestamp,
  last_active_at: nullableTimestamp,
  activity_source: nullableString,
  deleted_at: nullableTimestamp,
  deletion_scheduled_for: nullableTimestamp,
  email_confirmed_at: nullableTimestamp,
  email_verification_status: z.enum(['verified', 'unverified', 'unknown']),
  account_status: z.enum(['active', 'deletion_pending', 'deleted', 'banned', 'unknown']),
  login_providers: z.array(z.string()),
  latest_device_observation: device.nullable(),
  feedback_count: count,
});
const stats = z.object({
  total: count,
  non_deleted: count,
  deleted: count,
  active_30d: count,
  activity_unknown: count,
  activity_window_days: z.number().int().positive(),
});
const list = z.object({
  items: z.array(user),
  total: count,
  limit: z.number().int().positive(),
  offset: count,
  stats,
  data_as_of: timestamp,
});
const message =
  'The server returned an incompatible Users response. Update or restart the API with the Users insights migration applied, then retry.';

export function requireUsersList(value: unknown): UsersListResponse {
  if (!list.safeParse(value).success) throw new Error(message);
  return value as UsersListResponse;
}

export function requireUserStats(value: unknown): UserStats {
  if (!stats.extend({ data_as_of: timestamp }).safeParse(value).success) throw new Error(message);
  return value as UserStats;
}

export function requireUserDetail(value: unknown, id: string): UserProfile {
  const result = user.extend({ id: z.literal(id), data_as_of: timestamp }).safeParse(value);
  if (!result.success) throw new Error(message);
  return value as UserProfile;
}
