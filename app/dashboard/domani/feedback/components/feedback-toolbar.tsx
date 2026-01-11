'use client';

import { Search, X, RotateCcw, Calendar, Tag, CircleDot, Smartphone, Inbox } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRangeFilter, type DateRange, getDateRangeLabel } from '@/components/ui/date-range-filter';
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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--pv-text-muted)]" />
          <Input
            placeholder="Search by email or message..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="h-10 pl-10 pr-10"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--pv-text-muted)] hover:text-[var(--pv-text)] transition-colors"
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
            value={filters.category}
            onValueChange={(value) => updateFilter('category', value as UnifiedCategory | 'all')}
          >
            <SelectTrigger
              className={cn(
                'h-9 w-auto min-w-[120px] gap-2 border-transparent bg-transparent',
                filters.category !== 'all' &&
                  'border-[var(--pv-primary)]/30 bg-[var(--pv-primary)]/10 text-[var(--pv-primary)]'
              )}
            >
              <Tag className="h-4 w-4 shrink-0 opacity-50" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
              <SelectItem value="love">Love</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="support">Support</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={filters.status}
            onValueChange={(value) => updateFilter('status', value as FeedbackStatus | 'all')}
          >
            <SelectTrigger
              className={cn(
                'h-9 w-auto min-w-[110px] gap-2 border-transparent bg-transparent',
                filters.status !== 'all' &&
                  'border-[var(--pv-primary)]/30 bg-[var(--pv-primary)]/10 text-[var(--pv-primary)]'
              )}
            >
              <CircleDot className="h-4 w-4 shrink-0 opacity-50" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          {/* Platform Filter */}
          <Select
            value={filters.platform}
            onValueChange={(value) => updateFilter('platform', value as Platform | 'all')}
          >
            <SelectTrigger
              className={cn(
                'h-9 w-auto min-w-[120px] gap-2 border-transparent bg-transparent',
                filters.platform !== 'all' &&
                  'border-[var(--pv-primary)]/30 bg-[var(--pv-primary)]/10 text-[var(--pv-primary)]'
              )}
            >
              <Smartphone className="h-4 w-4 shrink-0 opacity-50" />
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="ios">iOS</SelectItem>
              <SelectItem value="android">Android</SelectItem>
            </SelectContent>
          </Select>

          {/* Source Filter */}
          <Select
            value={filters.source}
            onValueChange={(value) => updateFilter('source', value as FeedbackSource | 'all')}
          >
            <SelectTrigger
              className={cn(
                'h-9 w-auto min-w-[110px] gap-2 border-transparent bg-transparent',
                filters.source !== 'all' &&
                  'border-[var(--pv-primary)]/30 bg-[var(--pv-primary)]/10 text-[var(--pv-primary)]'
              )}
            >
              <Inbox className="h-4 w-4 shrink-0 opacity-50" />
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="beta_feedback">Feedback</SelectItem>
              <SelectItem value="support_request">Support</SelectItem>
            </SelectContent>
          </Select>
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
              onRemove={() => updateFilter('dateRange', { preset: 'all', startDate: null, endDate: null })}
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
