import { isTrackingExcludedRoute } from '@/lib/tracking-config';

type AdSourceCode = 'G' | 'M' | 'QR' | 'AUDIT' | string;
type AnalyticsPrimitive = string | number | boolean | null | undefined;
type AnalyticsValue = AnalyticsPrimitive | readonly AnalyticsPrimitive[];
type AnalyticsPayload = Record<string, AnalyticsValue>;
type LeadConversionPayload = Partial<
  Pick<AnalyticsPayload, 'budget_range' | 'timeline' | 'interest_category' | 'promo_code'>
>;
type ReviewConversionPayload = Partial<Pick<AnalyticsPayload, 'promo_code'>>;
type AnalyticsEventName =
  | 'page_view'
  | 'campaign_landing'
  | 'contact_path_select'
  | 'lead_form_start'
  | 'review_form_start'
  | 'generate_lead'
  | 'website_review_request'
  | 'strategy_call_click'
  | 'strategy_call_scheduled'
  | 'phone_click'
  | 'email_click'
  | 'cta_click';
type SiteBehaviourEventName =
  | 'Page View'
  | 'Ad Source'
  | 'Contact Path Select'
  | 'Lead Form Start'
  | 'Review Form Start'
  | 'Generate Lead'
  | 'Website Review Request'
  | 'Strategy Call Click'
  | 'Strategy Call Scheduled'
  | 'Phone Click'
  | 'Email Click'
  | 'CTA Click';

const AD_SOURCE_COOKIE = 'ad_source';
const AD_SOURCE_LABELS: Record<string, string> = {
  G: 'Google',
  M: 'Meta',
  QR: 'QR Code',
  AUDIT: 'Audit',
  TEST: 'Test',
};

const SITEBEHAVIOUR_EVENT_NAMES: Record<AnalyticsEventName, SiteBehaviourEventName> = {
  page_view: 'Page View',
  campaign_landing: 'Ad Source',
  contact_path_select: 'Contact Path Select',
  lead_form_start: 'Lead Form Start',
  review_form_start: 'Review Form Start',
  generate_lead: 'Generate Lead',
  website_review_request: 'Website Review Request',
  strategy_call_click: 'Strategy Call Click',
  strategy_call_scheduled: 'Strategy Call Scheduled',
  phone_click: 'Phone Click',
  email_click: 'Email Click',
  cta_click: 'CTA Click',
};

const ALLOWED_DATA_LAYER_PARAMETERS = new Set([
  'page_path',
  'page_title',
  'traffic_source',
  'traffic_medium',
  'campaign',
  'campaign_content',
  'campaign_term',
  'src_code',
  'promo_code',
  'form_type',
  'budget_range',
  'timeline',
  'interest_category',
  'contact_path',
  'cta_location',
  'cta_destination',
]);

const ALLOWED_SITEBEHAVIOUR_PARAMETERS = new Set([
  'path',
  'source',
  'code',
  'contactPath',
  'formType',
  'budgetRange',
  'timeline',
  'interestCategory',
  'promoCode',
  'location',
  'destination',
]);

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | IArguments | unknown[]>;
    gtag?: (...args: unknown[]) => void;
    sitebehaviourEventQueue?: Array<{ eventName: string; payload: Record<string, unknown> }>;
    sbVisitorCustomEvent?: (eventName: string, payload: Record<string, unknown>) => void;
  }
}

function isBrowser() {
  return typeof window !== 'undefined';
}

function isExcludedRoute(): boolean {
  if (!isBrowser()) {
    return false;
  }
  return isTrackingExcludedRoute(window.location.pathname);
}

function isExcludedPayloadRoute(payload: AnalyticsPayload): boolean {
  const pagePath = payload.page_path;

  return typeof pagePath === 'string' && isTrackingExcludedRoute(pagePath);
}

function debugLog(...args: unknown[]) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('[CampaignTracker]', ...args);
  }
}

function isAnalyticsValueArray(value: AnalyticsValue): value is readonly AnalyticsPrimitive[] {
  return Array.isArray(value);
}

function normalizeAnalyticsValue(
  value: AnalyticsValue,
): string | number | boolean | null | undefined {
  if (isAnalyticsValueArray(value)) {
    return value.filter((item) => item !== null && item !== undefined).join(',');
  }

  return value;
}

function normalizeUnknownAnalyticsValue(
  value: unknown,
): string | number | boolean | null | undefined {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null ||
    value === undefined
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .filter(
        (item): item is string | number | boolean =>
          typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean',
      )
      .join(',');
  }

  return undefined;
}

function isSafeInternalDestination(value: string | number | boolean | null): boolean {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');
}

function sanitizeDataLayerPayload(
  payload: AnalyticsPayload,
): Record<string, string | number | boolean | null> {
  const safePayload: Record<string, string | number | boolean | null> = {};

  Object.entries(payload).forEach(([key, rawValue]) => {
    if (!ALLOWED_DATA_LAYER_PARAMETERS.has(key)) {
      return;
    }

    const value = normalizeAnalyticsValue(rawValue);
    if (value === undefined) {
      return;
    }

    if (key === 'cta_destination' && !isSafeInternalDestination(value)) {
      return;
    }

    safePayload[key] = value;
  });

  return safePayload;
}

function sanitizeSiteBehaviourPayload(
  payload: Record<string, unknown>,
): Record<string, string | number | boolean | null> {
  const safePayload: Record<string, string | number | boolean | null> = {};

  Object.entries(payload).forEach(([key, rawValue]) => {
    if (!ALLOWED_SITEBEHAVIOUR_PARAMETERS.has(key)) {
      return;
    }

    const value = normalizeUnknownAnalyticsValue(rawValue);
    if (value === undefined) {
      return;
    }

    if (key === 'destination' && !isSafeInternalDestination(value)) {
      return;
    }

    safePayload[key] = value;
  });

  return safePayload;
}

function getContactPathFromDestination(destination: string): string | undefined {
  if (destination.startsWith('/contact/details')) {
    return 'details';
  }

  if (destination.startsWith('/contact/call')) {
    return 'call';
  }

  if (destination.startsWith('/contact/review')) {
    return 'review';
  }

  return undefined;
}

function enqueueDataLayerEvent(eventName: AnalyticsEventName, payload: AnalyticsPayload = {}) {
  if (!isBrowser() || isExcludedRoute() || isExcludedPayloadRoute(payload)) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...sanitizeDataLayerPayload(payload),
  });
}

function enqueueSiteBehaviourEvent(eventName: string, payload: Record<string, unknown>) {
  if (!isBrowser() || isExcludedRoute()) {
    return;
  }

  const safePayload = sanitizeSiteBehaviourPayload(payload);

  if (typeof window.sbVisitorCustomEvent === 'function') {
    window.sbVisitorCustomEvent(eventName, safePayload);
    return;
  }

  window.sitebehaviourEventQueue = window.sitebehaviourEventQueue || [];
  window.sitebehaviourEventQueue.push({ eventName, payload: safePayload });
}

export function trackEvent(
  eventName: AnalyticsEventName,
  payload: AnalyticsPayload = {},
  siteBehaviourPayload: Record<string, unknown> = payload,
) {
  if (!isBrowser() || isExcludedRoute() || isExcludedPayloadRoute(payload)) {
    return;
  }

  enqueueDataLayerEvent(eventName, payload);
  enqueueSiteBehaviourEvent(SITEBEHAVIOUR_EVENT_NAMES[eventName], siteBehaviourPayload);
}

function normalizeSource(code: string | null): AdSourceCode | null {
  if (!code) {
    return null;
  }

  const trimmed = code.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.toUpperCase();
}

export function trackAdSource(code: string | null, path: string) {
  if (!isBrowser() || isExcludedRoute()) {
    return;
  }

  const normalized = normalizeSource(code);
  if (!normalized) {
    return;
  }

  const sessionKey = `ad_source_${normalized}`;
  if (sessionStorage.getItem(sessionKey)) {
    return;
  }

  sessionStorage.setItem(sessionKey, '1');
  const label = AD_SOURCE_LABELS[normalized] ?? normalized;
  debugLog('Tracking ad source', label, path);
  trackEvent(
    'campaign_landing',
    {
      traffic_source: label,
      src_code: normalized,
      page_path: path,
    },
    { source: label, code: normalized, path },
  );
}

export function storeAdSource(code: string | null) {
  if (!isBrowser() || isExcludedRoute()) {
    return;
  }

  const normalized = normalizeSource(code);
  if (!normalized) {
    return;
  }

  document.cookie = `${AD_SOURCE_COOKIE}=${encodeURIComponent(normalized)}; path=/; max-age=${
    60 * 60 * 24 * 30
  }; SameSite=Lax`;
}

export function getStoredAdSource(): string | null {
  if (!isBrowser()) {
    return null;
  }

  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${AD_SOURCE_COOKIE}=`));

  if (!cookie) {
    return null;
  }

  try {
    const value = decodeURIComponent(cookie.split('=')[1] ?? '');
    return value || null;
  } catch {
    return null;
  }
}

export function trackPageView(path: string) {
  if (!isBrowser() || isTrackingExcludedRoute(path) || isExcludedRoute()) {
    return;
  }

  trackEvent('page_view', { page_path: path }, { path });
}

export function trackContactPathSelect(contactPath: string, pagePath: string) {
  trackEvent(
    'contact_path_select',
    { contact_path: contactPath, page_path: pagePath },
    { contactPath, path: pagePath },
  );
}

export function trackFormStart(formType: 'details' | 'review', pagePath: string) {
  trackEvent(
    formType === 'review' ? 'review_form_start' : 'lead_form_start',
    { form_type: formType, page_path: pagePath },
    { formType, path: pagePath },
  );
}

export function trackLeadConversion(payload: LeadConversionPayload = {}) {
  trackEvent(
    'generate_lead',
    { form_type: 'details', ...payload },
    {
      formType: 'details',
      budgetRange: payload.budget_range,
      timeline: payload.timeline,
      interestCategory: payload.interest_category,
      promoCode: payload.promo_code,
    },
  );
}

export function trackWebsiteReviewRequest(payload: ReviewConversionPayload = {}) {
  trackEvent(
    'website_review_request',
    { form_type: 'review', ...payload },
    { formType: 'review', promoCode: payload.promo_code },
  );
}

export function trackStrategyCallClick(pagePath: string) {
  trackEvent(
    'strategy_call_click',
    { contact_path: 'call', page_path: pagePath },
    { path: pagePath },
  );
}

export function trackStrategyCallScheduled(pagePath: string) {
  trackEvent(
    'strategy_call_scheduled',
    { contact_path: 'call', page_path: pagePath },
    { path: pagePath },
  );
}

export function trackPhoneClick(_linkUrl: string, pagePath: string) {
  trackEvent('phone_click', { contact_path: 'phone', page_path: pagePath }, { path: pagePath });
}

export function trackEmailClick(_linkUrl: string, pagePath: string) {
  trackEvent('email_click', { contact_path: 'email', page_path: pagePath }, { path: pagePath });
}

export function trackCtaClick(ctaLocation: string, ctaDestination: string, pagePath: string) {
  const contactPath = getContactPathFromDestination(ctaDestination);

  trackEvent(
    'cta_click',
    {
      cta_location: ctaLocation,
      cta_destination: ctaDestination,
      contact_path: contactPath,
      page_path: pagePath,
    },
    { location: ctaLocation, destination: ctaDestination, contactPath, path: pagePath },
  );
}

const analytics = {
  trackEvent,
  trackAdSource,
  storeAdSource,
  getStoredAdSource,
  trackPageView,
  trackContactPathSelect,
  trackFormStart,
  trackLeadConversion,
  trackWebsiteReviewRequest,
  trackStrategyCallClick,
  trackStrategyCallScheduled,
  trackPhoneClick,
  trackEmailClick,
  trackCtaClick,
};

export default analytics;
