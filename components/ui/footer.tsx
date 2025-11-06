import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import { Button } from './button';
import { SocialLinks } from './social-links';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  links?: FooterLink[];
  localContactLinks?: FooterLink[];
  cta?: {
    label: string;
    href: string;
  };
}

export function Footer({
  className,
  links = [],
  localContactLinks = [],
  cta,
  ...props
}: FooterProps) {
  return (
    <footer
      className={cn(
        'bg-[var(--pv-surface)]/70 border-t border-[var(--pv-border)] backdrop-blur',
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="space-y-3">
          <Link href="/" className="text-lg font-semibold">
            PixelVerse Studios
          </Link>
          <p className="max-w-md text-sm text-[var(--pv-text-muted)]">
            Building websites that work. Designed for people, built to grow.
          </p>
          <small>&copy; {new Date().getFullYear()} PixelVerse Studios. All rights reserved.</small>
        </div>
        <div className="flex w-full flex-col gap-6 md:w-auto">
          <nav className="flex flex-wrap gap-4 text-sm text-[var(--pv-text-muted)] md:justify-end">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-[var(--pv-primary)] focus-visible:text-[var(--pv-primary)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {localContactLinks.length > 0 && (
            <div className="rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-bg)]/70 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
                Local contact
              </p>
              <div className="mt-3 grid gap-2 text-sm text-[var(--pv-text-muted)] md:grid-cols-2">
                {localContactLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between rounded-lg border border-transparent px-3 py-2 transition hover:border-[var(--pv-border)] hover:text-[var(--pv-primary)]"
                  >
                    <span>{link.label}</span>
                    <span aria-hidden="true" className="text-[var(--pv-primary)]">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="flex w-full flex-col gap-2 md:items-end">
            <span className="text-sm font-semibold text-[var(--pv-text-muted)]">Follow PixelVerse</span>
            <SocialLinks className="flex-wrap justify-start md:justify-end" iconClassName="bg-[var(--pv-bg)]" />
          </div>
          {cta && (
            <Button asChild variant="cta" className="w-full md:w-auto">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
}
