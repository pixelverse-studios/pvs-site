'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRangeFilter, type DateRange, getDateRangeLabel } from '@/components/ui/date-range-filter';
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
    <div className="space-y-3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--pv-text-muted)]" />
          <Input
            placeholder="Search by email or message..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Filter */}
          <DateRangeFilter
            value={filters.dateRange}
            onChange={(value) => updateFilter('dateRange', value)}
          />

          {/* Category Filter */}
          <Select
            value={filters.category}
            onValueChange={(value) => updateFilter('category', value as UnifiedCategory | 'all')}
          >
            <SelectTrigger className="h-10 w-[130px]">
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
            <SelectTrigger className="h-10 w-[130px]">
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
            <SelectTrigger className="h-10 w-[130px]">
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
            <SelectTrigger className="h-10 w-[130px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="beta_feedback">Feedback</SelectItem>
              <SelectItem value="support_request">Support</SelectItem>
            </SelectContent>
          </Select>

          {/* Stats Badge */}
          {counts && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[var(--pv-text-muted)]">{counts.total} total</span>
              {counts.new > 0 && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {counts.new} new
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.search && (
            <FilterChip label={`"${filters.search}"`} onRemove={() => updateFilter('search', '')} />
          )}
          {filters.dateRange.preset !== 'all' && (
            <FilterChip
              label={getDateRangeLabel(filters.dateRange)}
              onRemove={() => updateFilter('dateRange', { preset: 'all', startDate: null, endDate: null })}
            />
          )}
          {filters.category !== 'all' && (
            <FilterChip
              label={`Category: ${filters.category}`}
              onRemove={() => updateFilter('category', 'all')}
            />
          )}
          {filters.status !== 'all' && (
            <FilterChip
              label={`Status: ${filters.status}`}
              onRemove={() => updateFilter('status', 'all')}
            />
          )}
          {filters.platform !== 'all' && (
            <FilterChip
              label={`Platform: ${filters.platform.toUpperCase()}`}
              onRemove={() => updateFilter('platform', 'all')}
            />
          )}
          {filters.source !== 'all' && (
            <FilterChip
              label={`Source: ${filters.source === 'beta_feedback' ? 'Feedback' : 'Support'}`}
              onRemove={() => updateFilter('source', 'all')}
            />
          )}
          <button
            onClick={clearFilters}
            className="text-sm text-[var(--pv-text-muted)] hover:text-[var(--pv-text)]"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm transition-colors hover:opacity-80"
      style={{
        background: 'var(--pv-primary)',
        color: 'white',
      }}
    >
      {label}
      <X className="h-3 w-3" />
    </button>
  );
}
