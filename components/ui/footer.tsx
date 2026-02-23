import * as React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from './button';
import { SocialLinks } from './social-links';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  links?: FooterLink[];
  cta?: { label: string; href: string };
}

// Address-based embed — no Place ID required, always resolves correctly
const MAP_SRC =
  'https://www.google.com/maps?q=79+Edgewater+Road,+Cliffside+Park,+NJ+07010&output=embed&z=16';

const CURRENT_YEAR = new Date().getFullYear();

const CONTACT = {
  address: '79 Edgewater Road, Cliffside Park, NJ 07010',
  phone: { href: 'tel:+12016381769', label: '(201) 638-1769' },
  email: { href: 'mailto:info@pixelversestudios.io', label: 'info@pixelversestudios.io' },
} as const;

const eyebrowCls =
  'text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--pv-primary)]';
const navLinkCls =
  'text-sm text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-primary)]';

const MapIframe = ({ height, className }: { height: number; className?: string }) => (
  <iframe
    src={MAP_SRC}
    width="100%"
    height={height}
    style={{ border: 0 }}
    loading="lazy"
    referrerPolicy="strict-origin"
    title="PixelVerse Studios location — 79 Edgewater Rd, Cliffside Park NJ"
    className={cn('grayscale transition-all duration-500 hover:grayscale-0', className)}
  />
);

// ─── Layout: Split Panel ──────────────────────────────────────────────────────
// Left: tall map + contact details. Right: brand, nav, social, CTA.

export function Footer({ links = [], cta, className, ...props }: FooterProps) {
  return (
    <footer
      className={cn('border-t border-[var(--pv-border)] bg-[var(--pv-surface)]/70 backdrop-blur', className)}
      {...props}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr]">
          <div className="relative flex flex-col border-b border-[var(--pv-border)] md:border-b-0 md:border-r">
            <div className="h-[220px] w-full overflow-hidden">
              <MapIframe height={220} />
            </div>
            <div className="flex flex-col gap-3 px-6 py-6">
              <p className={eyebrowCls}>Find Us</p>
              <address className="flex items-start gap-2 text-sm not-italic text-[var(--pv-text-muted)]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--pv-primary)]" aria-hidden />
                <span>{CONTACT.address}</span>
              </address>
              <a href={CONTACT.phone.href} className={cn('flex items-center gap-2', navLinkCls)}>
                <Phone className="h-4 w-4 shrink-0 text-[var(--pv-primary)]" aria-hidden />
                {CONTACT.phone.label}
              </a>
              <a href={CONTACT.email.href} className={cn('flex items-center gap-2', navLinkCls)}>
                <Mail className="h-4 w-4 shrink-0 text-[var(--pv-primary)]" aria-hidden />
                {CONTACT.email.label}
              </a>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8 px-8 py-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <Link href="/" className="block text-2xl font-semibold text-[var(--pv-text)] transition-colors hover:text-[var(--pv-primary)]">
                  PixelVerse Studios
                </Link>
                <p className="max-w-xs text-sm leading-relaxed text-[var(--pv-text-muted)]">
                  Building websites that work.<br />Designed for people, built to grow.
                </p>
              </div>
              <nav className="grid grid-cols-2 gap-x-8 gap-y-2">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className={navLinkCls}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="h-px bg-[var(--pv-border)]" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <p className={eyebrowCls}>Follow PixelVerse</p>
                <SocialLinks iconClassName="bg-[var(--pv-bg)]" />
              </div>
              <div className="flex flex-col items-start gap-3 sm:items-end">
                {cta && <Button asChild variant="cta"><Link href={cta.href}>{cta.label}</Link></Button>}
                <small className="text-xs text-[var(--pv-text-muted)]">© {CURRENT_YEAR} PixelVerse Studios. All rights reserved.</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
