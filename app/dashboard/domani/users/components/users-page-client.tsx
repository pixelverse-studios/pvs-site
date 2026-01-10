'use client';

import { useState, useMemo } from 'react';
import { UserCircle } from 'lucide-react';
import { Container } from '@/components/ui/container';
import type { UserProfile, UserTier, SignupCohort } from '@/lib/types/domani-users';
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
    <main className="pb-16 pt-6 lg:pt-8">
      <Container className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              }}
            >
              <UserCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1
                className="font-heading text-2xl font-bold md:text-3xl"
                style={{ color: 'var(--pv-text)' }}
              >
                Users
              </h1>
              <p className="text-sm text-[var(--pv-text-muted)]">
                Active Domani app users
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-6">
          <UsersToolbar filters={filters} onFiltersChange={setFilters} counts={counts} />
        </div>

        {/* Table */}
        <UsersTable items={filteredItems} />
      </Container>
    </main>
  );
}
