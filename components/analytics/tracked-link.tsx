'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';

import analytics from '@/lib/analytics';

type TrackingKind = 'cta' | 'phone' | 'email' | 'contact_path';

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  trackingKind: TrackingKind;
  trackingLabel?: string;
  contactPath?: string;
  scroll?: boolean;
}

function getPagePath(pathname: string | null): string {
  if (pathname) {
    return pathname;
  }

  if (typeof window !== 'undefined') {
    return window.location.pathname;
  }

  return '/';
}

export const TrackedLink = forwardRef<HTMLAnchorElement, TrackedLinkProps>(function TrackedLink(
  { href, children, trackingKind, trackingLabel, contactPath, onClick, scroll, ...props },
  ref,
) {
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const pagePath = getPagePath(pathname);
    const label = trackingLabel ?? props['aria-label'] ?? String(children);

    if (trackingKind === 'cta') {
      analytics.trackCtaClick(label, href, pagePath);
    } else if (trackingKind === 'phone') {
      analytics.trackPhoneClick(href, pagePath);
    } else if (trackingKind === 'email') {
      analytics.trackEmailClick(href, pagePath);
    } else if (trackingKind === 'contact_path') {
      analytics.trackContactPathSelect(contactPath ?? href, pagePath);
    }
  }

  const isInternalHref = href.startsWith('/');

  if (isInternalHref) {
    return (
      <Link ref={ref} href={href} scroll={scroll} onClick={handleClick} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a ref={ref} href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
});
