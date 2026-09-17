'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import type {
  FeedbackListResponse,
  FeedbackSource,
  WritableFeedbackStatus,
} from '@/lib/types/feedback';
import { getFeedbackItems, updateFeedbackStatus } from '@/lib/api/feedback';
import { FeedbackToolbar, type FeedbackFilters } from './feedback-toolbar';
import { FeedbackTable } from './feedback-table';
import { Pagination } from '@/components/ui/pagination';
import { RequestError } from '@/components/ui/request-error';

export function FeedbackPageClient({
  initialData,
  initialError,
}: {
  initialData?: FeedbackListResponse;
  initialError?: string;
}) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(initialError);
  const [statusError, setStatusError] = useState<string>();
  const [filters, setFilters] = useState<FeedbackFilters>({
    search: '',
    category: 'all',
    status: 'all',
    platform: 'all',
    source: 'all',
    dateRange: { preset: 'all', startDate: null, endDate: null },
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const mutationLock = useRef(false);
  const requestNumber = useRef(0);
  const initialQuery = useRef(true);
  const controller = useRef<AbortController>();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(filters.search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    if (initialQuery.current && initialData) {
      initialQuery.current = false;
      return;
    }
    initialQuery.current = false;
    const abort = new AbortController();
    controller.current = abort;
    const number = ++requestNumber.current;
    setLoading(true);
    setError(undefined);
    getFeedbackItems(
      {
        search: search || undefined,
        category: filters.category === 'all' ? undefined : filters.category,
        status: filters.status === 'all' ? undefined : filters.status,
        platform: filters.platform === 'all' ? undefined : filters.platform,
        source: filters.source === 'all' ? undefined : filters.source,
        start_date: filters.dateRange.startDate || undefined,
        end_date: filters.dateRange.endDate || undefined,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        sort_by: 'created_at',
        sort_order: 'desc',
      },
      abort.signal,
    )
      .then((response) => {
        if (abort.signal.aborted || number !== requestNumber.current) return;
        const lastPage = Math.max(1, Math.ceil(response.total / pageSize));
        if (page > lastPage) {
          setPage(lastPage);
          return;
        }
        setData(response);
      })
      .catch((failure) => {
        if (!abort.signal.aborted && number === requestNumber.current)
          setError(failure instanceof Error ? failure.message : 'Feedback service unavailable.');
      })
      .finally(() => {
        if (!abort.signal.aborted && number === requestNumber.current) setLoading(false);
      });
    return () => abort.abort();
  }, [
    search,
    filters.category,
    filters.status,
    filters.platform,
    filters.source,
    filters.dateRange,
    page,
    pageSize,
    revision,
    initialData,
  ]);

  async function handleStatusChange(
    id: string,
    source: FeedbackSource,
    status: WritableFeedbackStatus,
  ) {
    if (mutationLock.current) return;
    mutationLock.current = true;
    setSaving(true);
    setStatusError(undefined);
    controller.current?.abort();
    ++requestNumber.current;
    try {
      const item = await updateFeedbackStatus(id, source, status);
      setData(
        (previous) =>
          previous && {
            ...previous,
            items: previous.items.map((existing) =>
              existing.id === id && existing.source === source ? item : existing,
            ),
          },
      );
    } catch (failure) {
      setStatusError(failure instanceof Error ? failure.message : 'Failed to update status.');
    } finally {
      mutationLock.current = false;
      setSaving(false);
      setRevision((value) => value + 1);
    }
  }

  const refreshing = loading || search !== filters.search;

  return (
    <>
      <div className="mb-6">
        <FeedbackToolbar
          filters={filters}
          onFiltersChange={(next) => {
            setFilters(next);
            if (next.search === filters.search) setPage(1);
          }}
          counts={
            data && !refreshing && !error
              ? { total: data.stats.total, new: data.stats.by_status.new }
              : undefined
          }
        />
      </div>
      {statusError && (
        <div className="mb-4">
          <RequestError title="Status update failed" message={statusError} />
        </div>
      )}
      {error && (
        <div className="mb-4">
          <RequestError
            title="Feedback unavailable"
            message={error}
            detail={data ? 'Previously loaded results are shown below.' : undefined}
            action={{ label: 'Retry', onClick: () => setRevision((value) => value + 1) }}
          />
        </div>
      )}
      {refreshing && (
        <div role="status" className="flex items-center gap-2 py-4">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading feedback… Previous results remain visible until the refresh completes.
        </div>
      )}
      {data && (
        <FeedbackTable
          items={data.items}
          onStatusChange={handleStatusChange}
          disabled={saving || refreshing || !!error}
          statusError={statusError}
          refreshError={error}
          refreshing={refreshing}
          onRetry={() => setRevision((value) => value + 1)}
        />
      )}
      {data && !error && !refreshing && (
        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalItems={data.total}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>
      )}
    </>
  );
}
