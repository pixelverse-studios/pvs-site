'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

import { isTrackingExcludedRoute } from '@/lib/tracking-config';

interface SiteBehaviourScriptProps {
  bootstrapScript: string;
}

/**
 * Client component that conditionally renders the SiteBehaviour tracking script.
 * The script is excluded on routes defined in tracking-config.ts (e.g., /dashboard).
 *
 * The bootstrap script runs inline. It's allowed by the public CSP via
 * 'unsafe-inline' in script-src (set in next.config.js). The previous
 * nonce-based approach was removed as part of DEV-674 because reading the
 * per-request nonce in the root layout forced every page to render dynamically.
 */
export function SiteBehaviourScript({ bootstrapScript }: SiteBehaviourScriptProps) {
  const pathname = usePathname();

  if (isTrackingExcludedRoute(pathname)) {
    return null;
  }

  return (
    <Script
      id="sitebehaviour-tracking"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{ __html: bootstrapScript }}
    />
  );
}
