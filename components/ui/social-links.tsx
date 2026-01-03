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
  ({ className, size = 24, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
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
  ({ className, size = 24, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
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
          'transition-colors duration-200',
          isHoverCapable && 'delay-[50ms] group-hover/review:text-white',
        )}
        aria-hidden="true"
      />

      {/* CTA Text - slides in with staggered delay */}
      {isHoverCapable && (
        <span
          className={cn(
            'ml-2 whitespace-nowrap text-sm font-medium tracking-tight text-white',
            '-translate-x-2 opacity-0',
            'delay-[100ms] transition-[opacity,transform] duration-150 ease-out',
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
