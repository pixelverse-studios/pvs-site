'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

const baseFieldStyles =
  'flex w-full rounded-pv-sm border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-2 text-base text-[var(--pv-text)] placeholder:text-[var(--pv-text-muted)] shadow-sm transition-colors-opacity-transform focus-visible:border-[var(--pv-primary)] focus-visible:ring-2 focus-visible:ring-[var(--pv-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-bg)] disabled:cursor-not-allowed disabled:opacity-60';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return <input ref={ref} type={type} className={cn(baseFieldStyles, className)} {...props} />;
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(baseFieldStyles, 'min-h-[120px] resize-y leading-relaxed', className)}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <select ref={ref} className={cn(baseFieldStyles, 'appearance-none pr-10', className)} {...props}>
      {children}
    </select>
  );
});
Select.displayName = 'Select';
