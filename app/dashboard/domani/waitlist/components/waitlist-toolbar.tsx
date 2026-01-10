'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DateRangeFilter, type DateRange, getDateRangeLabel } from '@/components/ui/date-range-filter';

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

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      dateRange: DEFAULT_DATE_RANGE,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--pv-text-muted)]" />
          <Input
            placeholder="Search by email..."
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

          {/* Stats Badge */}
          {total !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[var(--pv-text-muted)]">{total} total</span>
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
              onRemove={() => updateFilter('dateRange', DEFAULT_DATE_RANGE)}
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
