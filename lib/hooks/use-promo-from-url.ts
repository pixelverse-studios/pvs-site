'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { findPromoCode } from '@/lib/promo-codes';

const STORAGE_KEY = 'pvs_promo';

/**
 * Reads a `?promo=` query parameter, validates it against the hardcoded
 * promo code registry, and persists the matched canonical code in
 * sessionStorage so it survives navigation between pages.
 *
 * Resolution order on each call:
 *   1. URL `?promo=` (validated) → write through to sessionStorage
 *   2. Existing sessionStorage value (validated)
 *   3. Empty string
 *
 * Unknown / inactive / expired codes from the URL are ignored — the
 * field stays blank rather than autopopulating with a stale code.
 *
 * Returns the canonical (uppercase) code, or '' if none.
 */
export function usePromoFromUrl(): string {
  const searchParams = useSearchParams();
  const [promo, setPromo] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. URL wins if it carries a valid code.
    const fromUrl = findPromoCode(searchParams?.get('promo'));
    if (fromUrl) {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, fromUrl.code);
      } catch {
        // sessionStorage may be unavailable (private mode, quota, etc.) — ignore.
      }
      setPromo(fromUrl.code);
      return;
    }

    // 2. Fall back to a previously-stored value, if still valid.
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      const fromStorage = findPromoCode(stored);
      if (fromStorage) {
        setPromo(fromStorage.code);
        return;
      }
    } catch {
      // ignore
    }

    // 3. Nothing valid available.
    setPromo('');
  }, [searchParams]);

  return promo;
}

/** Clear the persisted promo code (call after a successful form submit). */
export function clearStoredPromoCode(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
