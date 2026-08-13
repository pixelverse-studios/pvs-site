'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, FileText, Loader2, Plus, RotateCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { listReleases } from '@/lib/api/admin-releases';
import type {
  AdminRelease,
  AdminReleaseCapabilities,
  ReleaseLifecycle,
  ReleaseVisibility,
} from '@/lib/types/admin-release';
import { cn } from '@/lib/utils';
import { lifecycleLabels, panelClass, ReleaseBadge } from './release-ui';
import { formatReleasedDate } from './release-rules';

type ReleaseFilter = 'all' | ReleaseLifecycle | 'archived';
type VisibilityFilter = 'all' | ReleaseVisibility;

const filters: Array<{ label: string; value: ReleaseFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Planning', value: 'in_progress' },
  { label: 'Planned', value: 'planned' },
  { label: 'Released', value: 'released' },
  { label: 'Canceled', value: 'canceled' },
  { label: 'Archived', value: 'archived' },
];

const visibilityFilters: Array<{ label: string; value: VisibilityFilter }> = [
  { label: 'Any visibility', value: 'all' },
  { label: 'Private', value: 'private' },
  { label: 'Public preview', value: 'public_preview' },
  { label: 'Published', value: 'published' },
];

function targetLabel(release: AdminRelease) {
  if (release.releasedAt) return `Released ${formatReleasedDate(release.releasedAt)}`;
  const raw = release.confirmedDate || release.targetDate;
  if (raw)
    return `${release.confirmedDate ? 'Confirmed' : 'Target'} ${new Date(`${raw}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  if (release.targetMonth)
    return `Target ${new Date(`${release.targetMonth}-01T00:00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
  return 'No date set';
}

export function ReleasesPageClient() {
  const [releases, setReleases] = useState<AdminRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<ReleaseFilter>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
  const [capabilities, setCapabilities] = useState<AdminReleaseCapabilities>({
    canCreateRelease: false,
    canViewArchivedReleases: false,
  });
  const loadSequence = useRef(0);
  const showArchived = activeFilter === 'archived';

  const load = useCallback(async () => {
    const sequence = ++loadSequence.current;
    setLoading(true);
    setError(null);
    try {
      const response = await listReleases(showArchived ? { archived: true } : undefined);
      if (sequence !== loadSequence.current) return;
      setReleases(response.data.releases);
      setCapabilities(response.data.capabilities);
    } catch (caught) {
      if (sequence !== loadSequence.current) return;
      setError(caught instanceof Error ? caught.message : 'Failed to load releases.');
    } finally {
      if (sequence === loadSequence.current) setLoading(false);
    }
  }, [showArchived]);

  useEffect(() => {
    void load();
  }, [load]);

  const visibleReleases = useMemo(() => {
    const query = search.trim().toLowerCase();
    return releases.filter((release) => {
      const matchesFilter =
        activeFilter === 'all' ||
        activeFilter === 'archived' ||
        release.lifecycleStatus === activeFilter;
      const matchesVisibility =
        visibilityFilter === 'all' || release.visibility === visibilityFilter;
      const matchesQuery =
        !query ||
        `${release.version} ${release.title} ${release.slug}`.toLowerCase().includes(query);
      return matchesFilter && matchesVisibility && matchesQuery;
    });
  }, [activeFilter, releases, search, visibilityFilter]);

  const stats = useMemo(
    () => ({
      drafts: releases.filter((release) => release.lifecycleStatus === 'draft').length,
      planned: releases.filter((release) => release.lifecycleStatus === 'planned').length,
      public: releases.filter((release) => release.visibility !== 'private').length,
      private: releases.filter((release) => release.visibility === 'private').length,
    }),
    [releases],
  );

  return (
    <div className="w-full pb-10">
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pv-primary)]">
            Release operations
          </p>
          <h2 className="font-heading text-3xl font-bold text-[var(--pv-text)]">Releases</h2>
          <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
            Plan, draft, approve, and publish Domani release notes.
          </p>
        </div>
        {capabilities.canCreateRelease && (
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/domani/releases/new">
              <Plus className="mr-2 h-4 w-4" />
              New release
            </Link>
          </Button>
        )}
      </div>

      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Drafts', stats.drafts, 'Need copy and note review', 'bg-violet-100 text-violet-700'],
          ['Planned', stats.planned, 'Scheduled releases', 'bg-amber-100 text-amber-700'],
          ['Public', stats.public, 'Preview or published', 'bg-emerald-100 text-emerald-700'],
          ['Private', stats.private, 'Internal only', 'bg-blue-100 text-blue-700'],
        ].map(([label, value, helper, color], index) => (
          <div key={String(label)} className={cn(panelClass, 'p-5')}>
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold',
                  color as string,
                )}
              >
                {index + 1}
              </span>
              <div>
                <p className="text-2xl font-bold text-[var(--pv-text)]">{value}</p>
                <p className="text-sm font-semibold text-[var(--pv-text-muted)]">{label}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-[var(--pv-text-muted)]">{helper}</p>
          </div>
        ))}
      </div>

      <div className={cn(panelClass, 'mb-5 flex flex-col gap-4 p-4')}>
        <label className="relative block min-w-0 flex-1 lg:max-w-sm">
          <span className="sr-only">Search releases</span>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--pv-text-muted)]" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search versions or release title"
            className="pl-10"
          />
        </label>
        <div className="grid gap-3 lg:grid-cols-[auto_1fr] lg:items-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--pv-text-muted)]">
            Status
          </span>
          <div
            className="flex gap-2 overflow-x-auto pb-1 lg:pb-0"
            aria-label="Filter releases by status"
          >
            {filters
              .filter(
                (filter) => filter.value !== 'archived' || capabilities.canViewArchivedReleases,
              )
              .map((filter) => (
                <FilterButton
                  key={filter.value}
                  active={activeFilter === filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                >
                  {filter.label}
                </FilterButton>
              ))}
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--pv-text-muted)]">
            Visibility
          </span>
          <div
            className="flex gap-2 overflow-x-auto pb-1 lg:pb-0"
            aria-label="Filter releases by visibility"
          >
            {visibilityFilters.map((filter) => (
              <FilterButton
                key={filter.value}
                active={visibilityFilter === filter.value}
                onClick={() => setVisibilityFilter(filter.value)}
              >
                {filter.label}
              </FilterButton>
            ))}
          </div>
        </div>
      </div>

      {error ? (
        <div
          className={cn(panelClass, 'flex flex-col items-center px-6 py-14 text-center')}
          role="alert"
        >
          <AlertTriangle className="mb-3 h-7 w-7 text-red-500" />
          <h3 className="font-semibold text-[var(--pv-text)]">Releases could not be loaded</h3>
          <p className="mt-1 max-w-lg text-sm text-[var(--pv-text-muted)]">{error}</p>
          <Button variant="secondary" size="sm" className="mt-5" onClick={() => void load()}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      ) : loading ? (
        <div className="space-y-3" aria-label="Loading releases">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={cn(panelClass, 'h-[98px] animate-pulse bg-[var(--pv-surface)]')}
            />
          ))}
        </div>
      ) : visibleReleases.length === 0 ? (
        <div className={cn(panelClass, 'flex flex-col items-center px-6 py-14 text-center')}>
          <FileText className="mb-3 h-7 w-7 text-[var(--pv-primary)]" />
          <h3 className="font-semibold text-[var(--pv-text)]">
            {releases.length
              ? 'No matching releases'
              : showArchived
                ? 'No archived releases'
                : 'No releases yet'}
          </h3>
          <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
            {releases.length
              ? 'Try another search or filter.'
              : showArchived
                ? 'Archived releases will appear here for administrative review.'
                : 'Create the first release to begin planning the public release timeline.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleReleases.map((release) => (
            <Link
              key={release.id}
              href={`/dashboard/domani/releases/${release.id}${showArchived ? '?archived=true' : ''}`}
              className={cn(
                panelClass,
                'group grid gap-4 p-5 transition hover:-translate-y-0.5 hover:border-[var(--pv-primary)] hover:shadow-lg sm:grid-cols-[100px_1fr] lg:grid-cols-[100px_1fr_auto_auto_auto] lg:items-center',
              )}
            >
              <div>
                <p className="text-xl font-bold text-[var(--pv-text)]">{release.version}</p>
                <p className="mt-1 text-xs font-medium text-[var(--pv-text-muted)]">
                  {targetLabel(release)}
                </p>
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-[var(--pv-text)]">{release.title}</p>
                <p className="mt-1 truncate text-xs text-[var(--pv-text-muted)]">
                  {release.publicSummary ||
                    release.internalSummary ||
                    `${lifecycleLabels[release.lifecycleStatus]} release`}
                </p>
              </div>
              <ReleaseBadge kind="lifecycle" value={release.lifecycleStatus} />
              <span className="inline-flex rounded-full bg-[var(--pv-surface)] px-3 py-1 text-xs font-semibold capitalize text-[var(--pv-text-muted)]">
                {release.releaseType}
              </span>
              <ReleaseBadge kind="visibility" value={release.visibility} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-ring)]',
        active
          ? 'bg-[#1f1b2b] text-white'
          : 'bg-[var(--pv-surface)] text-[var(--pv-text-muted)] hover:text-[var(--pv-text)]',
      )}
    >
      {children}
    </button>
  );
}
