'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import analytics from '@/lib/analytics';

export function CampaignTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || !searchParams) {
      return;
    }

    const adSourceParam = searchParams.get('src');
    if (adSourceParam) {
      analytics.trackAdSource(adSourceParam, pathname);
      analytics.storeAdSource(adSourceParam);
      return;
    }

    const storedSource = analytics.getStoredAdSource();
    if (storedSource) {
      analytics.trackAdSource(storedSource, pathname);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    analytics.trackPageView(pathname);
  }, [pathname]);

  return null;
}
