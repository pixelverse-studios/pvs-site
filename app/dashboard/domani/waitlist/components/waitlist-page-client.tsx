'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
import { Container } from '@/components/ui/container';
import type { WaitlistEntry } from '@/lib/types/waitlist';
import { WaitlistToolbar } from './waitlist-toolbar';
import { WaitlistTable } from './waitlist-table';

interface WaitlistPageClientProps {
  initialItems: WaitlistEntry[];
}

export function WaitlistPageClient({ initialItems }: WaitlistPageClientProps) {
  const [globalFilter, setGlobalFilter] = useState('');

  return (
    <main className="pb-16 pt-6 lg:pt-8">
      <Container className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
              }}
            >
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1
                className="font-heading text-2xl font-bold md:text-3xl"
                style={{ color: 'var(--pv-text)' }}
              >
                Waitlist
              </h1>
              <p className="text-sm text-[var(--pv-text-muted)]">
                Pre-launch signups for Domani
              </p>
            </div>
          </div>
        </div>

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
      </Container>
    </main>
  );
}
