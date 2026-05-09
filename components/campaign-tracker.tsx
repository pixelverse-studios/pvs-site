'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import analytics from '@/lib/analytics';
import { captureAttributionFromUrl } from '@/lib/attribution';
import { findPromoCode, PROMO_STORAGE_KEY } from '@/lib/promo-codes';

export function CampaignTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || !searchParams) {
      return;
    }

    const attributionTouch = captureAttributionFromUrl(pathname, searchParams);
    if (attributionTouch) {
      analytics.trackCampaignLanding(attributionTouch, pathname);
    }

    const adSourceParam = searchParams.get('src');
    if (adSourceParam) {
      analytics.storeAdSource(adSourceParam);
      return;
    }
  }, [pathname, searchParams]);

  // DEV-678 follow-up: capture a valid ?promo= code into sessionStorage on
  // ANY page so the contact form can autopopulate after cross-page navigation.
  // Previously the capture only ran inside the contact form components, which
  // meant a user landing on /?promo=NJCC2026 and clicking through to /contact
  // via a <Link> (which drops the query string) would see a blank field.
  useEffect(() => {
    if (!searchParams) return;
    const fromUrl = findPromoCode(searchParams.get('promo'));
    if (!fromUrl) return;
    try {
      window.sessionStorage.setItem(PROMO_STORAGE_KEY, fromUrl.code);
    } catch {
      // sessionStorage may be unavailable (private mode, quota, etc.) — ignore.
    }
  }, [searchParams]);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    analytics.trackPageView(pathname);
  }, [pathname]);

  return null;
}
