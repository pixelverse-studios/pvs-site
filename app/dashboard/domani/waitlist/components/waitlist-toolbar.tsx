'use client';
import {
  fieldClassNames,
  selectClassNames,
} from '@/app/dashboard/domani/components/domani-controls';

import { Search, X, RotateCcw, Calendar } from 'lucide-react';
import { TextInput as Input } from '@mantine/core';
import {
  DateRangeFilter,
  type DateRange,
  getDateRangeLabel,
} from '@/app/dashboard/domani/components/domani-date-range-filter';

export interface WaitlistFilters {
  search: string;
  dateRange: DateRange;
}

interface WaitlistToolbarProps {
  filters: WaitlistFilters;
  onFiltersChange: (filters: WaitlistFilters) => void;
  total?: number;
}

const DEFAULT_DATE_RANGE: DateRange = { preset: 'all', startDate: null, endDate: null };

export function WaitlistToolbar({ filters, onFiltersChange, total }: WaitlistToolbarProps) {
  const updateFilter = <K extends keyof WaitlistFilters>(key: K, value: WaitlistFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = filters.search !== '' || filters.dateRange.preset !== 'all';

  const activeFilterCount = [filters.search !== '', filters.dateRange.preset !== 'all'].filter(
    Boolean,
  ).length;

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      dateRange: DEFAULT_DATE_RANGE,
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Row: Search + Stats */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Input
            aria-label="Search waitlist"
            leftSection={<Search size={16} />}
            placeholder="Search by email..."
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
        {total !== undefined && (
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-3 rounded-lg border px-4 py-2"
              style={{ borderColor: 'var(--pv-border)', background: 'var(--pv-surface)' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold" style={{ color: 'var(--pv-text)' }}>
                  {total}
                </span>
                <span className="text-sm text-[var(--pv-text-muted)]">signups</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div
        className="flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: 'var(--pv-border)', background: 'var(--pv-surface)' }}
      >
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Filter */}
          <DateRangeFilter
            value={filters.dateRange}
            onChange={(value) => updateFilter('dateRange', value)}
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
              onRemove={() => updateFilter('dateRange', DEFAULT_DATE_RANGE)}
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
      <span>{label}</span>
      <X className="h-3 w-3 opacity-60 group-hover:opacity-100" />
    </button>
  );
}
