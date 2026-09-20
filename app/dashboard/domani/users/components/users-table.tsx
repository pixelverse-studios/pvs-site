'use client';
import React from 'react';
import type { UserProfile } from '@/lib/types/domani-users';
export const USER_COLUMNS = {
  joined: 'Joined',
  activity: 'Last app activity',
  signin: 'Last sign-in',
  providers: 'Login providers',
  device: 'Last reported device',
  status: 'Account status',
  cohort: 'Cohort',
  timezone: 'Timezone',
  verification: 'Email verification',
  signup: 'Original signup method',
  os: 'Reported OS',
  version: 'Reported app version / build',
  observed: 'Device reported at',
  source: 'Device source',
};
export type UserColumn = keyof typeof USER_COLUMNS;
export const DEFAULT_COLUMNS: UserColumn[] = [
  'joined',
  'activity',
  'signin',
  'providers',
  'device',
  'status',
];
export function ExactDate({ value }: { value?: string | null }) {
  if (!value || !Number.isFinite(Date.parse(value)))
    return <span className="text-[var(--pv-text-muted)]">Not recorded</span>;
  const iso = new Date(value).toISOString();
  return (
    <time dateTime={iso} title={iso}>
      {iso.slice(0, 10)}
      <span className="block text-xs text-[var(--pv-text-muted)]">{iso.slice(11, 19)} UTC</span>
    </time>
  );
}
const label = (value?: string | null) => (value ? value.replaceAll('_', ' ') : 'Unknown');
function cell(user: UserProfile, column: UserColumn): React.ReactNode {
  const d = user.latest_device_observation;
  switch (column) {
    case 'joined':
      return <ExactDate value={user.joined_at} />;
    case 'activity':
      return <ExactDate value={user.last_active_at} />;
    case 'signin':
      return <ExactDate value={user.last_sign_in_at} />;
    case 'providers':
      return user.login_providers?.length ? user.login_providers.join(', ') : 'Not recorded';
    case 'device':
      return d ? (
        <>
          <span>
            {[d.device_brand, d.device_model].filter(Boolean).join(' ') || 'Model unknown'}
          </span>
          <span className="mt-1 block text-xs text-[var(--pv-text-muted)]">
            {label(d.platform)} · {label(d.source)} snapshot
          </span>
          <ExactDate value={d.observed_at} />
        </>
      ) : (
        'Not recorded'
      );
    case 'status':
      return (
        <span className="rounded-md bg-[var(--pv-surface)] px-2 py-1 capitalize">
          {label(user.account_status)}
        </span>
      );
    case 'cohort':
      return label(user.signup_cohort);
    case 'timezone':
      return user.timezone || 'Not recorded';
    case 'verification':
      return label(user.email_verification_status);
    case 'signup':
      return label(user.signup_method);
    case 'os':
      return d?.os_version || 'Not recorded';
    case 'version':
      return d ? `${d.app_version || 'Unknown'} / ${d.app_build || 'Unknown'}` : 'Not recorded';
    case 'observed':
      return <ExactDate value={d?.observed_at} />;
    case 'source':
      return d ? label(d.source) : 'Not recorded';
  }
}
export function UsersTable({ items, columns }: { items: UserProfile[]; columns: UserColumn[] }) {
  if (!items.length)
    return (
      <div className="rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] px-6 py-16 text-center">
        <p className="font-medium">No users match these filters</p>
        <p className="mt-2 text-sm text-[var(--pv-text-muted)]">
          Adjust your search or clear the filters.
        </p>
      </div>
    );
  return (
    <div
      className="overflow-x-auto rounded-xl border border-[var(--pv-border)]"
      role="region"
      aria-label="Users table, scroll horizontally for more columns"
      tabIndex={0}
    >
      <table className="w-full text-left text-sm">
        <caption className="sr-only">
          Domani user account, login, activity and historical device insights. All timestamps are
          UTC.
        </caption>
        <thead className="bg-[var(--pv-surface)] text-xs text-[var(--pv-text-muted)]">
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-10 min-w-[220px] bg-[var(--pv-surface)] px-4 py-3"
            >
              User
            </th>
            {columns.map((c) => (
              <th key={c} scope="col" className="whitespace-nowrap px-4 py-3 font-medium">
                {USER_COLUMNS[c]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((user) => (
            <tr key={user.id} className="border-t border-[var(--pv-border)]">
              <th
                scope="row"
                className="sticky left-0 z-10 bg-[var(--pv-bg)] px-4 py-4 font-normal"
              >
                <div className="max-w-[260px] break-words font-medium">
                  {user.full_name || 'Name not recorded'}
                </div>
                <div className="mt-1 max-w-[260px] break-words text-xs text-[var(--pv-text-muted)]">
                  {user.email || 'Email unavailable'}
                </div>
              </th>
              {columns.map((c) => (
                <td key={c} className="min-w-[160px] whitespace-nowrap px-4 py-4 align-top">
                  {cell(user, c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
