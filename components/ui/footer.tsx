import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import { Button } from './button';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  links?: FooterLink[];
  cta?: {
    label: string;
    href: string;
  };
}

export function Footer({ className, links = [], cta, ...props }: FooterProps) {
  return (
    <footer
      className={cn(
        'border-t border-[var(--pv-border)] bg-[var(--pv-surface)]/70 backdrop-blur',
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="space-y-3">
          <Link href="/" className="text-lg font-semibold">
            PixelVerse Studios
          </Link>
          <p className="max-w-md text-sm text-[var(--pv-text-muted)]">
            Building immersive experiences across worlds. Crafted with a scalable design system and accessible
            foundations.
          </p>
          <small>&copy; {new Date().getFullYear()} PixelVerse Studios. All rights reserved.</small>
        </div>
        <div className="flex flex-col items-start gap-4 md:items-end">
          <nav className="flex flex-wrap gap-4 text-sm text-[var(--pv-text-muted)]">
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
          {cta && (
            <Button asChild variant="cta">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
}
