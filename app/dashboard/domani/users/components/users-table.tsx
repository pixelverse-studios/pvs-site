'use client';

import { UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/lib/types/domani-users';
import { TIER_COLORS, COHORT_COLORS, SIGNUP_METHOD_LABELS } from '@/lib/types/domani-users';

interface UsersTableProps {
  items: UserProfile[];
}

export function UsersTable({ items }: UsersTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (items.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl border py-16"
        style={{ borderColor: 'var(--pv-border)', background: 'var(--pv-surface)' }}
      >
        <UserCircle className="mb-4 h-12 w-12 text-[var(--pv-text-muted)]" />
        <p className="text-lg font-medium" style={{ color: 'var(--pv-text)' }}>
          No users found
        </p>
        <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
          Domani users will appear here
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div
        className="hidden overflow-hidden rounded-xl border md:block"
        style={{ borderColor: 'var(--pv-border)' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--pv-surface)' }}>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
                Tier
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
                Cohort
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
                Signup
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const tierConfig = TIER_COLORS[item.tier];
              const cohortConfig = COHORT_COLORS[item.signup_cohort];
              const isDeleted = !!item.deleted_at;

              return (
                <tr
                  key={item.id}
                  className={cn(
                    'border-t transition-colors hover:bg-[var(--pv-surface)]',
                    isDeleted && 'opacity-50',
                  )}
                  style={{ borderColor: 'var(--pv-border)' }}
                >
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--pv-text)' }}>
                    <span className={cn(isDeleted && 'line-through')}>{item.email}</span>
                    {isDeleted && (
                      <span className="ml-2 text-xs text-red-500 dark:text-red-400">(deleted)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--pv-text-muted)]">
                    {item.full_name || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                        tierConfig.bgColor,
                        tierConfig.color,
                      )}
                    >
                      {tierConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                        cohortConfig.bgColor,
                        cohortConfig.color,
                      )}
                    >
                      {cohortConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--pv-text-muted)]">
                    {SIGNUP_METHOD_LABELS[item.signup_method] || item.signup_method}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--pv-text-muted)]">
                    {formatDate(item.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {items.map((item) => {
          const tierConfig = TIER_COLORS[item.tier];
          const cohortConfig = COHORT_COLORS[item.signup_cohort];
          const isDeleted = !!item.deleted_at;

          return (
            <div
              key={item.id}
              className={cn(
                'rounded-xl border p-4',
                isDeleted && 'opacity-50',
              )}
              style={{ borderColor: 'var(--pv-border)', background: 'var(--pv-surface)' }}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                      tierConfig.bgColor,
                      tierConfig.color,
                    )}
                  >
                    {tierConfig.label}
                  </span>
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                      cohortConfig.bgColor,
                      cohortConfig.color,
                    )}
                  >
                    {cohortConfig.label}
                  </span>
                </div>
                {isDeleted && (
                  <span className="text-xs text-red-500 dark:text-red-400">Deleted</span>
                )}
              </div>
              <p
                className={cn('mb-1 text-sm font-medium', isDeleted && 'line-through')}
                style={{ color: 'var(--pv-text)' }}
              >
                {item.email}
              </p>
              {item.full_name && (
                <p className="mb-2 text-sm text-[var(--pv-text-muted)]">{item.full_name}</p>
              )}
              <div className="flex items-center justify-between text-xs text-[var(--pv-text-muted)]">
                <span>
                  via {SIGNUP_METHOD_LABELS[item.signup_method] || item.signup_method}
                </span>
                <span>Joined {formatDate(item.created_at)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
