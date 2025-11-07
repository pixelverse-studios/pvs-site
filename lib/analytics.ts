type AdSourceCode = 'G' | 'M' | 'QR' | 'AUDIT' | string;

const AD_SOURCE_COOKIE = 'ad_source';
const AD_SOURCE_LABELS: Record<string, string> = {
  G: 'Google',
  M: 'Meta',
  QR: 'QR Code',
  AUDIT: 'Audit',
  TEST: 'Test',
};

declare global {
  interface Window {
    sitebehaviourEventQueue?: Array<{ eventName: string; payload: Record<string, unknown> }>;
    sbVisitorCustomEvent?: (eventName: string, payload: Record<string, unknown>) => void;
  }
}

function isBrowser() {
  return typeof window !== 'undefined';
}

function debugLog(...args: unknown[]) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('[CampaignTracker]', ...args);
  }
}

function enqueueSiteBehaviourEvent(eventName: string, payload: Record<string, unknown>) {
  if (!isBrowser()) {
    return;
  }

  if (typeof window.sbVisitorCustomEvent === 'function') {
    window.sbVisitorCustomEvent(eventName, payload);
    return;
  }

  window.sitebehaviourEventQueue = window.sitebehaviourEventQueue || [];
  window.sitebehaviourEventQueue.push({ eventName, payload });
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
  if (!isBrowser()) {
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
  enqueueSiteBehaviourEvent('Ad Source', { source: label, code: normalized, path });
}

export function storeAdSource(code: string | null) {
  if (!isBrowser()) {
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
  if (!isBrowser()) {
    return;
  }

  enqueueSiteBehaviourEvent('Page View', { path });
}

const analytics = {
  trackAdSource,
  storeAdSource,
  getStoredAdSource,
  trackPageView,
};

export default analytics;
