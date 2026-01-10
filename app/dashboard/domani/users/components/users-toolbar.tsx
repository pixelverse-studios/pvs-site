'use client';

import { Search, X, RotateCcw, Calendar, Crown, Users, Trash2 } from 'lucide-react';
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

  const activeFilterCount = [
    filters.tier !== 'all',
    filters.cohort !== 'all',
    filters.includeDeleted,
    filters.search !== '',
    filters.dateRange.preset !== 'all',
  ].filter(Boolean).length;

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
    <div className="space-y-4">
      {/* Top Row: Search + Stats */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--pv-text-muted)]" />
          <Input
            placeholder="Search by email or name..."
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
              <div className="h-6 w-px bg-[var(--pv-border)]" />
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span className="text-2xl font-semibold text-green-600 dark:text-green-400">
                  {counts.active}
                </span>
                <span className="text-sm text-[var(--pv-text-muted)]">active</span>
              </div>
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

          {/* Tier Filter */}
          <Select
            value={filters.tier}
            onValueChange={(value) => updateFilter('tier', value as UserTier | 'all')}
          >
            <SelectTrigger
              className={cn(
                'h-9 w-auto min-w-[110px] gap-2 border-transparent bg-transparent',
                filters.tier !== 'all' &&
                  'border-[var(--pv-primary)]/30 bg-[var(--pv-primary)]/10 text-[var(--pv-primary)]'
              )}
            >
              <Crown className="h-4 w-4 shrink-0 opacity-50" />
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
            <SelectTrigger
              className={cn(
                'h-9 w-auto min-w-[140px] gap-2 border-transparent bg-transparent',
                filters.cohort !== 'all' &&
                  'border-[var(--pv-primary)]/30 bg-[var(--pv-primary)]/10 text-[var(--pv-primary)]'
              )}
            >
              <Users className="h-4 w-4 shrink-0 opacity-50" />
              <SelectValue placeholder="Cohort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cohorts</SelectItem>
              <SelectItem value="friends_family">Friends & Family</SelectItem>
              <SelectItem value="early_adopter">Early Adopter</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>

          {/* Divider */}
          <div className="hidden h-6 w-px bg-[var(--pv-border)] lg:block" />

          {/* Include Deleted Toggle */}
          <button
            onClick={() => updateFilter('includeDeleted', !filters.includeDeleted)}
            className={cn(
              'flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-all',
              filters.includeDeleted
                ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400'
                : 'border-transparent text-[var(--pv-text-muted)] hover:bg-[var(--pv-bg)]'
            )}
          >
            <Trash2 className="h-4 w-4" />
            <span>Show deleted</span>
          </button>
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
          {filters.tier !== 'all' && (
            <FilterChip
              label={filters.tier}
              icon={<Crown className="h-3 w-3" />}
              onRemove={() => updateFilter('tier', 'all')}
            />
          )}
          {filters.cohort !== 'all' && (
            <FilterChip
              label={filters.cohort.replace('_', ' ')}
              icon={<Users className="h-3 w-3" />}
              onRemove={() => updateFilter('cohort', 'all')}
            />
          )}
          {filters.includeDeleted && (
            <FilterChip
              label="Including deleted"
              icon={<Trash2 className="h-3 w-3" />}
              variant="destructive"
              onRemove={() => updateFilter('includeDeleted', false)}
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
  variant = 'default',
  onRemove,
}: {
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive';
  onRemove: () => void;
}) {
  return (
    <button
      onClick={onRemove}
      className={cn(
        'group inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all',
        variant === 'destructive'
          ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50'
          : 'hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-800 dark:hover:bg-red-950/30 dark:hover:text-red-400'
      )}
      style={
        variant === 'default'
          ? {
              borderColor: 'var(--pv-primary)',
              background: 'color-mix(in srgb, var(--pv-primary) 10%, transparent)',
              color: 'var(--pv-primary)',
            }
          : undefined
      }
    >
      {icon}
      <span className="capitalize">{label}</span>
      <X className="h-3 w-3 opacity-60 group-hover:opacity-100" />
    </button>
  );
}
