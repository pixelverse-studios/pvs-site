import { findPromoCode } from '@/lib/promo-codes';
import { isTrackingExcludedRoute } from '@/lib/tracking-config';

const ATTRIBUTION_STORAGE_KEY = 'pvs_attribution';
const ATTRIBUTION_PARAM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'src',
  'promo',
] as const;
const TOUCH_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'src_code',
  'promo_code',
  'landing_page',
  'referrer',
  'captured_at',
] as const;

type AttributionSearchParams = Pick<URLSearchParams, 'get' | 'toString'>;

export type AttributionConversionType = 'lead' | 'website_review' | 'strategy_call';

export type AttributionTouch = Partial<{
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  src_code: string;
  promo_code: string;
  landing_page: string;
  referrer: string;
  captured_at: string;
}>;

export type AttributionMetadata = {
  first_touch?: AttributionTouch;
  latest_touch?: AttributionTouch;
  conversion: {
    conversion_page: string;
    conversion_type: AttributionConversionType;
    converted_at: string;
  };
};

type StoredAttribution = {
  first_touch?: AttributionTouch;
  latest_touch?: AttributionTouch;
};

function isBrowser() {
  return typeof window !== 'undefined';
}

function sanitizeText(raw: string | null | undefined, maxLength = 120): string | undefined {
  if (!raw) {
    return undefined;
  }

  const cleaned = raw
    .trim()
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .slice(0, maxLength);

  return cleaned || undefined;
}

function sanitizeCode(raw: string | null | undefined): string | undefined {
  const value = sanitizeText(raw, 80);
  if (!value || !/^[a-zA-Z0-9_-]+$/.test(value)) {
    return undefined;
  }

  return value.toUpperCase();
}

function sanitizePath(raw: string | null | undefined): string | undefined {
  const value = sanitizeText(raw, 500);
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return undefined;
  }

  return value.split('#')[0];
}

function sanitizeReferrer(raw: string | null | undefined): string | undefined {
  const value = sanitizeText(raw, 500);
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`;
  } catch {
    return undefined;
  }
}

function sanitizeTimestamp(raw: string | null | undefined): string | undefined {
  const value = sanitizeText(raw, 40);
  if (!value || Number.isNaN(Date.parse(value))) {
    return undefined;
  }

  return value;
}

function sanitizeTouch(raw: unknown): AttributionTouch | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined;
  }

  const source = raw as Record<string, unknown>;
  const touch: AttributionTouch = {};

  TOUCH_KEYS.forEach((key) => {
    const rawValue = typeof source[key] === 'string' ? source[key] : undefined;

    if (key === 'landing_page') {
      touch.landing_page = sanitizePath(rawValue);
      return;
    }

    if (key === 'referrer') {
      touch.referrer = sanitizeReferrer(rawValue);
      return;
    }

    if (key === 'captured_at') {
      touch.captured_at = sanitizeTimestamp(rawValue);
      return;
    }

    const value =
      key === 'src_code' || key === 'promo_code' ? sanitizeCode(rawValue) : sanitizeText(rawValue);
    if (value) {
      touch[key] = value;
    }
  });

  return Object.keys(touch).length > 0 ? touch : undefined;
}

function readStoredAttribution(): StoredAttribution {
  if (!isBrowser()) {
    return {};
  }

  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as StoredAttribution;
    if (!parsed || typeof parsed !== 'object') {
      return {};
    }

    const firstTouch = sanitizeTouch(parsed.first_touch);
    const latestTouch = sanitizeTouch(parsed.latest_touch);

    return {
      ...(firstTouch ? { first_touch: firstTouch } : {}),
      ...(latestTouch ? { latest_touch: latestTouch } : {}),
    };
  } catch {
    return {};
  }
}

function writeStoredAttribution(attribution: StoredAttribution) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // sessionStorage may be blocked or full. Attribution must never block UX.
  }
}

function hasAttributionSignal(searchParams: AttributionSearchParams): boolean {
  return ATTRIBUTION_PARAM_KEYS.some((key) => Boolean(sanitizeText(searchParams.get(key))));
}

function hasCampaignFields(touch: AttributionTouch): boolean {
  return Boolean(
    touch.utm_source ||
      touch.utm_medium ||
      touch.utm_campaign ||
      touch.utm_content ||
      touch.utm_term ||
      touch.src_code ||
      touch.promo_code,
  );
}

export function captureAttributionFromUrl(
  pathname: string,
  searchParams: AttributionSearchParams,
): AttributionTouch | undefined {
  if (!isBrowser() || isTrackingExcludedRoute(pathname) || !hasAttributionSignal(searchParams)) {
    return undefined;
  }

  const promo = findPromoCode(searchParams.get('promo'));
  const touch = sanitizeTouch({
    utm_source: sanitizeText(searchParams.get('utm_source')),
    utm_medium: sanitizeText(searchParams.get('utm_medium')),
    utm_campaign: sanitizeText(searchParams.get('utm_campaign')),
    utm_content: sanitizeText(searchParams.get('utm_content')),
    utm_term: sanitizeText(searchParams.get('utm_term')),
    src_code: sanitizeCode(searchParams.get('src')),
    promo_code: promo?.code ?? sanitizeCode(searchParams.get('promo')),
    landing_page: sanitizePath(pathname),
    referrer: sanitizeReferrer(document.referrer),
    captured_at: new Date().toISOString(),
  });

  if (!touch || !hasCampaignFields(touch)) {
    return undefined;
  }

  const stored = readStoredAttribution();
  writeStoredAttribution({
    first_touch: stored.first_touch ?? touch,
    latest_touch: touch,
  });

  return touch;
}

export function getConversionAttribution(
  conversionType: AttributionConversionType,
  conversionPage: string,
): AttributionMetadata {
  const stored = readStoredAttribution();

  return {
    ...(stored.first_touch ? { first_touch: stored.first_touch } : {}),
    ...(stored.latest_touch ? { latest_touch: stored.latest_touch } : {}),
    conversion: {
      conversion_page: sanitizePath(conversionPage) ?? '/',
      conversion_type: conversionType,
      converted_at: new Date().toISOString(),
    },
  };
}
