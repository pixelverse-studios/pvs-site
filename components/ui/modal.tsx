"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface ModalProps extends React.ComponentProps<typeof Dialog> {}

export interface ModalContentProps extends React.ComponentProps<typeof DialogContent> {
  title?: string;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  headerClassName?: string;
  contentClassName?: string;
}

export function Modal({ children, ...props }: ModalProps) {
  return <Dialog {...props}>{children}</Dialog>;
}

export function ModalContent({
  className,
  contentClassName,
  headerClassName,
  title,
  description,
  footer,
  children,
  ...props
}: ModalContentProps) {
  return (
    <DialogContent
      className={cn(
        "max-w-3xl overflow-hidden rounded-pv-lg border border-[var(--pv-border)] bg-[var(--pv-bg)] text-[var(--pv-text)] shadow-[0_40px_120px_-60px_rgba(63,0,233,0.65)] transition-colors duration-300 dark:bg-[var(--pv-surface)]",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <DialogHeader
          className={cn(
            "relative space-y-3 rounded-t-pv-lg bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] px-6 py-7 text-left text-white shadow-[0_20px_50px_-35px_rgba(63,0,233,0.75)]",
            headerClassName
          )}
        >
          {title && <DialogTitle className="text-2xl font-semibold text-white">{title}</DialogTitle>}
          {description && (
            <DialogDescription className="text-sm text-white/85">{description}</DialogDescription>
          )}
          <div className="absolute inset-x-0 bottom-0 h-px bg-white/25" aria-hidden />
        </DialogHeader>
      )}
      <div
        className={cn(
          "max-h-[65vh] overflow-y-auto px-6 py-6 text-left text-base leading-relaxed md:text-lg",
          contentClassName
        )}
      >
        {children}
      </div>
      {footer && (
        <DialogFooter className="flex flex-col gap-3 border-t border-[var(--pv-border)] bg-[var(--pv-surface)]/60 px-8 py-5 text-sm text-[var(--pv-text-muted)] dark:bg-[var(--pv-bg)]/60 md:flex-row md:items-center md:justify-between md:text-base">
          {footer}
        </DialogFooter>
      )}
    </DialogContent>
  );
}
