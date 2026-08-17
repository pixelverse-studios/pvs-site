import { cn } from '@/lib/utils';
import type {
  ReleaseLifecycle,
  ReleasePlatform,
  ReleaseVisibility,
} from '@/lib/types/admin-release';

const lifecycleStyles: Record<ReleaseLifecycle, string> = {
  draft: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  planned: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  in_progress: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
  released: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  canceled: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300',
};

const visibilityStyles: Record<ReleaseVisibility, string> = {
  private: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  public_preview: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  published: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
};

export const lifecycleLabels: Record<ReleaseLifecycle, string> = {
  draft: 'Draft',
  planned: 'Planned',
  in_progress: 'In progress',
  released: 'Released',
  canceled: 'Canceled',
};

export const visibilityLabels: Record<ReleaseVisibility, string> = {
  private: 'Private',
  public_preview: 'Public preview',
  published: 'Published',
};

export function ReleaseBadge({
  value,
  kind,
  className,
}: {
  value: ReleaseLifecycle | ReleaseVisibility;
  kind: 'lifecycle' | 'visibility';
  className?: string;
}) {
  const styles =
    kind === 'lifecycle'
      ? lifecycleStyles[value as ReleaseLifecycle]
      : visibilityStyles[value as ReleaseVisibility];
  const label =
    kind === 'lifecycle'
      ? lifecycleLabels[value as ReleaseLifecycle]
      : visibilityLabels[value as ReleaseVisibility];
  return (
    <span
      className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold', styles, className)}
    >
      {label}
    </span>
  );
}

export function PlatformBadge({ platforms }: { platforms: ReleasePlatform[] }) {
  const label =
    platforms.length === 2 ? 'iOS + Android' : platforms[0] === 'ios' ? 'iOS' : 'Android';
  return (
    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
      {label}
    </span>
  );
}

export const panelClass =
  'rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-bg)] shadow-[0_16px_45px_-38px_rgba(20,16,35,0.45)]';

export const mantineFieldClassNames = {
  input:
    'border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-text)] placeholder:text-[var(--pv-text-muted)] focus:border-[var(--pv-primary)]',
  error: 'text-xs text-red-600 dark:text-red-300',
};

export const mantineSelectClassNames = {
  ...mantineFieldClassNames,
  dropdown: 'border-[var(--pv-border)] bg-[var(--pv-bg)] text-[var(--pv-text)]',
  option: 'text-sm data-[checked]:bg-violet-100 data-[checked]:text-violet-800',
};
