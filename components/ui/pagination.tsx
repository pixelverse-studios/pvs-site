'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [25, 50, 100],
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-4 sm:flex-row',
        className
      )}
    >
      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="page-size"
          className="text-sm text-[var(--pv-text-muted)]"
        >
          Rows per page:
        </label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg border px-2 py-1.5 text-sm outline-none transition-colors focus:border-[var(--pv-primary)]"
          style={{
            borderColor: 'var(--pv-border)',
            background: 'var(--pv-surface)',
            color: 'var(--pv-text)',
          }}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Results count and navigation */}
      <div className="flex items-center gap-4">
        {/* Results count */}
        <span className="text-sm text-[var(--pv-text-muted)]">
          {totalItems === 0 ? (
            'No results'
          ) : (
            <>
              Showing{' '}
              <span className="font-medium" style={{ color: 'var(--pv-text)' }}>
                {startItem}-{endItem}
              </span>{' '}
              of{' '}
              <span className="font-medium" style={{ color: 'var(--pv-text)' }}>
                {totalItems}
              </span>
            </>
          )}
        </span>

        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            aria-label="Previous page"
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors',
              canGoPrevious
                ? 'hover:bg-[var(--pv-surface)] hover:border-[var(--pv-primary)]'
                : 'cursor-not-allowed opacity-50'
            )}
            style={{
              borderColor: 'var(--pv-border)',
              color: 'var(--pv-text)',
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page indicator */}
          {totalPages > 0 && (
            <span
              className="min-w-[80px] px-2 text-center text-sm"
              style={{ color: 'var(--pv-text)' }}
            >
              Page {currentPage} of {totalPages}
            </span>
          )}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            aria-label="Next page"
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors',
              canGoNext
                ? 'hover:bg-[var(--pv-surface)] hover:border-[var(--pv-primary)]'
                : 'cursor-not-allowed opacity-50'
            )}
            style={{
              borderColor: 'var(--pv-border)',
              color: 'var(--pv-text)',
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
