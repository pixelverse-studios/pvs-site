'use client';

import type { ReactNode } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Drawer({ open, onOpenChange, title, description, children, footer, className }: DrawerProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
    }
  }, [open]);

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'relative z-10 flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-[var(--pv-border)] bg-[var(--pv-surface)] p-6 shadow-pv transition-transform focus-visible:outline-none',
          className
        )}
      >
        <div className="space-y-3">
          {title && (
            <h3 id={titleId} className="text-xl font-semibold">
              {title}
            </h3>
          )}
          {description && (
            <p id={descriptionId} className="text-sm text-[var(--pv-text-muted)]">
              {description}
            </p>
          )}
        </div>
        <div className="mt-6 flex-1 text-base text-[var(--pv-text)]">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3 border-t border-[var(--pv-border)] pt-4">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
