import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-11 w-full rounded-pv-sm border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 text-base text-[var(--pv-text)] placeholder:text-[var(--pv-text-muted)] shadow-sm transition-colors-opacity-transform focus-visible:border-[var(--pv-primary)] focus-visible:ring-2 focus-visible:ring-[var(--pv-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-bg)] disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export { Input };
