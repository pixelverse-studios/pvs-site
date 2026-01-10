'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import type { WaitlistEntry } from '@/lib/types/waitlist';
import { getWaitlistEntries } from '@/lib/api/waitlist';
import { WaitlistToolbar } from './waitlist-toolbar';
import { WaitlistTable } from './waitlist-table';
import { Pagination } from '@/components/ui/pagination';

interface WaitlistPageClientProps {
  initialItems: WaitlistEntry[];
  initialTotal: number;
}

const DEFAULT_PAGE_SIZE = 50;

export function WaitlistPageClient({ initialItems, initialTotal }: WaitlistPageClientProps) {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [globalFilter, setGlobalFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async (page: number, size: number) => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * size;
      const response = await getWaitlistEntries({ limit: size, offset });
      setItems(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch waitlist entries:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch when pagination changes (skip initial render)
  useEffect(() => {
    // Skip initial render - we already have initialItems
    if (currentPage === 1 && pageSize === DEFAULT_PAGE_SIZE) {
      return;
    }
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize, fetchData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setGlobalFilter(''); // Reset search when changing pages
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
    setGlobalFilter(''); // Reset search when changing page size
  };

  return (
    <>
      {/* Toolbar */}
      <div className="mb-6">
        <WaitlistToolbar
          searchValue={globalFilter}
          onSearchChange={setGlobalFilter}
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
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
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
