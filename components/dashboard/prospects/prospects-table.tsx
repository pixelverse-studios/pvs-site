'use client';

import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Prospect,
  ProspectSource,
  ProspectStatus,
  SOURCE_LABELS,
  STATUS_LABELS,
  SOURCE_COLORS,
  STATUS_COLORS,
} from './types';

// ─── Badge ────────────────────────────────────────────────────────────────────

function SourceBadge({ source }: { source: ProspectSource }) {
  const colors = SOURCE_COLORS[source];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        colors.bg,
        colors.text,
        colors.border,
      )}
    >
      {SOURCE_LABELS[source]}
    </span>
  );
}

function StatusBadge({ status }: { status: ProspectStatus }) {
  const colors = STATUS_COLORS[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        colors.bg,
        colors.text,
        colors.border,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

type SourceFilter = 'all' | ProspectSource;
type StatusFilter = 'all' | ProspectStatus;

interface FilterBarProps {
  sourceFilter: SourceFilter;
  statusFilter: StatusFilter;
  onSourceChange: (v: SourceFilter) => void;
  onStatusChange: (v: StatusFilter) => void;
  disabled?: boolean;
}

function FilterBar({
  sourceFilter,
  statusFilter,
  onSourceChange,
  onStatusChange,
  disabled,
}: FilterBarProps) {
  const selectClass =
    'rounded-lg border border-[var(--pv-border)] bg-[var(--pv-surface)] px-3 py-1.5 text-sm text-[var(--pv-text)] outline-none focus:border-[var(--pv-primary)] disabled:opacity-50';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={sourceFilter}
        onChange={(e) => onSourceChange(e.target.value as SourceFilter)}
        disabled={disabled}
        className={selectClass}
        aria-label="Filter by source"
      >
        <option value="all">All Sources</option>
        <option value="details_form">Details Form</option>
        <option value="review_request">Review Request</option>
        <option value="calendly_call">Calendly Call</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
        disabled={disabled}
        className={selectClass}
        aria-label="Filter by status"
      >
        <option value="all">All Statuses</option>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="qualified">Qualified</option>
        <option value="closed">Closed</option>
      </select>
    </div>
  );
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 w-full animate-pulse rounded-md bg-[var(--pv-border)]" />
        </td>
      ))}
    </tr>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <tr>
      <td colSpan={5}>
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)]">
            <Inbox className="h-6 w-6 text-[var(--pv-text-muted)]" />
          </span>
          <div>
            <p className="text-sm font-medium text-[var(--pv-text)]">
              {hasFilters ? 'No prospects match these filters' : 'No prospects yet'}
            </p>
            <p className="mt-0.5 text-xs text-[var(--pv-text-muted)]">
              {hasFilters
                ? 'Try adjusting your filter selections'
                : 'Prospects will appear when visitors submit forms or book calls'}
            </p>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  } catch {
    return '—';
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ProspectsTableProps {
  prospects: Prospect[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  sourceFilter: SourceFilter;
  statusFilter: StatusFilter;
  onSourceChange: (v: SourceFilter) => void;
  onStatusChange: (v: StatusFilter) => void;
  onPageChange: (p: number) => void;
  onSelectProspect: (prospect: Prospect) => void;
}

export function ProspectsTable({
  prospects,
  total,
  page,
  totalPages,
  loading,
  sourceFilter,
  statusFilter,
  onSourceChange,
  onStatusChange,
  onPageChange,
  onSelectProspect,
}: ProspectsTableProps) {
  const hasFilters = sourceFilter !== 'all' || statusFilter !== 'all';

  const formatDate = (dateStr: string) => {
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'just now';
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      if (days < 30) return `${days}d ago`;
      const months = Math.floor(days / 30);
      if (months < 12) return `${months}mo ago`;
      return `${Math.floor(months / 12)}y ago`;
    } catch {
      return '—';
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--pv-border)]">
      {/* Toolbar */}
      <div
        className="flex flex-col gap-3 border-b border-[var(--pv-border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        style={{ background: 'var(--pv-surface)' }}
      >
        <FilterBar
          sourceFilter={sourceFilter}
          statusFilter={statusFilter}
          onSourceChange={onSourceChange}
          onStatusChange={onStatusChange}
          disabled={loading}
        />
        {total > 0 && (
          <p className="text-xs text-[var(--pv-text-muted)]">
            {total} prospect{total !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr
              className="border-b border-[var(--pv-border)]"
              style={{ background: 'var(--pv-surface)' }}
            >
              {['Name / Email', 'Source', 'Status', 'First Seen', 'Last Activity'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--pv-border)]" style={{ background: 'var(--pv-bg)' }}>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
            ) : prospects.length === 0 ? (
              <EmptyState hasFilters={hasFilters} />
            ) : (
              prospects.map((prospect) => (
                <tr
                  key={prospect.id}
                  className="cursor-pointer transition-colors hover:bg-[color-mix(in_srgb,var(--pv-primary)_4%,transparent)]"
                  onClick={() => onSelectProspect(prospect)}
                >
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-[var(--pv-text)]">{prospect.name}</p>
                    <p className="text-xs text-[var(--pv-text-muted)]">{prospect.email}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <SourceBadge source={prospect.source} />
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={prospect.status} />
                  </td>
                  <td className="px-4 py-3.5 text-[var(--pv-text-muted)]">
                    {formatDate(prospect.first_seen)}
                  </td>
                  <td className="px-4 py-3.5 text-[var(--pv-text-muted)]">
                    {formatDate(prospect.last_activity)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between border-t border-[var(--pv-border)] px-4 py-3"
          style={{ background: 'var(--pv-surface)' }}
        >
          <p className="text-xs text-[var(--pv-text-muted)]">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--pv-border)] text-[var(--pv-text-muted)] transition-colors hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)] disabled:pointer-events-none disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--pv-border)] text-[var(--pv-text-muted)] transition-colors hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)] disabled:pointer-events-none disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export type { SourceFilter, StatusFilter };
