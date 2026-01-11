'use client';

import { ColumnDef } from '@tanstack/react-table';
import { UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/ui/data-table';
import type { UserProfile, UserTier, SignupCohort } from '@/lib/types/domani-users';
import { TIER_COLORS, COHORT_COLORS, SIGNUP_METHOD_LABELS } from '@/lib/types/domani-users';

interface UsersTableProps {
  items: UserProfile[];
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const columns: ColumnDef<UserProfile>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const isDeleted = !!row.original.deleted_at;
      return (
        <div>
          <span
            className={cn(isDeleted && 'line-through')}
            style={{ color: 'var(--pv-text)' }}
          >
            {row.getValue('email')}
          </span>
          {isDeleted && (
            <span className="ml-2 text-xs text-red-500 dark:text-red-400">(deleted)</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'full_name',
    header: 'Name',
    cell: ({ row }) => (
      <span className="text-[var(--pv-text-muted)]">
        {row.getValue('full_name') || '—'}
      </span>
    ),
  },
  {
    accessorKey: 'tier',
    header: 'Tier',
    cell: ({ row }) => {
      const tier = row.getValue('tier') as UserTier;
      const config = TIER_COLORS[tier];
      return (
        <span
          className={cn(
            'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
            config?.bgColor,
            config?.color
          )}
        >
          {config?.label || tier}
        </span>
      );
    },
  },
  {
    accessorKey: 'signup_cohort',
    header: 'Cohort',
    cell: ({ row }) => {
      const cohort = row.getValue('signup_cohort') as SignupCohort;
      const config = COHORT_COLORS[cohort];
      return (
        <span
          className={cn(
            'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
            config?.bgColor,
            config?.color
          )}
        >
          {config?.label || cohort}
        </span>
      );
    },
  },
  {
    accessorKey: 'signup_method',
    header: 'Signup',
    cell: ({ row }) => (
      <span className="text-[var(--pv-text-muted)]">
        {SIGNUP_METHOD_LABELS[row.getValue('signup_method') as string] || row.getValue('signup_method')}
      </span>
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Joined',
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-[var(--pv-text-muted)]">
        {formatDate(row.getValue('created_at'))}
      </span>
    ),
  },
];

export function UsersTable({ items, globalFilter, onGlobalFilterChange }: UsersTableProps) {
  const emptyState = (
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

  return (
    <DataTable
      columns={columns}
      data={items}
      emptyState={emptyState}
      globalFilter={globalFilter}
      onGlobalFilterChange={onGlobalFilterChange}
      getRowClassName={(row) => (row.deleted_at ? 'opacity-50' : '')}
    />
  );
}
