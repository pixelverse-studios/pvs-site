'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { WaitlistEntry } from '@/lib/types/waitlist';
import { getWaitlistEntries } from '@/lib/api/waitlist';
import { WaitlistToolbar, type WaitlistFilters } from './waitlist-toolbar';
import { WaitlistTable } from './waitlist-table';
import { Pagination } from '@/components/ui/pagination';
import type { DateRange } from '@/components/ui/date-range-filter';

interface WaitlistPageClientProps {
  initialItems: WaitlistEntry[];
  initialTotal: number;
}

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_DATE_RANGE: DateRange = { preset: 'all', startDate: null, endDate: null };

export function WaitlistPageClient({ initialItems, initialTotal }: WaitlistPageClientProps) {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [filters, setFilters] = useState<WaitlistFilters>({
    search: '',
    dateRange: DEFAULT_DATE_RANGE,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);

  const fetchData = useCallback(async (page: number, size: number, dateRange: DateRange) => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * size;
      const response = await getWaitlistEntries({
        limit: size,
        offset,
        start_date: dateRange.startDate || undefined,
        end_date: dateRange.endDate || undefined,
      });
      setItems(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch waitlist entries:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch when pagination or date range changes
  useEffect(() => {
    // Skip initial render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchData(currentPage, pageSize, filters.dateRange);
  }, [currentPage, pageSize, filters.dateRange, fetchData]);

  const handleFiltersChange = (newFilters: WaitlistFilters) => {
    // If date range changed, reset to page 1 and fetch
    if (
      newFilters.dateRange.preset !== filters.dateRange.preset ||
      newFilters.dateRange.startDate !== filters.dateRange.startDate ||
      newFilters.dateRange.endDate !== filters.dateRange.endDate
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

  return (
    <>
      {/* Toolbar */}
      <div className="mb-6">
        <WaitlistToolbar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          total={total}
        />
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--pv-primary)]" />
          <span className="ml-2 text-sm text-[var(--pv-text-muted)]">Loading...</span>
        </div>
      ) : (
        /* Table */
        <WaitlistTable
          items={items}
          globalFilter={filters.search}
          onGlobalFilterChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
        />
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
