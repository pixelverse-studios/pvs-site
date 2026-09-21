'use client';
import React, { useState } from 'react';
import { Button, Checkbox, Select, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { DomaniDrawer, fieldClassNames, selectClassNames } from '../../components/domani-controls';
import type { UsersQueryParams } from '@/lib/types/domani-users';
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
    <Select
      className="min-w-[150px] flex-1"
      label={title}
      aria-label={title}
      classNames={selectClassNames}
      value={String(draft[key] || '')}
      allowDeselect={false}
      comboboxProps={{ withinPortal: false }}
      onChange={(value) => update(key, value || '')}
      data={[{ value: '', label: 'All' }, ...values.map(([value, label]) => ({ value, label }))]}
    />
  );
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      <TextInput
        classNames={fieldClassNames}
        aria-label="Search users"
        placeholder="Search name or email"
        className="h-10 min-w-0 flex-1 basis-full sm:basis-48"
        value={query.search || ''}
        onChange={(e) => onChange({ ...query, search: e.target.value || undefined, offset: 0 })}
      />
      <Select
        aria-label="Quick login provider"
        classNames={selectClassNames}
        allowDeselect={false}
        value={query.provider || ''}
        data={[
          { value: '', label: 'All providers' },
          { value: 'apple', label: 'Apple' },
          { value: 'google', label: 'Google' },
          { value: 'email', label: 'Email' },
        ]}
        onChange={(value) =>
          onChange({
            ...query,
            provider: (value || undefined) as UsersQueryParams['provider'],
            offset: 0,
          })
        }
      />
      <Button
        variant="outline"
        onClick={() => {
          setDraft(query);
          setOpen(true);
        }}
      >
        Filters{activeCount ? ` (${activeCount})` : ''}
      </Button>
      <DomaniDrawer filter opened={open} onClose={() => setOpen(false)} title="Filter users">
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <p className="text-sm text-[var(--pv-text-muted)]">
            Refine the user list. Changes take effect when you apply filters.
          </p>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
            <div className="flex flex-wrap items-end gap-3">
              <label className="min-w-[220px] flex-[2] text-xs text-[var(--pv-text-muted)]">
                Search users
                <TextInput
                  classNames={fieldClassNames}
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
                <TextInput
                  classNames={fieldClassNames}
                  aria-label="Reported app version"
                  className="mt-1"
                  value={draft.app_version || ''}
                  onChange={(e) => update('app_version', e.target.value)}
                />
              </label>
              {(['start_date', 'end_date'] as const).map((key, i) => (
                <label key={key} className="text-xs text-[var(--pv-text-muted)]">
                  {i ? 'Joined through (UTC)' : 'Joined from (UTC)'}
                  <DateInput
                    classNames={fieldClassNames}
                    aria-label={i ? 'Joined through (UTC)' : 'Joined from (UTC)'}
                    className="mt-1"
                    value={draft[key] || null}
                    valueFormat="MMM D, YYYY"
                    clearable
                    popoverProps={{ withinPortal: false }}
                    onChange={(value) => update(key, value || '')}
                  />
                </label>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Checkbox
                label="Include deleted accounts"
                checked={!!draft.include_deleted}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    include_deleted: e.currentTarget.checked,
                    account_status: undefined,
                    offset: 0,
                  })
                }
              />
              <Button
                variant="subtle"
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
        </div>
      </DomaniDrawer>
    </div>
  );
}
