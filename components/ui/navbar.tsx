import * as React from 'react';
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
        'sticky inset-x-0 top-0 z-40 border-b border-[var(--pv-border)] bg-[var(--pv-bg)]/90 backdrop-blur-md transition-colors-opacity-transform',
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-pv-sm bg-[var(--pv-gradient)] text-white shadow-pv">
            PV
          </span>
          PixelVerse
        </Link>
        <nav className="hidden items-center gap-10 text-sm font-medium text-[var(--pv-text-muted)] md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-[var(--pv-primary)] focus-visible:text-[var(--pv-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {cta && (
            <Button asChild>
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
