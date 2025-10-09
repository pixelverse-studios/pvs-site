import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import { Button } from './button';
import { ThemeToggle } from './theme-toggle';

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  items?: NavItem[];
  cta?: {
    label: string;
    href: string;
  };
}

export function Navbar({ className, items = [], cta, ...props }: NavbarProps) {
  return (
    <header
      className={cn(
        'pointer-events-none sticky top-4 z-50 flex justify-center px-4 transition-all duration-300 sm:top-6 md:top-8',
        className
      )}
      {...props}
    >
      <div className="pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-pv-lg border border-[var(--pv-border)] bg-[var(--pv-surface)]/75 px-4 py-3 shadow-[0_28px_60px_-30px_rgba(32,32,72,0.55)] backdrop-blur-xl transition-colors duration-300 dark:bg-[var(--pv-bg)]/70 md:px-6">
        <Link href="/" className="flex items-center">
          <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] shadow-[0_18px_34px_-22px_rgba(63,0,233,0.55)] transition-transform duration-200 hover:-translate-y-0.5">
            <Image src="/logo.svg" alt="PixelVerse Studios logo" width={64} height={64} className="object-contain" />
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {cta && (
            <Button asChild variant="cta">
              <Link href={cta.href} className="whitespace-nowrap">
                {cta.label}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
