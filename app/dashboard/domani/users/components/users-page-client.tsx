'use client';

import { useState, useMemo } from 'react';
import type { UserProfile } from '@/lib/types/domani-users';
import { UsersToolbar, type UsersFilters } from './users-toolbar';
import { UsersTable } from './users-table';

interface UsersPageClientProps {
  initialItems: UserProfile[];
}

export function UsersPageClient({ initialItems }: UsersPageClientProps) {
  const [items] = useState(initialItems);
  const [filters, setFilters] = useState<UsersFilters>({
    search: '',
    tier: 'all',
    cohort: 'all',
    includeDeleted: false,
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
          (item.full_name && item.full_name.toLowerCase().includes(searchLower)),
      );
    }

    // Tier filter
    if (filters.tier !== 'all') {
      result = result.filter((item) => item.tier === filters.tier);
    }

    // Cohort filter
    if (filters.cohort !== 'all') {
      result = result.filter((item) => item.signup_cohort === filters.cohort);
    }

    // Deleted filter
    if (!filters.includeDeleted) {
      result = result.filter((item) => !item.deleted_at);
    }

    // Sort by created_at descending (newest first)
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return result;
  }, [items, filters]);

  // Count stats
  const counts = useMemo(
    () => ({
      total: items.length,
      active: items.filter((item) => !item.deleted_at).length,
    }),
    [items],
  );

  return (
    <>
      {/* Toolbar */}
      <div className="mb-6">
        <UsersToolbar filters={filters} onFiltersChange={setFilters} counts={counts} />
      </div>

      {/* Table */}
      <UsersTable items={filteredItems} />
    </>
  );
}
