import { findPromoCode } from '@/lib/promo-codes';
import { isTrackingExcludedRoute } from '@/lib/tracking-config';

const ATTRIBUTION_STORAGE_KEY = 'pvs_attribution';
// Tab-scoped, with a 30-minute inactivity boundary; this is not cross-device attribution.
const SESSION_IDLE_MS = 30 * 60 * 1000;
const capturedDocuments = new WeakSet<Document>();
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
  last_activity?: number;
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
    .slice(0, maxLength)
    .trim();

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

  return value.split(/[?#]/)[0];
}

function sanitizeReferrer(raw: string | null | undefined): string | undefined {
  const value = sanitizeText(raw, 500);
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol)) return undefined;
    // Referrer paths and queries can contain personal or sensitive information.
    return url.origin;
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

  return Object.values(touch).some((value) => value !== undefined) ? touch : undefined;
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

    const lastActivity = parsed.last_activity;
    if (
      typeof lastActivity !== 'number' ||
      Date.now() - lastActivity >= SESSION_IDLE_MS ||
      lastActivity > Date.now()
    ) {
      return {};
    }

    const firstTouch = sanitizeTouch(parsed.first_touch);
    const latestTouch = sanitizeTouch(parsed.latest_touch);

    return {
      ...(firstTouch ? { first_touch: firstTouch } : {}),
      ...(latestTouch ? { latest_touch: latestTouch } : {}),
      last_activity: lastActivity,
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
  if (!isBrowser() || isTrackingExcludedRoute(pathname)) {
    return undefined;
  }

  const stored = readStoredAttribution();
  const promo = findPromoCode(searchParams.get('promo'));
  const campaignFields: AttributionTouch = {
    utm_source: sanitizeText(searchParams.get('utm_source')),
    utm_medium: sanitizeText(searchParams.get('utm_medium')),
    utm_campaign: sanitizeText(searchParams.get('utm_campaign')),
    utm_content: sanitizeText(searchParams.get('utm_content')),
    utm_term: sanitizeText(searchParams.get('utm_term')),
    src_code: sanitizeCode(searchParams.get('src')),
    promo_code: promo?.code ?? sanitizeCode(searchParams.get('promo')),
  };
  const campaign = hasCampaignFields(campaignFields);
  const isDocumentEntry = !capturedDocuments.has(document);
  capturedDocuments.add(document);
  const referrerOrigin = isDocumentEntry ? sanitizeReferrer(document.referrer) : undefined;
  const externalReferrer =
    referrerOrigin && referrerOrigin !== window.location.origin ? referrerOrigin : undefined;
  // Only valid campaigns or a fresh external document entry can replace the
  // latest touch. Internal/unknown navigation and invalid codes preserve it.
  if (!campaign && !externalReferrer && stored.first_touch) {
    writeStoredAttribution({ ...stored, last_activity: Date.now() });
    return undefined;
  }

  const touch = sanitizeTouch({
    ...campaignFields,
    landing_page: sanitizePath(pathname),
    referrer: externalReferrer,
    captured_at: new Date().toISOString(),
  });

  if (!touch) {
    return undefined;
  }

  writeStoredAttribution({
    first_touch: stored.first_touch ?? touch,
    latest_touch: touch,
    last_activity: Date.now(),
  });

  // Existing consumers dispatch campaign_landing only for explicit campaigns.
  return campaign ? touch : undefined;
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
