'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();

  return (
    <header
      className={cn(
        'pointer-events-none sticky top-4 z-50 flex justify-center px-4 transition-all duration-300 sm:top-6 md:top-8',
        className
      )}
      {...props}
    >
      <div className="pointer-events-auto flex w-full max-w-5xl items-center gap-6 rounded-pv-lg border border-[var(--pv-border)] bg-[var(--pv-surface)]/75 px-4 py-3 shadow-[0_28px_60px_-30px_rgba(32,32,72,0.55)] backdrop-blur-xl transition-colors duration-300 dark:bg-[var(--pv-bg)]/70 md:px-6">
        <Link href="/" className="flex items-center">
          <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] shadow-[0_18px_34px_-22px_rgba(63,0,233,0.55)] transition-transform duration-200 hover:-translate-y-0.5">
            <Image src="/logo.svg" alt="PixelVerse Studios logo" width={64} height={64} className="object-contain" />
          </span>
        </Link>
        {items.length > 0 && (
          <nav
            aria-label="Primary navigation"
            className="flex flex-1 items-center justify-center gap-4 text-sm font-medium"
          >
            {items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'group relative inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300',
                    'text-[var(--pv-text-muted)] hover:text-[var(--pv-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-bg)]',
                    'hover:bg-[var(--pv-bg)]/80 hover:shadow-[0_18px_40px_-28px_rgba(63,0,233,0.55)] dark:hover:bg-white/5',
                    'before:absolute before:inset-[-2px] before:-z-10 before:rounded-full before:bg-[radial-gradient(circle_at_top,var(--pv-primary)/0.12,transparent_75%)] before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-100',
                    isActive &&
                      'bg-[linear-gradient(90deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_22px_44px_-28px_rgba(63,0,233,0.75)] hover:text-white'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
        <div className="ml-auto flex items-center gap-3">
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
