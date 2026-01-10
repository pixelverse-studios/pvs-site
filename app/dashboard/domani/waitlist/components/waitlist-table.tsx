'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/ui/data-table';
import type { WaitlistEntry } from '@/lib/types/waitlist';
import { REFERRAL_TYPES } from '@/lib/types/waitlist';

interface WaitlistTableProps {
  items: WaitlistEntry[];
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
}

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

const columns: ColumnDef<WaitlistEntry>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <span style={{ color: 'var(--pv-text)' }}>{row.getValue('email')}</span>
    ),
  },
  {
    accessorKey: 'referral_type',
    header: 'Referral',
    cell: ({ row }) => {
      const referralType = row.getValue('referral_type') as string;
      const config = REFERRAL_TYPES[referralType] || REFERRAL_TYPES.organic;
      return (
        <span
          className={cn(
            'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
            config.bgColor,
            config.color
          )}
        >
          {config.label}
        </span>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Signed Up',
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-[var(--pv-text-muted)]">
        {formatDateTime(row.getValue('created_at'))}
      </span>
    ),
  },
];

export function WaitlistTable({ items, globalFilter, onGlobalFilterChange }: WaitlistTableProps) {
  const emptyState = (
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

  return (
    <DataTable
      columns={columns}
      data={items}
      emptyState={emptyState}
      globalFilter={globalFilter}
      onGlobalFilterChange={onGlobalFilterChange}
    />
  );
}
