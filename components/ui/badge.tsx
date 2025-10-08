'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral:
    'border border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-text)]',
  success:
    'border border-transparent bg-[var(--pv-success)] text-white shadow-sm',
  warning:
    'border border-transparent bg-[var(--pv-warning)] text-white shadow-sm',
  danger:
    'border border-transparent bg-[var(--pv-danger)] text-white shadow-sm'
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'neutral', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium tracking-tight transition-colors-opacity-transform',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
);

Badge.displayName = 'Badge';
