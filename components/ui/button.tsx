'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors-opacity-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-bg)] disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        default: 'bg-[var(--pv-gradient)] text-white shadow-pv hover:opacity-95',
        secondary:
          'border border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-text)] hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)]',
        outline:
          'border border-[var(--pv-border)] bg-transparent text-[var(--pv-text)] hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)]',
        ghost:
          'border border-transparent bg-transparent text-[var(--pv-text)] hover:border-[var(--pv-border)] hover:bg-[var(--pv-surface)]',
        link: 'rounded-none text-[var(--pv-primary)] underline-offset-4 hover:underline focus-visible:rounded-sm'
      },
      size: {
        default: 'h-11 rounded-pv px-5 text-base',
        sm: 'h-9 rounded-pv-sm px-4 text-sm',
        lg: 'h-12 rounded-pv-lg px-6 text-lg',
        icon: 'h-10 w-10 rounded-full'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type = 'button', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        type={asChild ? undefined : type}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
