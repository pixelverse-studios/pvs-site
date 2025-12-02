import Link from 'next/link';
import * as React from 'react';
import type { LucideIcon, LucideProps } from 'lucide-react';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface SocialLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

const XLogoSvg = React.forwardRef<SVGSVGElement, LucideProps>(({ className, ...props }, ref) => (
  <svg
    ref={ref}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <path d="M3.2 3h4.77l4.11 5.89L16.41 3H20.8l-6.7 8.08L21 21h-4.77l-4.37-6.19L7.68 21H3.2l6.78-8.13L3.2 3Z" />
  </svg>
));
XLogoSvg.displayName = 'XLogoIcon';
const XLogoIcon = XLogoSvg as LucideIcon;

const GoogleGlyphSvg = React.forwardRef<SVGSVGElement, LucideProps>(({ className, ...props }, ref) => (
  <svg
    ref={ref}
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <path
      d="M12.24 4.5c2.2 0 3.72.96 4.57 1.76l-1.85 1.93c-.78-.72-1.83-1.28-2.72-1.28-2.33 0-4.15 1.93-4.15 4.31 0 2.37 1.82 4.28 4.15 4.28 1.78 0 2.8-.71 3.45-1.36.53-.53.87-1.29 1-2.33h-4.45V9.46h7.42c.08.42.13.9.13 1.48 0 2.11-.56 4.72-2.39 6.55-1.62 1.65-3.52 2.54-6.16 2.54-4.9 0-8.87-3.95-8.87-8.85 0-4.9 3.97-8.87 8.87-8.87Z"
      fill="currentColor"
    />
  </svg>
));
GoogleGlyphSvg.displayName = 'GoogleGlyphIcon';
const GoogleGlyphIcon = GoogleGlyphSvg as LucideIcon;

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/pixel.verse.studios/',
    icon: Instagram,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61582670432316',
    icon: Facebook,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/pixelverse-studios/',
    icon: Linkedin,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@PixelVerse_Studios_nj',
    icon: Youtube,
  },
  {
    label: 'Google Business Profile',
    href: 'https://share.google/QU5tjH8prhGXPp95b',
    icon: GoogleGlyphIcon,
  },
  {
    label: 'Twitter/X',
    href: 'https://x.com/pvs_nj',
    icon: XLogoIcon,
  },
];

export interface SocialLinksProps {
  className?: string;
  iconClassName?: string;
}

export function SocialLinks({ className, iconClassName }: SocialLinksProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          target="_blank"
          rel="noreferrer"
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-text-muted)] transition hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)] focus-visible:border-[var(--pv-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-primary)]/40',
            iconClassName,
          )}
        >
          <span className="sr-only">{label}</span>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
