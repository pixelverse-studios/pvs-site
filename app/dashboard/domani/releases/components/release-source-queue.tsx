import Link from 'next/link';
import { ArrowRight, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AdminReleaseDetail, AdminReleaseSource } from '@/lib/types/admin-release';
import { cn } from '@/lib/utils';
import { panelClass } from './release-ui';

const sourceLabel = (source: AdminReleaseSource) => {
  if (source.sourceType === 'linear_epic') return 'Linear epic';
  if (source.sourceType === 'linear_ticket') return 'Linear ticket';
  if (source.sourceType === 'milestone') return 'Milestone';
  return 'Manual source';
};

const status = (source: AdminReleaseSource) => {
  if (source.conversionStatus === 'raw') return 'Raw';
  if (source.conversionStatus === 'needs_review') return 'Needs review';
  if (source.conversionStatus === 'approved') return 'Approved';
  if (source.conversionStatus === 'failed') return 'Failed';
  return 'Superseded';
};

export function ReleaseSourceQueue({ release }: { release: AdminReleaseDetail }) {
  const activeSources = release.sources.filter(
    (source) => source.conversionStatus !== 'superseded',
  );

  return (
    <section className="border-t border-[var(--pv-border)] pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
            Markdown sources
          </p>
          <h2 className="mt-1 text-xl font-bold text-[var(--pv-text)]">
            Import and conversion queue
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--pv-text-muted)]">
            Keep the original planning source beside the private notes generated from it.
          </p>
        </div>
        <Button asChild type="button" variant="outline">
          <Link href={`/dashboard/domani/releases/import?releaseId=${release.id}`}>
            <Plus className="mr-2 h-4 w-4" /> Import Markdown
          </Link>
        </Button>
      </div>

      {activeSources.length ? (
        <div className="mt-5 space-y-3">
          {activeSources.map((source) => (
            <Link
              key={source.id}
              href={`/dashboard/domani/releases/${release.id}/sources/${source.id}`}
              className={cn(
                panelClass,
                'group grid gap-4 p-5 transition hover:border-violet-400 hover:shadow-md sm:grid-cols-[auto_1fr_auto] sm:items-center',
              )}
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-100 text-violet-700">
                <FileText className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-semibold text-[var(--pv-text)]">
                  {source.sourceReference}
                </span>
                <span className="mt-1 block text-xs text-[var(--pv-text-muted)]">
                  {sourceLabel(source)}
                  {source.originalFilename ? ` · ${source.originalFilename}` : ''}
                </span>
              </span>
              <span className="flex items-center gap-3">
                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                  {status(source)}
                </span>
                <ArrowRight className="h-4 w-4 text-[var(--pv-text-muted)] transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-[var(--pv-border)] px-6 py-10 text-center">
          <FileText className="mx-auto h-6 w-6 text-[var(--pv-text-muted)]" />
          <h3 className="mt-3 text-sm font-semibold text-[var(--pv-text)]">
            No Markdown sources yet
          </h3>
          <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
            Import an epic, ticket, milestone, or manual Markdown source when you need conversion
            help.
          </p>
        </div>
      )}
    </section>
  );
}
