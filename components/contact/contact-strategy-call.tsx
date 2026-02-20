'use client';

import { Calendar } from 'lucide-react';
import Script from 'next/script';

// Extend window with Calendly global
declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement | null;
        prefill?: Record<string, unknown>;
        utm?: Record<string, unknown>;
      }) => void;
    };
  }
}

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

// ─── Placeholder ──────────────────────────────────────────────────────────────

function CalendlyPlaceholder() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[var(--pv-border)] bg-[var(--pv-bg)] p-12 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--pv-primary)_10%,transparent)]">
        <Calendar className="h-8 w-8 text-[var(--pv-primary)]" aria-hidden="true" />
      </span>
      <div className="space-y-1.5">
        <p className="font-heading text-base font-semibold text-[var(--pv-text)]">
          Calendly Widget Integration
        </p>
        <p className="text-sm text-[var(--pv-text-muted)]">
          Insert your Calendly embed code here
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ContactStrategyCall() {
  const hasUrl = Boolean(CALENDLY_URL);

  return (
    <div className="space-y-6">
      {/* Calendly embed area */}
      {hasUrl ? (
        <>
          <div
            id="calendly-embed"
            className="w-full overflow-hidden rounded-xl"
            style={{ minHeight: '700px' }}
          />
          <Script
            src="https://assets.calendly.com/assets/external/widget.js"
            strategy="lazyOnload"
            onLoad={() => {
              window.Calendly?.initInlineWidget({
                url: CALENDLY_URL!,
                parentElement: document.getElementById('calendly-embed'),
                prefill: {},
                utm: {},
              });
            }}
          />
        </>
      ) : (
        <CalendlyPlaceholder />
      )}

      {/* Event description card */}
      <div className="rounded-xl border border-[var(--pv-border)] bg-[var(--pv-bg)] p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--pv-text-muted)]">
          Calendly Event Description
        </p>
        <p className="text-sm leading-relaxed text-[var(--pv-text-muted)]">
          This call is designed to better understand your goals, your current situation, and what
          you&rsquo;re working toward. We&rsquo;ll use the time to determine whether working
          together makes sense and what the right next step would be.
        </p>
      </div>
    </div>
  );
}
