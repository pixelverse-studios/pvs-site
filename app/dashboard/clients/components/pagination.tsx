import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
}

export function Pagination({ currentPage, totalPages, total, limit }: PaginationProps) {
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // Calculate showing range
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  // Don't show pagination if only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
      {/* Results info */}
      <p className="text-sm text-[var(--pv-text-muted)]">
        Showing <span className="font-medium text-[var(--pv-text)]">{startItem}</span> to{' '}
        <span className="font-medium text-[var(--pv-text)]">{endItem}</span> of{' '}
        <span className="font-medium text-[var(--pv-text)]">{total}</span> clients
      </p>

      {/* Navigation */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        {hasPrevious ? (
          <Link
            href={`/dashboard/clients?page=${currentPage - 1}${limit !== 20 ? `&limit=${limit}` : ''}`}
            className="inline-flex items-center gap-1 rounded-pv-sm border border-[var(--pv-border)] bg-[var(--pv-surface)] px-3 py-2 text-sm font-medium text-[var(--pv-text)] transition-colors hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-pv-sm border border-[var(--pv-border)] bg-[var(--pv-surface)] px-3 py-2 text-sm font-medium text-[var(--pv-text-muted)] opacity-50">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </span>
        )}

        {/* Page indicator */}
        <span className="px-3 text-sm text-[var(--pv-text-muted)]">
          Page <span className="font-medium text-[var(--pv-text)]">{currentPage}</span> of{' '}
          <span className="font-medium text-[var(--pv-text)]">{totalPages}</span>
        </span>

        {/* Next Button */}
        {hasNext ? (
          <Link
            href={`/dashboard/clients?page=${currentPage + 1}${limit !== 20 ? `&limit=${limit}` : ''}`}
            className="inline-flex items-center gap-1 rounded-pv-sm border border-[var(--pv-border)] bg-[var(--pv-surface)] px-3 py-2 text-sm font-medium text-[var(--pv-text)] transition-colors hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)]"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-pv-sm border border-[var(--pv-border)] bg-[var(--pv-surface)] px-3 py-2 text-sm font-medium text-[var(--pv-text-muted)] opacity-50">
            Next
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </div>
  );
}
