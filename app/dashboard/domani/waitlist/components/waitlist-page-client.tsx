'use client';

import { useState, useMemo } from 'react';
import { Users } from 'lucide-react';
import { Container } from '@/components/ui/container';
import type { WaitlistEntry } from '@/lib/types/waitlist';
import { WaitlistToolbar, type WaitlistFilters } from './waitlist-toolbar';
import { WaitlistTable } from './waitlist-table';

interface WaitlistPageClientProps {
  initialItems: WaitlistEntry[];
}

export function WaitlistPageClient({ initialItems }: WaitlistPageClientProps) {
  const [items] = useState(initialItems);
  const [filters, setFilters] = useState<WaitlistFilters>({
    search: '',
    status: 'all',
    confirmed: 'all',
  });

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.email.toLowerCase().includes(searchLower) ||
          (item.name && item.name.toLowerCase().includes(searchLower)),
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter((item) => item.status === filters.status);
    }

    // Confirmed filter
    if (filters.confirmed !== 'all') {
      const isConfirmed = filters.confirmed === 'true';
      result = result.filter((item) => item.confirmed === isConfirmed);
    }

    // Sort by created_at descending (newest first)
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return result;
  }, [items, filters]);

  // Count stats
  const counts = useMemo(
    () => ({
      total: items.length,
      confirmed: items.filter((item) => item.confirmed).length,
    }),
    [items],
  );

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
          <WaitlistToolbar filters={filters} onFiltersChange={setFilters} counts={counts} />
        </div>

        {/* Table */}
        <WaitlistTable items={filteredItems} />
      </Container>
    </main>
  );
}
