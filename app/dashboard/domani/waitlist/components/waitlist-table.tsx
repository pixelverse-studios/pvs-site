'use client';

import { Check, X, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WaitlistEntry } from '@/lib/types/waitlist';
import { WAITLIST_STATUSES, REFERRAL_TYPES } from '@/lib/types/waitlist';

interface WaitlistTableProps {
  items: WaitlistEntry[];
}

export function WaitlistTable({ items }: WaitlistTableProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (items.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl border py-16"
        style={{ borderColor: 'var(--pv-border)', background: 'var(--pv-surface)' }}
      >
        <Users className="mb-4 h-12 w-12 text-[var(--pv-text-muted)]" />
        <p className="text-lg font-medium" style={{ color: 'var(--pv-text)' }}>
          No waitlist entries found
        </p>
        <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
          Waitlist signups will appear here
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
                Referral
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
                Confirmed
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
                Invited
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
                Signed Up
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const statusConfig = WAITLIST_STATUSES[item.status] || WAITLIST_STATUSES.pending;
              const referralConfig = REFERRAL_TYPES[item.referral_type] || REFERRAL_TYPES.organic;

              return (
                <tr
                  key={item.id}
                  className="border-t transition-colors hover:bg-[var(--pv-surface)]"
                  style={{ borderColor: 'var(--pv-border)' }}
                >
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--pv-text)' }}>
                    {item.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--pv-text-muted)]">
                    {item.name || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                        referralConfig.bgColor,
                        referralConfig.color,
                      )}
                    >
                      {referralConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.confirmed ? (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        <Check className="h-4 w-4" />
                      </span>
                    ) : (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                        <X className="h-4 w-4" />
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                        statusConfig.bgColor,
                        statusConfig.color,
                      )}
                    >
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--pv-text-muted)]">
                    {formatDate(item.invited_at)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--pv-text-muted)]">
                    {formatDateTime(item.created_at)}
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
          const statusConfig = WAITLIST_STATUSES[item.status] || WAITLIST_STATUSES.pending;
          const referralConfig = REFERRAL_TYPES[item.referral_type] || REFERRAL_TYPES.organic;

          return (
            <div
              key={item.id}
              className="rounded-xl border p-4"
              style={{ borderColor: 'var(--pv-border)', background: 'var(--pv-surface)' }}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                      statusConfig.bgColor,
                      statusConfig.color,
                    )}
                  >
                    {statusConfig.label}
                  </span>
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                      referralConfig.bgColor,
                      referralConfig.color,
                    )}
                  >
                    {referralConfig.label}
                  </span>
                </div>
                {item.confirmed ? (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <Check className="h-4 w-4" />
                  </span>
                ) : (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                    <X className="h-4 w-4" />
                  </span>
                )}
              </div>
              <p className="mb-1 text-sm font-medium" style={{ color: 'var(--pv-text)' }}>
                {item.email}
              </p>
              {item.name && (
                <p className="mb-2 text-sm text-[var(--pv-text-muted)]">{item.name}</p>
              )}
              <div className="flex items-center justify-between text-xs text-[var(--pv-text-muted)]">
                <span>Signed up {formatDateTime(item.created_at)}</span>
                {item.invited_at && <span>Invited {formatDate(item.invited_at)}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
