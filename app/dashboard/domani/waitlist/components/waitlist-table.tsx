'use client';

import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WaitlistEntry } from '@/lib/types/waitlist';
import { REFERRAL_TYPES } from '@/lib/types/waitlist';

interface WaitlistTableProps {
  items: WaitlistEntry[];
}

export function WaitlistTable({ items }: WaitlistTableProps) {
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
                Referral
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
                Signed Up
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
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
          const referralConfig = REFERRAL_TYPES[item.referral_type] || REFERRAL_TYPES.organic;

          return (
            <div
              key={item.id}
              className="rounded-xl border p-4"
              style={{ borderColor: 'var(--pv-border)', background: 'var(--pv-surface)' }}
            >
              <div className="mb-3">
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
              <p className="mb-2 text-sm font-medium" style={{ color: 'var(--pv-text)' }}>
                {item.email}
              </p>
              <p className="text-xs text-[var(--pv-text-muted)]">
                Signed up {formatDateTime(item.created_at)}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
