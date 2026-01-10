'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types/domani-users';
import { getDomaniUsers } from '@/lib/api/domani-users';
import { UsersToolbar, type UsersFilters } from './users-toolbar';
import { UsersTable } from './users-table';
import { Pagination } from '@/components/ui/pagination';
import type { DateRange } from '@/components/ui/date-range-filter';

interface UsersPageClientProps {
  initialItems: UserProfile[];
  initialTotal: number;
}

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_DATE_RANGE: DateRange = { preset: 'all', startDate: null, endDate: null };

export function UsersPageClient({ initialItems, initialTotal }: UsersPageClientProps) {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [filters, setFilters] = useState<UsersFilters>({
    search: '',
    tier: 'all',
    cohort: 'all',
    includeDeleted: false,
    dateRange: DEFAULT_DATE_RANGE,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);

  const fetchData = useCallback(async (page: number, size: number, includeDeleted: boolean, dateRange: DateRange) => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * size;
      const response = await getDomaniUsers({
        limit: size,
        offset,
        include_deleted: includeDeleted,
        start_date: dateRange.startDate || undefined,
        end_date: dateRange.endDate || undefined,
      });
      setItems(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch when pagination or filters change
  useEffect(() => {
    // Skip initial render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchData(currentPage, pageSize, filters.includeDeleted, filters.dateRange);
  }, [currentPage, pageSize, filters.includeDeleted, filters.dateRange, fetchData]);

  const handleFiltersChange = (newFilters: UsersFilters) => {
    // If date range or includeDeleted changed, reset to page 1
    if (
      newFilters.dateRange.preset !== filters.dateRange.preset ||
      newFilters.dateRange.startDate !== filters.dateRange.startDate ||
      newFilters.dateRange.endDate !== filters.dateRange.endDate ||
      newFilters.includeDeleted !== filters.includeDeleted
    ) {
      setCurrentPage(1);
    }
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Filter and sort items (client-side filtering on current page)
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

    // Deleted filter (already handled server-side, but apply here for initial render)
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
      total: total,
      active: items.filter((item) => !item.deleted_at).length,
    }),
    [items, total],
  );

  return (
    <>
      {/* Toolbar */}
      <div className="mb-6">
        <UsersToolbar filters={filters} onFiltersChange={handleFiltersChange} counts={counts} />
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--pv-primary)]" />
          <span className="ml-2 text-sm text-[var(--pv-text-muted)]">Loading...</span>
        </div>
      ) : (
        /* Table */
        <UsersTable items={filteredItems} />
      )}

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalItems={total}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </>
  );
}
