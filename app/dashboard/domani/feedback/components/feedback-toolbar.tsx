'use client';
import {
  fieldClassNames,
  selectClassNames,
} from '@/app/dashboard/domani/components/domani-controls';

import { Search, X, RotateCcw, Calendar, Tag, CircleDot, Smartphone, Inbox } from 'lucide-react';
import { TextInput as Input } from '@mantine/core';
import { Select } from '@mantine/core';
import {
  DateRangeFilter,
  type DateRange,
  getDateRangeLabel,
} from '@/app/dashboard/domani/components/domani-date-range-filter';
import { cn } from '@/lib/utils';
import type {
  UnifiedCategory,
  FeedbackStatus,
  Platform,
  FeedbackSource,
} from '@/lib/types/feedback';

export interface FeedbackFilters {
  search: string;
  category: UnifiedCategory | 'all';
  status: FeedbackStatus | 'all';
  platform: Platform | 'all';
  source: FeedbackSource | 'all';
  dateRange: DateRange;
}

interface FeedbackToolbarProps {
  filters: FeedbackFilters;
  onFiltersChange: (filters: FeedbackFilters) => void;
  counts?: {
    total: number;
    new: number;
  };
}

export function FeedbackToolbar({ filters, onFiltersChange, counts }: FeedbackToolbarProps) {
  const updateFilter = <K extends keyof FeedbackFilters>(key: K, value: FeedbackFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.status !== 'all' ||
    filters.platform !== 'all' ||
    filters.source !== 'all' ||
    filters.search !== '' ||
    filters.dateRange.preset !== 'all';

  const activeFilterCount = [
    filters.category !== 'all',
    filters.status !== 'all',
    filters.platform !== 'all',
    filters.source !== 'all',
    filters.search !== '',
    filters.dateRange.preset !== 'all',
  ].filter(Boolean).length;

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category: 'all',
      status: 'all',
      platform: 'all',
      source: 'all',
      dateRange: { preset: 'all', startDate: null, endDate: null },
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Row: Search + Stats */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Input
            leftSection={<Search size={16} />}
            aria-label="Search feedback by email or message"
            maxLength={200}
            placeholder="Search by email or message..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            classNames={{ ...fieldClassNames, input: `h-10 pr-10 ${fieldClassNames.input}` }}
          />
          {filters.search && (
            <button
              aria-label="Clear search"
              onClick={() => updateFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Stats */}
        {counts && (
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-3 rounded-lg border px-4 py-2"
              style={{ borderColor: 'var(--pv-border)', background: 'var(--pv-surface)' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold" style={{ color: 'var(--pv-text)' }}>
                  {counts.total}
                </span>
                <span className="text-sm text-[var(--pv-text-muted)]">total</span>
              </div>
              {counts.new > 0 && (
                <>
                  <div className="h-6 w-px bg-[var(--pv-border)]" />
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                    </span>
                    <span className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                      {counts.new}
                    </span>
                    <span className="text-sm text-[var(--pv-text-muted)]">new</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div
        className="flex flex-col gap-3 rounded-xl border p-3 lg:flex-row lg:items-center lg:justify-between"
        style={{ borderColor: 'var(--pv-border)', background: 'var(--pv-surface)' }}
      >
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Filter */}
          <DateRangeFilter
            value={filters.dateRange}
            onChange={(value) => updateFilter('dateRange', value)}
          />

          {/* Divider */}
          <div className="hidden h-6 w-px bg-[var(--pv-border)] lg:block" />

          {/* Category Filter */}
          <Select
            classNames={selectClassNames}
            value={filters.category}
            onChange={(value) =>
              updateFilter('category', (value || 'all') as UnifiedCategory | 'all')
            }
            aria-label="category"
            allowDeselect={false}
            data={[
              { value: 'all', label: 'All Categories' },
              { value: 'bug', label: 'Bug' },
              { value: 'feature', label: 'Feature' },
              { value: 'love', label: 'Love' },
              { value: 'general', label: 'General' },
              { value: 'support', label: 'Support' },
              { value: 'unknown', label: 'Unknown' },
            ]}
          />

          {/* Status Filter */}
          <Select
            classNames={selectClassNames}
            value={filters.status}
            onChange={(value) => updateFilter('status', (value || 'all') as FeedbackStatus | 'all')}
            aria-label="status"
            allowDeselect={false}
            data={[
              { value: 'all', label: 'All Statuses' },
              { value: 'new', label: 'New' },
              { value: 'reviewed', label: 'Reviewed' },
              { value: 'resolved', label: 'Resolved' },
              { value: 'unknown', label: 'Unknown' },
            ]}
          />

          {/* Platform Filter */}
          <Select
            classNames={selectClassNames}
            value={filters.platform}
            onChange={(value) => updateFilter('platform', (value || 'all') as Platform | 'all')}
            aria-label="platform"
            allowDeselect={false}
            data={[
              { value: 'all', label: 'All Platforms' },
              { value: 'ios', label: 'iOS' },
              { value: 'android', label: 'Android' },
              { value: 'unknown', label: 'Unknown' },
            ]}
          />

          {/* Source Filter */}
          <Select
            classNames={selectClassNames}
            value={filters.source}
            onChange={(value) => updateFilter('source', (value || 'all') as FeedbackSource | 'all')}
            aria-label="source"
            allowDeselect={false}
            data={[
              { value: 'all', label: 'All Sources' },
              { value: 'beta_feedback', label: 'Feedback' },
              { value: 'support_request', label: 'Support' },
            ]}
          />
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--pv-text-muted)] transition-colors hover:bg-[var(--pv-bg)] hover:text-[var(--pv-text)]"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--pv-primary)] text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--pv-text-muted)]">
            Active filters:
          </span>
          {filters.search && (
            <FilterChip label={`"${filters.search}"`} onRemove={() => updateFilter('search', '')} />
          )}
          {filters.dateRange.preset !== 'all' && (
            <FilterChip
              label={getDateRangeLabel(filters.dateRange)}
              icon={<Calendar className="h-3 w-3" />}
              onRemove={() =>
                updateFilter('dateRange', { preset: 'all', startDate: null, endDate: null })
              }
            />
          )}
          {filters.category !== 'all' && (
            <FilterChip
              label={filters.category}
              icon={<Tag className="h-3 w-3" />}
              onRemove={() => updateFilter('category', 'all')}
            />
          )}
          {filters.status !== 'all' && (
            <FilterChip
              label={filters.status}
              icon={<CircleDot className="h-3 w-3" />}
              onRemove={() => updateFilter('status', 'all')}
            />
          )}
          {filters.platform !== 'all' && (
            <FilterChip
              label={filters.platform.toUpperCase()}
              icon={<Smartphone className="h-3 w-3" />}
              onRemove={() => updateFilter('platform', 'all')}
            />
          )}
          {filters.source !== 'all' && (
            <FilterChip
              label={filters.source === 'beta_feedback' ? 'Feedback' : 'Support'}
              icon={<Inbox className="h-3 w-3" />}
              onRemove={() => updateFilter('source', 'all')}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  icon,
  onRemove,
}: {
  label: string;
  icon?: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <button
      onClick={onRemove}
      className="group inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-800 dark:hover:bg-red-950/30 dark:hover:text-red-400"
      style={{
        borderColor: 'var(--pv-primary)',
        background: 'color-mix(in srgb, var(--pv-primary) 10%, transparent)',
        color: 'var(--pv-primary)',
      }}
    >
      {icon}
      <span className="capitalize">{label}</span>
      <X className="h-3 w-3 opacity-60 group-hover:opacity-100" />
    </button>
  );
}
