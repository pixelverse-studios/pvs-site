import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description: React.ReactNode;
}

export function InfoCard({ className, icon: Icon, title, description, ...props }: InfoCardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--pv-bg)]/85 dark:bg-[var(--pv-surface)]/85 group relative flex h-full flex-col gap-4 overflow-hidden rounded-pv border border-[var(--pv-border)] p-8 shadow-pv transition-colors-opacity-transform',
        'before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-[var(--pv-gradient)] before:opacity-70 before:transition-opacity before:duration-300',
        'after:absolute after:inset-0 after:-z-10 after:bg-[radial-gradient(circle_at_top,var(--pv-primary)/0.12,transparent_65%)] after:opacity-0 after:transition-opacity after:duration-300',
        'hover:border-[var(--pv-primary)] hover:shadow-[0_25px_50px_-30px_rgba(63,0,233,0.45)] hover:before:opacity-100 hover:after:opacity-100',
        className,
      )}
      {...props}
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--pv-gradient)] text-white shadow-[0_15px_30px_-20px_rgba(63,0,233,0.75)] transition-transform duration-300 group-hover:-translate-y-1">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-[var(--pv-text-muted)]">{description}</p>
      </div>
    </div>
  );
}
