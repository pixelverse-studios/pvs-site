'use client';

import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--pv-gradient)] text-white shadow-pv focus-visible:ring-offset-[var(--pv-bg)] hover:opacity-95',
  secondary:
    'border border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-text)] hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)]',
  ghost:
    'border border-transparent bg-transparent text-[var(--pv-text)] hover:border-[var(--pv-border)] hover:bg-[var(--pv-surface)]'
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 rounded-pv-sm px-3 text-sm',
  md: 'h-11 rounded-pv px-4 text-base',
  lg: 'h-12 rounded-pv-lg px-6 text-lg'
};

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref as React.Ref<any>}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors-opacity-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-bg)] disabled:pointer-events-none disabled:opacity-60',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...(asChild ? props : { ...props, type })}
      />
    );
  }
);

Button.displayName = 'Button';
