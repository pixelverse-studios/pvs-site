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
import type { UserTier, SignupCohort } from '@/lib/types/domani-users';

export interface UsersFilters {
  search: string;
  tier: UserTier | 'all';
  cohort: SignupCohort | 'all';
  includeDeleted: boolean;
  dateRange: DateRange;
}

interface UsersToolbarProps {
  filters: UsersFilters;
  onFiltersChange: (filters: UsersFilters) => void;
  counts?: {
    total: number;
    active: number;
  };
}

const DEFAULT_DATE_RANGE: DateRange = { preset: 'all', startDate: null, endDate: null };

export function UsersToolbar({ filters, onFiltersChange, counts }: UsersToolbarProps) {
  const updateFilter = <K extends keyof UsersFilters>(key: K, value: UsersFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.tier !== 'all' ||
    filters.cohort !== 'all' ||
    filters.includeDeleted ||
    filters.search !== '' ||
    filters.dateRange.preset !== 'all';

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      tier: 'all',
      cohort: 'all',
      includeDeleted: false,
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
            placeholder="Search by email or name..."
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

          {/* Tier Filter */}
          <Select
            value={filters.tier}
            onValueChange={(value) => updateFilter('tier', value as UserTier | 'all')}
          >
            <SelectTrigger className="h-10 w-[130px]">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="lifetime">Lifetime</SelectItem>
            </SelectContent>
          </Select>

          {/* Cohort Filter */}
          <Select
            value={filters.cohort}
            onValueChange={(value) => updateFilter('cohort', value as SignupCohort | 'all')}
          >
            <SelectTrigger className="h-10 w-[160px]">
              <SelectValue placeholder="Cohort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cohorts</SelectItem>
              <SelectItem value="friends_family">Friends & Family</SelectItem>
              <SelectItem value="early_adopter">Early Adopter</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>

          {/* Include Deleted Toggle */}
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={filters.includeDeleted}
              onChange={(e) => updateFilter('includeDeleted', e.target.checked)}
              className="h-4 w-4 rounded border-[var(--pv-border)] text-[var(--pv-primary)] focus:ring-[var(--pv-primary)]"
            />
            <span className="text-sm text-[var(--pv-text-muted)]">Show deleted</span>
          </label>

          {/* Stats Badge */}
          {counts && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[var(--pv-text-muted)]">{counts.total} total</span>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {counts.active} active
              </span>
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
          {filters.tier !== 'all' && (
            <FilterChip
              label={`Tier: ${filters.tier}`}
              onRemove={() => updateFilter('tier', 'all')}
            />
          )}
          {filters.cohort !== 'all' && (
            <FilterChip
              label={`Cohort: ${filters.cohort.replace('_', ' ')}`}
              onRemove={() => updateFilter('cohort', 'all')}
            />
          )}
          {filters.includeDeleted && (
            <FilterChip
              label="Including deleted"
              onRemove={() => updateFilter('includeDeleted', false)}
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
