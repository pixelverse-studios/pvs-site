import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface SocialLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

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
    label: 'YouTube',
    href: 'https://www.youtube.com/@PixelVerse_Studios_nj',
    icon: Youtube,
  },
  {
    label: 'Twitter/X',
    href: 'https://x.com/pvs_nj',
    icon: Twitter,
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
