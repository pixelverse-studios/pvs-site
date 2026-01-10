'use client';

import { useState } from 'react';
import type { WaitlistEntry } from '@/lib/types/waitlist';
import { WaitlistToolbar } from './waitlist-toolbar';
import { WaitlistTable } from './waitlist-table';

interface WaitlistPageClientProps {
  initialItems: WaitlistEntry[];
}

export function WaitlistPageClient({ initialItems }: WaitlistPageClientProps) {
  const [globalFilter, setGlobalFilter] = useState('');

  return (
    <>
      {/* Toolbar */}
      <div className="mb-6">
        <WaitlistToolbar
          searchValue={globalFilter}
          onSearchChange={setGlobalFilter}
          total={initialItems.length}
        />
      </div>

      {/* Table */}
      <WaitlistTable
        items={initialItems}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
      />
    </>
  );
}
