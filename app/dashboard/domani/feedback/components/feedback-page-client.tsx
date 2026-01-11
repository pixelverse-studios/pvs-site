'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { UnifiedFeedbackItem, FeedbackStatus } from '@/lib/types/feedback';
import { getFeedbackItems, updateFeedbackStatus } from '@/lib/api/feedback';
import { FeedbackToolbar, type FeedbackFilters } from './feedback-toolbar';
import { FeedbackTable } from './feedback-table';
import { Pagination } from '@/components/ui/pagination';
import type { DateRange } from '@/components/ui/date-range-filter';

interface FeedbackPageClientProps {
  initialItems: UnifiedFeedbackItem[];
  initialTotal: number;
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_DATE_RANGE: DateRange = { preset: 'all', startDate: null, endDate: null };

export function FeedbackPageClient({ initialItems, initialTotal }: FeedbackPageClientProps) {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [toast, setToast] = useState<Toast | null>(null);
  const [filters, setFilters] = useState<FeedbackFilters>({
    search: '',
    category: 'all',
    status: 'all',
    platform: 'all',
    source: 'all',
    dateRange: DEFAULT_DATE_RANGE,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);

  // Auto-hide toast
  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchData = useCallback(async (page: number, size: number, dateRange: DateRange) => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * size;
      const response = await getFeedbackItems({
        limit: size,
        offset,
        start_date: dateRange.startDate || undefined,
        end_date: dateRange.endDate || undefined,
      });
      setItems(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch feedback items:', error);
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

  const handleFiltersChange = (newFilters: FeedbackFilters) => {
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

  // Filter and sort items (client-side filtering on current page)
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.email.toLowerCase().includes(searchLower) ||
          item.message.toLowerCase().includes(searchLower),
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      result = result.filter((item) => item.category === filters.category);
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter((item) => item.status === filters.status);
    }

    // Platform filter
    if (filters.platform !== 'all') {
      result = result.filter((item) => item.platform === filters.platform);
    }

    // Source filter
    if (filters.source !== 'all') {
      result = result.filter((item) => item.source === filters.source);
    }

    // Sort by created_at descending (newest first)
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return result;
  }, [items, filters]);

  // Count stats
  const counts = useMemo(
    () => ({
      total: total,
      new: items.filter((item) => item.status === 'new').length,
    }),
    [items, total],
  );

  // Handle status change
  const handleStatusChange = async (
    id: string,
    source: 'beta_feedback' | 'support_request',
    newStatus: FeedbackStatus,
  ) => {
    const item = items.find((i) => i.id === id);
    if (!item || item.status === newStatus) return;

    const originalStatus = item.status;

    // Optimistic update
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));

    try {
      await updateFeedbackStatus(id, source, newStatus);
      showToast('success', `Status updated to ${newStatus}`);
    } catch {
      // Revert on error
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: originalStatus } : i)));
      showToast('error', 'Failed to update status');
    }
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
            toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Toolbar */}
      <div className="mb-6">
        <FeedbackToolbar filters={filters} onFiltersChange={handleFiltersChange} counts={counts} />
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--pv-primary)]" />
          <span className="ml-2 text-sm text-[var(--pv-text-muted)]">Loading...</span>
        </div>
      ) : (
        /* Table */
        <FeedbackTable items={filteredItems} onStatusChange={handleStatusChange} />
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
