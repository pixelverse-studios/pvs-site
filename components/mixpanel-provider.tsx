'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import mp from '@/lib/mixpanel';

export function MixpanelProvider() {
  const pathname = usePathname();
  const isInitialized = useRef(false);

  // Initialize Mixpanel once on mount
  useEffect(() => {
    if (!isInitialized.current) {
      mp.init();
      isInitialized.current = true;
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!pathname) {
      return;
    }

    // Small delay to ensure page title is updated
    const timeoutId = setTimeout(() => {
      mp.trackPageView(pathname);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
