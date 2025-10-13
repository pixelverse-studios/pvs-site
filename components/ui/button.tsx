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
        default: 'bg-[linear-gradient(90deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-pv hover:opacity-95',
        secondary:
          'border border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-text)] hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)]',
        outline:
          'border border-[var(--pv-border)] bg-transparent text-[var(--pv-text)] hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)]',
        ghost:
          'border border-transparent bg-transparent text-[var(--pv-text)] hover:border-[var(--pv-border)] hover:bg-[var(--pv-surface)]',
        link: 'rounded-none text-[var(--pv-primary)] underline-offset-4 hover:underline focus-visible:rounded-sm',
        cta:
          'relative isolate overflow-hidden rounded-pv border border-transparent bg-[var(--pv-primary)] px-6 py-3 text-base font-semibold text-white shadow-[0_20px_38px_-18px_rgba(63,0,233,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:text-white focus-visible:ring-offset-[var(--pv-bg)] before:absolute before:inset-[-20%] before:-z-10 before:scale-95 before:rounded-[inherit] before:bg-[linear-gradient(90deg,var(--pv-primary),var(--pv-primary-2))] before:opacity-0 before:transition before:duration-500 before:content-[\'\'] hover:before:scale-100 hover:before:opacity-100 after:absolute after:inset-[-120%] after:-z-20 after:bg-[radial-gradient(circle,var(--pv-primary-2)_0%,transparent_60%)] after:opacity-0 after:transition-opacity after:duration-500 after:content-[\'\'] hover:after:opacity-60'
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
