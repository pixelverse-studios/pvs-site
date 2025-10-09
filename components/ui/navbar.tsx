'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import { Button } from './button';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from './sheet';
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
        'pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 transition-all duration-300 sm:top-6 md:top-8',
        className,
      )}
      {...props}
    >
      <div className="pointer-events-auto flex w-full max-w-5xl items-center gap-4 rounded-pv-lg border border-[var(--pv-border)] px-4 py-3 shadow-[0_28px_60px_-30px_rgba(32,32,72,0.55)] backdrop-blur-xl transition-colors duration-300 md:gap-6 md:px-6 bg-[var(--pv-surface)]/75 dark:bg-[rgba(12,12,24,0.9)] dark:shadow-[0_38px_80px_-40px_rgba(63,0,233,0.65)]">
        <Link href="/" className="flex items-center">
          <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] shadow-[0_18px_34px_-22px_rgba(63,0,233,0.55)] transition-transform duration-200 hover:-translate-y-0.5">
            <Image
              src="/logo.svg"
              alt="PixelVerse Studios logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </span>
        </Link>
        {items.length > 0 && (
          <nav
            aria-label="Primary navigation"
            className="hidden flex-1 items-center justify-center gap-4 text-sm font-medium md:flex"
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
                    'hover:bg-[var(--pv-surface)]/90 hover:shadow-[0_18px_40px_-28px_rgba(63,0,233,0.55)] dark:hover:bg-white/10',
                    'before:absolute before:inset-[-2px] before:-z-10 before:rounded-full before:bg-[radial-gradient(circle_at_top,var(--pv-primary)/0.12,transparent_75%)] before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-100',
                    isActive &&
                      'bg-[linear-gradient(90deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_22px_44px_-28px_rgba(63,0,233,0.75)] hover:text-white',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          {cta && (
            <Button asChild variant="cta" className="hidden md:inline-flex">
              <Link href={cta.href} className="whitespace-nowrap">
                {cta.label}
              </Link>
            </Button>
          )}
          {items.length > 0 && (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="inline-flex md:hidden"
                  aria-label="Open navigation"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full max-w-xs border-[var(--pv-border)] bg-[var(--pv-bg)] text-left dark:bg-[var(--pv-surface)]"
              >
                <SheetHeader className="flex flex-row items-center justify-between gap-3">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-semibold"
                    aria-label="PixelVerse Studios"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] text-sm font-semibold text-[var(--pv-text)] shadow-[0_10px_20px_-15px_rgba(63,0,233,0.6)] dark:bg-[var(--pv-bg)]">
                      PV
                    </span>
                    PixelVerse Studios
                  </Link>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-2 text-base font-medium">
                  {items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/' && pathname.startsWith(`${item.href}/`));

                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={isActive ? 'page' : undefined}
                          className={cn(
                            'inline-flex items-center justify-between rounded-pv px-4 py-3 transition-all duration-200',
                            'dark:hover:bg-[var(--pv-bg)]/80 text-[var(--pv-text)] hover:bg-[var(--pv-surface)] hover:text-[var(--pv-text)]',
                            isActive &&
                              'bg-[linear-gradient(90deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_18px_38px_-28px_rgba(63,0,233,0.75)]',
                          )}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
                {cta && (
                  <div className="mt-8">
                    <SheetClose asChild>
                      <Button asChild className="w-full" variant="cta">
                        <Link href={cta.href}>{cta.label}</Link>
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
