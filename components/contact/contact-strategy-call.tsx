'use client';

import { useCallback, useRef, useState } from 'react';
import { AlertCircle, Calendar, Loader2 } from 'lucide-react';
import Script from 'next/script';

// Extend window with Calendly global
declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
      }) => void;
    };
  }
}

// Build-time constant — set NEXT_PUBLIC_CALENDLY_URL at build time to activate the embed
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

// ─── Placeholder (no URL configured) ─────────────────────────────────────────

function CalendlyPlaceholder() {
  return (
    <div
      role="status"
      aria-label="Online scheduling temporarily unavailable"
      className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[var(--pv-border)] bg-[var(--pv-bg)] p-12 text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--pv-primary)_10%,transparent)]">
        <Calendar className="h-8 w-8 text-[var(--pv-primary)]" aria-hidden="true" />
      </span>
      <div className="space-y-1.5">
        <p className="font-heading text-base font-semibold text-[var(--pv-text)]">
          Online Scheduling Coming Soon
        </p>
        <p className="text-sm text-[var(--pv-text-muted)]">
          Scheduling isn&rsquo;t available here yet — use the form below or email us at{' '}
          <a
            href="mailto:hello@pixelversestudios.io"
            className="font-medium text-[var(--pv-primary)] underline underline-offset-2"
          >
            hello@pixelversestudios.io
          </a>{' '}
          to set up a call.
        </p>
      </div>
    </div>
  );
}

// ─── Error fallback ───────────────────────────────────────────────────────────

function CalendlyError() {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/40 dark:bg-red-950/30">
      <AlertCircle className="h-8 w-8 text-red-500" aria-hidden="true" />
      <div className="space-y-1">
        <p className="font-medium text-red-700 dark:text-red-400">
          Couldn&rsquo;t load the scheduling widget
        </p>
        <p className="text-sm text-red-600 dark:text-red-500">
          Email us at{' '}
          <a
            href="mailto:hello@pixelversestudios.io"
            className="font-medium underline underline-offset-2"
          >
            hello@pixelversestudios.io
          </a>{' '}
          to book a call instead.
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ContactStrategyCall() {
  const hasUrl = Boolean(CALENDLY_URL);
  const embedRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Called by onReady — fires on every mount (first load AND remounts after tab switch)
  const initWidget = useCallback(() => {
    if (embedRef.current && window.Calendly && CALENDLY_URL) {
      window.Calendly.initInlineWidget({
        url: CALENDLY_URL,
        parentElement: embedRef.current,
      });
      setIsLoaded(true);
    }
  }, []);

  if (!hasUrl) return (
    <div className="space-y-6">
      <CalendlyPlaceholder />
      <DescriptionCard />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Calendly embed area */}
      <div
        role="region"
        aria-label="Calendly scheduling widget"
        className="relative w-full overflow-hidden rounded-xl"
        style={{ minHeight: '700px' }}
      >
        {/* Loading state — shown until widget initialises */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-[var(--pv-text-muted)]">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--pv-primary)]" aria-hidden="true" />
              <span className="text-sm">Loading calendar&hellip;</span>
            </div>
          </div>
        )}

        {hasError ? (
          <CalendlyError />
        ) : (
          <div ref={embedRef} className="w-full" style={{ minHeight: '700px' }} />
        )}
      </div>

      <Script
        id="calendly-widget"
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onReady={initWidget}
        onError={() => setHasError(true)}
      />

      <DescriptionCard />
    </div>
  );
}

// ─── Description card ─────────────────────────────────────────────────────────

function DescriptionCard() {
  return (
    <div className="rounded-xl border border-[var(--pv-border)] bg-[var(--pv-bg)] p-6">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--pv-text-muted)]">
        About This Call
      </h3>
      <p className="text-sm leading-relaxed text-[var(--pv-text-muted)]">
        This call is designed to better understand your goals, your current situation, and what
        you&rsquo;re working toward. We&rsquo;ll use the time to determine whether working
        together makes sense and what the right next step would be.
      </p>
    </div>
  );
}
