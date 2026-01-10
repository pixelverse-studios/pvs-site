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

export interface WaitlistFilters {
  search: string;
  status: string;
  confirmed: 'all' | 'true' | 'false';
}

interface WaitlistToolbarProps {
  filters: WaitlistFilters;
  onFiltersChange: (filters: WaitlistFilters) => void;
  counts?: {
    total: number;
    confirmed: number;
  };
}

export function WaitlistToolbar({ filters, onFiltersChange, counts }: WaitlistToolbarProps) {
  const updateFilter = <K extends keyof WaitlistFilters>(key: K, value: WaitlistFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.status !== 'all' || filters.confirmed !== 'all' || filters.search !== '';

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      confirmed: 'all',
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
          {/* Status Filter */}
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="h-10 w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="invited">Invited</SelectItem>
              <SelectItem value="joined">Joined</SelectItem>
            </SelectContent>
          </Select>

          {/* Confirmed Filter */}
          <Select
            value={filters.confirmed}
            onValueChange={(value) => updateFilter('confirmed', value as 'all' | 'true' | 'false')}
          >
            <SelectTrigger className="h-10 w-[140px]">
              <SelectValue placeholder="Confirmed" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Confirmed</SelectItem>
              <SelectItem value="false">Unconfirmed</SelectItem>
            </SelectContent>
          </Select>

          {/* Stats Badge */}
          {counts && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[var(--pv-text-muted)]">{counts.total} total</span>
              {counts.confirmed > 0 && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  {counts.confirmed} confirmed
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
          {filters.status !== 'all' && (
            <FilterChip
              label={`Status: ${filters.status}`}
              onRemove={() => updateFilter('status', 'all')}
            />
          )}
          {filters.confirmed !== 'all' && (
            <FilterChip
              label={`Confirmed: ${filters.confirmed === 'true' ? 'Yes' : 'No'}`}
              onRemove={() => updateFilter('confirmed', 'all')}
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
