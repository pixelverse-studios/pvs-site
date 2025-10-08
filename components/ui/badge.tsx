'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors-opacity-transform',
  {
    variants: {
      variant: {
        default: 'border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-text)] shadow-sm',
        primary: 'border-transparent bg-[var(--pv-gradient)] text-white shadow-pv',
        success: 'border-transparent bg-[var(--pv-success)] text-white shadow-sm',
        warning: 'border-transparent bg-[var(--pv-warning)] text-white shadow-sm',
        danger: 'border-transparent bg-[var(--pv-danger)] text-white shadow-sm',
        outline:
          'border-[var(--pv-border)] bg-transparent text-[var(--pv-text)] hover:bg-[var(--pv-surface)]'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  )
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
