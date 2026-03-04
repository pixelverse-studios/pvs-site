'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

import { useNonce } from '@/components/nonce-provider';
import { isTrackingExcludedRoute } from '@/lib/tracking-config';

interface SiteBehaviourScriptProps {
  bootstrapScript: string;
}

/**
 * Client component that conditionally renders the SiteBehaviour tracking script.
 * The script is excluded on routes defined in tracking-config.ts (e.g., /dashboard).
 */
export function SiteBehaviourScript({ bootstrapScript }: SiteBehaviourScriptProps) {
  const pathname = usePathname();
  const nonce = useNonce();

  if (isTrackingExcludedRoute(pathname)) {
    return null;
  }

  return (
    <Script
      id="sitebehaviour-tracking"
      strategy="afterInteractive"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: bootstrapScript }}
    />
  );
}
