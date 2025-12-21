import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[140px] w-full resize-y rounded-pv-sm border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-3 text-base text-[var(--pv-text)] shadow-sm transition-colors-opacity-transform placeholder:text-[var(--pv-text-muted)] focus-visible:border-[var(--pv-primary)] focus-visible:ring-2 focus-visible:ring-[var(--pv-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-bg)] disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

export { Textarea };
