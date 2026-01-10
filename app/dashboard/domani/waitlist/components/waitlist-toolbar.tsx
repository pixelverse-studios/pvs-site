'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface WaitlistToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  total?: number;
}

export function WaitlistToolbar({ searchValue, onSearchChange, total }: WaitlistToolbarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--pv-text-muted)]" />
          <Input
            placeholder="Search by email..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Stats Badge */}
        {total !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--pv-text-muted)]">{total} total</span>
          </div>
        )}
      </div>

      {/* Active Filter Chip */}
      {searchValue && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSearchChange('')}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm transition-colors hover:opacity-80"
            style={{
              background: 'var(--pv-primary)',
              color: 'white',
            }}
          >
            &quot;{searchValue}&quot;
            <X className="h-3 w-3" />
          </button>
          <button
            onClick={() => onSearchChange('')}
            className="text-sm text-[var(--pv-text-muted)] hover:text-[var(--pv-text)]"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
