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
  layout?: 'a' | 'b' | 'c' | 'd';
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

// Shared className constants to avoid repetition across layouts
const eyebrowCls =
  'text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--pv-primary)]';
const eyebrowSmCls =
  'text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-[var(--pv-primary)]';
const navLinkCls =
  'text-sm text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-primary)]';
const navLinkXsCls =
  'text-xs text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-primary)]';

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

// ─── Layout A: Panoramic ──────────────────────────────────────────────────────
// Full-width map strip on top, clean 4-column grid below

function FooterLayoutA({ links = [], cta, className, ...props }: FooterProps) {
  return (
    <footer
      className={cn('border-t border-[var(--pv-border)] bg-[var(--pv-surface)]/70 backdrop-blur', className)}
      {...props}
    >
      <div className="h-[180px] w-full overflow-hidden border-b border-[var(--pv-border)]">
        <MapIframe height={180} />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          <div className="space-y-3">
            <p className={eyebrowCls}>Studio</p>
            <Link href="/" className="block text-lg font-semibold text-[var(--pv-text)] transition-colors hover:text-[var(--pv-primary)]">
              PixelVerse Studios
            </Link>
            <p className="text-sm leading-relaxed text-[var(--pv-text-muted)]">
              Building websites that work. Designed for people, built to grow.
            </p>
            <small className="block text-xs text-[var(--pv-text-muted)]">
              © {CURRENT_YEAR} PixelVerse Studios
            </small>
          </div>

          <div className="space-y-3">
            <p className={eyebrowCls}>Navigate</p>
            <nav className="flex flex-col gap-2">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className={navLinkCls}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <p className={eyebrowCls}>Reach Us</p>
            <div className="flex flex-col gap-2.5">
              <address className="flex items-start gap-2 text-sm not-italic text-[var(--pv-text-muted)]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--pv-primary)]" aria-hidden />
                <span>79 Edgewater Road,<br />Cliffside Park, NJ 07010</span>
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

          <div className="space-y-4">
            <p className={eyebrowCls}>Connect</p>
            <SocialLinks iconClassName="bg-[var(--pv-bg)]" />
            {cta && (
              <Button asChild variant="cta" className="w-full">
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Layout B: Split Panel ────────────────────────────────────────────────────
// Left: tall map + contact details. Right: brand, nav, social, CTA.

function FooterLayoutB({ links = [], cta, className, ...props }: FooterProps) {
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

// ─── Layout C: Stacked Strips ─────────────────────────────────────────────────
// Editorial/newspaper. Everything in full-bleed horizontal bands.
// Brand name + CTA | Map band | Nav strip | Contact + social bar

function FooterLayoutC({ links = [], cta, className, ...props }: FooterProps) {
  return (
    <footer
      className={cn('border-t border-[var(--pv-border)] bg-[var(--pv-surface)]/70 backdrop-blur', className)}
      {...props}
    >
      {/* Strip 1: Brand + CTA */}
      <div className="border-b border-[var(--pv-border)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8">
          <div>
            <Link href="/" className="text-xl font-semibold tracking-tight text-[var(--pv-text)] transition-colors hover:text-[var(--pv-primary)]">
              PixelVerse Studios
            </Link>
            <p className="mt-0.5 text-xs text-[var(--pv-text-muted)]">
              Building websites that work — Cliffside Park, NJ
            </p>
          </div>
          {cta && (
            <Button asChild variant="cta" size="sm">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Strip 2: Map band */}
      <div className="h-[150px] w-full overflow-hidden border-b border-[var(--pv-border)]">
        <MapIframe height={150} />
      </div>

      {/* Strip 3: Nav links spread across full width */}
      <div className="border-b border-[var(--pv-border)]">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <nav className="flex flex-wrap items-center divide-x divide-[var(--pv-border)]">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--pv-text-muted)] transition-colors first:pl-0 hover:text-[var(--pv-primary)] last:pr-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Strip 4: Contact inline + social + copyright */}
      <div className="mx-auto max-w-7xl px-6 py-4 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <address className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs not-italic text-[var(--pv-text-muted)]">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[var(--pv-primary)]" aria-hidden />
              {CONTACT.address}
            </span>
            <a href={CONTACT.phone.href} className="flex items-center gap-1.5 transition-colors hover:text-[var(--pv-primary)]">
              <Phone className="h-3.5 w-3.5 text-[var(--pv-primary)]" aria-hidden />
              {CONTACT.phone.label}
            </a>
            <a href={CONTACT.email.href} className="flex items-center gap-1.5 transition-colors hover:text-[var(--pv-primary)]">
              <Mail className="h-3.5 w-3.5 text-[var(--pv-primary)]" aria-hidden />
              {CONTACT.email.label}
            </a>
          </address>
          <div className="flex items-center gap-4">
            <SocialLinks iconClassName="bg-[var(--pv-bg)] !h-7 !w-7 !text-xs" />
            <small className="text-xs text-[var(--pv-text-muted)]">© {CURRENT_YEAR}</small>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Layout D: Card Trio ──────────────────────────────────────────────────────
// 3 cards: "Find Us" (with embedded map), "Get In Touch", "Follow Us"
// Below: thin nav bar + copyright

function FooterLayoutD({ links = [], cta, className, ...props }: FooterProps) {
  return (
    <footer
      className={cn('border-t border-[var(--pv-border)] bg-[var(--pv-surface)]/70 backdrop-blur', className)}
      {...props}
    >
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-8">
        {/* Brand row */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-[var(--pv-text)] transition-colors hover:text-[var(--pv-primary)]">
            PixelVerse Studios
          </Link>
          {cta && (
            <Button asChild variant="cta" size="sm">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          )}
        </div>

        {/* 3-card grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Card 1: Find Us — map embedded */}
          <div className="overflow-hidden rounded-xl border border-[var(--pv-border)] bg-[var(--pv-bg)]">
            <div className="h-[140px] w-full overflow-hidden">
              <MapIframe height={140} />
            </div>
            <div className="flex flex-col gap-2 p-4">
              <p className={eyebrowSmCls}>Find Us</p>
              <address className="flex items-start gap-2 text-sm not-italic text-[var(--pv-text-muted)]">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--pv-primary)]" aria-hidden />
                <span className="leading-snug">{CONTACT.address}</span>
              </address>
            </div>
          </div>

          {/* Card 2: Get In Touch */}
          <div className="flex flex-col justify-between rounded-xl border border-[var(--pv-border)] bg-[var(--pv-bg)] p-4">
            <div className="space-y-3">
              <p className={eyebrowSmCls}>Get In Touch</p>
              <a href={CONTACT.phone.href} className={cn('flex items-center gap-2', navLinkCls)}>
                <Phone className="h-4 w-4 shrink-0 text-[var(--pv-primary)]" aria-hidden />
                {CONTACT.phone.label}
              </a>
              <a href={CONTACT.email.href} className={cn('flex items-center gap-2', navLinkCls)}>
                <Mail className="h-4 w-4 shrink-0 text-[var(--pv-primary)]" aria-hidden />
                {CONTACT.email.label}
              </a>
            </div>
            <p className="mt-4 text-xs text-[var(--pv-text-muted)]">
              Response within 24 hours.<br />Mon – Fri, 9am – 6pm EST
            </p>
          </div>

          {/* Card 3: Follow */}
          <div className="flex flex-col justify-between rounded-xl border border-[var(--pv-border)] bg-[var(--pv-bg)] p-4">
            <div className="space-y-3">
              <p className={eyebrowSmCls}>Follow PixelVerse</p>
              <p className="text-sm text-[var(--pv-text-muted)]">
                Building websites that work. Designed for people, built to grow.
              </p>
              <SocialLinks iconClassName="bg-[var(--pv-surface)]" />
            </div>
          </div>
        </div>

        {/* Thin nav + copyright bar */}
        <div className="mt-6 flex flex-col gap-3 border-t border-[var(--pv-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap gap-x-4 gap-y-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={navLinkXsCls}>
                {link.label}
              </Link>
            ))}
          </nav>
          <small className="text-xs text-[var(--pv-text-muted)]">
            © {CURRENT_YEAR} PixelVerse Studios. All rights reserved.
          </small>
        </div>
      </div>
    </footer>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

const LAYOUT_COMPONENTS: Record<NonNullable<FooterProps['layout']>, React.FC<FooterProps>> = {
  a: FooterLayoutA,
  b: FooterLayoutB,
  c: FooterLayoutC,
  d: FooterLayoutD,
};

export function Footer({ layout = 'a', ...props }: FooterProps) {
  const Component = LAYOUT_COMPONENTS[layout] ?? FooterLayoutA;
  return <Component {...props} />;
}
