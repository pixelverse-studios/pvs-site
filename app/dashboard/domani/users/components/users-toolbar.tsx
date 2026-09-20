'use client';
import React, { useState } from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
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
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(query);
  const activeCount = [
    'provider',
    'cohort',
    'account_status',
    'platform',
    'activity',
    'verification',
    'app_version',
    'start_date',
    'end_date',
    'include_deleted',
  ].filter((key) => Boolean(query[key as keyof UsersQueryParams])).length;
  const update = (key: keyof UsersQueryParams, value: string) =>
    setDraft({
      ...draft,
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
        value={String(draft[key] || '')}
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
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      <Input
        aria-label="Search users"
        placeholder="Search name or email"
        className="h-10 min-w-0 flex-1 basis-full sm:basis-48"
        value={query.search || ''}
        onChange={(e) => onChange({ ...query, search: e.target.value || undefined, offset: 0 })}
      />
      <select
        aria-label="Quick login provider"
        className="h-10 rounded-lg border border-[var(--pv-border)] bg-[var(--pv-bg)] px-3 text-sm"
        value={query.provider || ''}
        onChange={(e) =>
          onChange({
            ...query,
            provider: (e.target.value || undefined) as UsersQueryParams['provider'],
            offset: 0,
          })
        }
      >
        <option value="">All providers</option>
        <option value="apple">Apple</option>
        <option value="google">Google</option>
        <option value="email">Email</option>
      </select>
      <Sheet
        open={open}
        onOpenChange={(value) => {
          if (value) setDraft(query);
          setOpen(value);
        }}
      >
        <SheetTrigger asChild>
          <Button variant="outline" className="h-10 px-3">
            Filters{activeCount ? ` (${activeCount})` : ''}
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-4 motion-reduce:animate-none sm:max-w-lg lg:max-w-lg xl:max-w-lg">
          <SheetHeader className="pr-8">
            <SheetTitle>Filter users</SheetTitle>
            <SheetDescription>
              Refine the user list. Changes take effect when you apply filters.
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
            <div className="flex flex-wrap items-end gap-3">
              <label className="min-w-[220px] flex-[2] text-xs text-[var(--pv-text-muted)]">
                Search users
                <Input
                  aria-label="Filter search users"
                  className="mt-1"
                  placeholder="Name or email across all users"
                  value={draft.search || ''}
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
                  value={draft.app_version || ''}
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
                    value={draft[key] || ''}
                    onChange={(e) => update(key, e.target.value)}
                  />
                </label>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!draft.include_deleted}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
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
                  setDraft({
                    limit: query.limit || 50,
                    offset: 0,
                    sort_by: query.sort_by,
                    sort_order: query.sort_order,
                  })
                }
              >
                Clear filters
              </Button>
            </div>
            <p className="text-xs text-[var(--pv-text-muted)]">
              Account status does not indicate recent use. Devices are historical feedback/support
              snapshots, not a current device inventory. All times are UTC.
            </p>
          </div>
          <div className="flex shrink-0 justify-end gap-2 border-t border-[var(--pv-border)] pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onChange({ ...draft, offset: 0 });
                setOpen(false);
              }}
            >
              Apply filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
