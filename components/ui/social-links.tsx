'use client';

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

const XLogoSvg = React.forwardRef<SVGSVGElement, LucideProps>(
  ({ className, ...props }, ref) => (
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
  ),
);
XLogoSvg.displayName = 'XLogoIcon';
const XLogoIcon = XLogoSvg as LucideIcon;

const GoogleGlyphSvg = React.forwardRef<SVGSVGElement, LucideProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  ),
);
GoogleGlyphSvg.displayName = 'GoogleGlyphIcon';
const GoogleGlyphIcon = GoogleGlyphSvg as LucideIcon;

// Regular social links (excluding Google Review which gets special treatment)
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
    label: 'Twitter/X',
    href: 'https://x.com/pvs_nj',
    icon: XLogoIcon,
  },
];

// Google Review link (separate for expandable button treatment)
export const GOOGLE_REVIEW_LINK = {
  label: 'Leave a review on Google',
  href: 'https://search.google.com/local/writereview?placeid=ChIJP9TTk-nyGIgRJLhBiKpq0Nw',
  ctaText: 'Leave a Review',
};

export interface SocialLinksProps {
  className?: string;
  iconClassName?: string;
}

// Expandable Google Review Button with hover animation
function GoogleReviewButton({ iconClassName }: { iconClassName?: string }) {
  const [isHoverCapable, setIsHoverCapable] = React.useState(false);

  React.useEffect(() => {
    // Check if device supports hover (not touch-only)
    setIsHoverCapable(window.matchMedia('(hover: hover)').matches);
  }, []);

  return (
    <Link
      href={GOOGLE_REVIEW_LINK.href}
      target="_blank"
      rel="noreferrer"
      aria-label={GOOGLE_REVIEW_LINK.label}
      className={cn(
        // Base layout
        'group/review relative flex h-10 items-center justify-center overflow-hidden',
        // Default state - matches sibling icons
        'w-10 rounded-full border border-[var(--pv-border)]',
        'bg-[var(--pv-surface)] text-[var(--pv-text-muted)]',
        'shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]',
        // Focus styles
        'focus-visible:border-[var(--pv-primary)] focus-visible:outline-none',
        'focus-visible:ring-[var(--pv-primary)]/40 focus-visible:ring-2',
        // Transition for container (width, bg, border, shadow)
        'transition-[width,background-color,border-color,box-shadow] duration-200 ease-out',
        // Hover expansion (only on hover-capable devices via group state)
        isHoverCapable && [
          'hover:w-[156px] hover:rounded-full hover:border-transparent',
          'hover:bg-[var(--pv-primary)] hover:pl-3 hover:pr-4',
          'hover:shadow-[0_0_20px_-4px_var(--pv-primary)]',
        ],
        iconClassName,
      )}
    >
      {/* Icon - color transitions with slight delay */}
      <GoogleGlyphIcon
        className={cn(
          'h-4 w-4 shrink-0',
          'text-[var(--pv-text-muted)]',
          'transition-colors duration-200',
          isHoverCapable && 'delay-50 group-hover/review:text-white',
        )}
        aria-hidden="true"
      />

      {/* CTA Text - slides in with staggered delay */}
      {isHoverCapable && (
        <span
          className={cn(
            'ml-2 whitespace-nowrap text-sm font-medium tracking-tight text-white',
            '-translate-x-2 opacity-0',
            'delay-100 transition-[opacity,transform] duration-150 ease-out',
            'group-hover/review:translate-x-0 group-hover/review:opacity-100',
          )}
        >
          {GOOGLE_REVIEW_LINK.ctaText}
        </span>
      )}

      {/* Screen reader text (always present) */}
      <span className="sr-only">{GOOGLE_REVIEW_LINK.label}</span>
    </Link>
  );
}

export function SocialLinks({ className, iconClassName }: SocialLinksProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Regular social icons */}
      {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          target="_blank"
          rel="noreferrer"
          className={cn(
            'focus-visible:ring-[var(--pv-primary)]/40 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-text-muted)] transition hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)] focus-visible:border-[var(--pv-primary)] focus-visible:outline-none focus-visible:ring-2',
            iconClassName,
          )}
        >
          <span className="sr-only">{label}</span>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </Link>
      ))}

      {/* Expandable Google Review button */}
      <GoogleReviewButton iconClassName={iconClassName} />
    </div>
  );
}
