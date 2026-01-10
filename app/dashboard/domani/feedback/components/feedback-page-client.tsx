'use client';

import { useState, useMemo, useCallback } from 'react';
import type { UnifiedFeedbackItem, FeedbackStatus } from '@/lib/types/feedback';
import { updateFeedbackStatus } from '@/lib/api/feedback';
import { FeedbackToolbar, type FeedbackFilters } from './feedback-toolbar';
import { FeedbackTable } from './feedback-table';

interface FeedbackPageClientProps {
  initialItems: UnifiedFeedbackItem[];
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

export function FeedbackPageClient({ initialItems }: FeedbackPageClientProps) {
  const [items, setItems] = useState(initialItems);
  const [toast, setToast] = useState<Toast | null>(null);
  const [filters, setFilters] = useState<FeedbackFilters>({
    search: '',
    category: 'all',
    status: 'all',
    platform: 'all',
    source: 'all',
  });

  // Auto-hide toast
  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Filter and sort items
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
      total: items.length,
      new: items.filter((item) => item.status === 'new').length,
    }),
    [items],
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
        <FeedbackToolbar filters={filters} onFiltersChange={setFilters} counts={counts} />
      </div>

      {/* Table */}
      <FeedbackTable items={filteredItems} onStatusChange={handleStatusChange} />
    </>
  );
}
