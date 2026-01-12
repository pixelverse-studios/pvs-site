import mixpanel from 'mixpanel-browser';

import { isTrackingExcludedRoute } from '@/lib/tracking-config';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

let isInitialized = false;

function isBrowser() {
  return typeof window !== 'undefined';
}

function isExcludedRoute(): boolean {
  if (!isBrowser()) {
    return false;
  }
  return isTrackingExcludedRoute(window.location.pathname);
}

function shouldTrack(): boolean {
  return (
    isBrowser() &&
    !isExcludedRoute() &&
    !!MIXPANEL_TOKEN &&
    process.env.NODE_ENV === 'production'
  );
}

function debugLog(...args: unknown[]) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('[Mixpanel]', ...args);
  }
}

/**
 * Initialize Mixpanel - should only be called once
 */
export function initMixpanel(): boolean {
  if (!isBrowser()) {
    return false;
  }

  if (isInitialized) {
    return true;
  }

  if (!MIXPANEL_TOKEN) {
    debugLog('No token found, skipping initialization');
    return false;
  }

  if (process.env.NODE_ENV !== 'production') {
    debugLog('Development mode - Mixpanel tracking disabled');
    return false;
  }

  try {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: false,
      track_pageview: false, // We'll handle page views manually for SPA
      persistence: 'localStorage',
      ignore_dnt: false, // Respect Do Not Track
    });
    isInitialized = true;
    debugLog('Initialized successfully');
    return true;
  } catch (error) {
    debugLog('Initialization failed:', error);
    return false;
  }
}

/**
 * Track a page view
 */
export function trackPageView(path: string, title?: string) {
  if (!shouldTrack() || !isInitialized) {
    debugLog('Page view (not sent):', path);
    return;
  }

  try {
    mixpanel.track('Page View', {
      path,
      title: title || document.title,
      referrer: document.referrer || undefined,
      url: window.location.href,
    });
    debugLog('Page view tracked:', path);
  } catch (error) {
    debugLog('Failed to track page view:', error);
  }
}

/**
 * Track a custom event
 */
export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  if (!shouldTrack() || !isInitialized) {
    debugLog('Event (not sent):', eventName, properties);
    return;
  }

  try {
    mixpanel.track(eventName, {
      ...properties,
      path: window.location.pathname,
    });
    debugLog('Event tracked:', eventName, properties);
  } catch (error) {
    debugLog('Failed to track event:', error);
  }
}

/**
 * Track CTA click
 */
export function trackCTAClick(ctaName: string, destination?: string) {
  trackEvent('CTA Click', {
    cta_name: ctaName,
    destination,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmission(formName: string, success: boolean, additionalData?: Record<string, unknown>) {
  trackEvent('Form Submission', {
    form_name: formName,
    success,
    ...additionalData,
  });
}

/**
 * Track outbound link click
 */
export function trackOutboundLink(url: string, linkText?: string) {
  trackEvent('Outbound Link', {
    url,
    link_text: linkText,
  });
}

const mp = {
  init: initMixpanel,
  trackPageView,
  trackEvent,
  trackCTAClick,
  trackFormSubmission,
  trackOutboundLink,
};

export default mp;
