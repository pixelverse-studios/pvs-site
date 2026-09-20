'use client';
import React from 'react';
import type { UsersQueryParams } from '@/lib/types/domani-users';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
export function UsersToolbar({
  query,
  onChange,
}: {
  query: UsersQueryParams;
  onChange: (query: UsersQueryParams) => void;
}) {
  const update = (key: keyof UsersQueryParams, value: string) =>
    onChange({
      ...query,
      [key]: value || undefined,
      offset: 0,
      ...(key === 'account_status' && ['deleted', 'deletion_pending'].includes(value)
        ? { include_deleted: true }
        : {}),
    });
  const select = (key: keyof UsersQueryParams, title: string, values: [string, string][]) => (
    <label className="min-w-[150px] flex-1 text-xs text-[var(--pv-text-muted)]">
      {title}
      <select
        aria-label={title}
        value={String(query[key] || '')}
        onChange={(e) => update(key, e.target.value)}
        className="mt-1 h-10 w-full rounded-lg border border-[var(--pv-border)] bg-[var(--pv-bg)] px-3 text-sm text-[var(--pv-text)]"
      >
        <option value="">All</option>
        {values.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <div className="space-y-4 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="min-w-[220px] flex-[2] text-xs text-[var(--pv-text-muted)]">
          Search users
          <Input
            aria-label="Search users"
            className="mt-1"
            placeholder="Name or email across all users"
            value={query.search || ''}
            onChange={(e) => update('search', e.target.value)}
          />
        </label>
        {select('provider', 'Login provider', [
          ['apple', 'Apple'],
          ['google', 'Google'],
          ['email', 'Email'],
        ])}
        {select('cohort', 'Cohort', [
          ['friends_family', 'Friends & Family'],
          ['early_adopter', 'Early Adopter'],
          ['general', 'General'],
        ])}
        {select('account_status', 'Account status', [
          ['active', 'Active account'],
          ['deletion_pending', 'Deletion pending'],
          ['deleted', 'Deleted'],
          ['banned', 'Banned'],
          ['unknown', 'Unknown'],
        ])}
      </div>
      <details>
        <summary className="cursor-pointer text-sm font-medium text-[var(--pv-primary)]">
          More filters
        </summary>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          {select('platform', 'Reported platform', [
            ['ios', 'iOS'],
            ['android', 'Android'],
            ['unknown', 'Unknown'],
          ])}
          {select('activity', 'App activity', [
            ['recent', 'Recorded within 30 days'],
            ['older', 'Recorded over 30 days ago'],
            ['unknown', 'Not recorded'],
          ])}
          {select('verification', 'Email verification', [
            ['verified', 'Verified'],
            ['unverified', 'Unverified'],
            ['unknown', 'Unknown'],
          ])}
          <label className="text-xs text-[var(--pv-text-muted)]">
            Reported app version
            <Input
              aria-label="Reported app version"
              className="mt-1"
              value={query.app_version || ''}
              onChange={(e) => update('app_version', e.target.value)}
            />
          </label>
          {(['start_date', 'end_date'] as const).map((key, i) => (
            <label key={key} className="text-xs text-[var(--pv-text-muted)]">
              {i ? 'Joined through (UTC)' : 'Joined from (UTC)'}
              <Input
                aria-label={i ? 'Joined through (UTC)' : 'Joined from (UTC)'}
                type="date"
                className="mt-1"
                value={query[key] || ''}
                onChange={(e) => update(key, e.target.value)}
              />
            </label>
          ))}
        </div>
      </details>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!query.include_deleted}
            onChange={(e) =>
              onChange({
                ...query,
                include_deleted: e.target.checked,
                account_status: undefined,
                offset: 0,
              })
            }
          />
          Include deleted accounts
        </label>
        <Button
          variant="ghost"
          onClick={() =>
            onChange({
              limit: query.limit || 50,
              offset: 0,
              sort_by: 'joined_at',
              sort_order: 'desc',
            })
          }
        >
          Clear filters
        </Button>
      </div>
    </div>
  );
}
