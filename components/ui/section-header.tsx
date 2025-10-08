import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({
  className,
  eyebrow,
  title,
  description,
  align = 'left',
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'text-center items-center',
        className
      )}
      {...props}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-1 text-xs uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
          {eyebrow}
        </span>
      )}
      <div className="space-y-3">
        <h2 className="font-heading text-[2.25rem] leading-[2.75rem] tracking-tight md:text-[2.5rem] md:leading-[3rem]">
          {title}
        </h2>
        {description && <p className="text-lg text-[var(--pv-text-muted)]">{description}</p>}
      </div>
    </div>
  );
}
