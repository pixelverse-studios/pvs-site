'use client';

import { useState } from 'react';
import { Calendar, CalendarCheck, X } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

// Build-time constant — set NEXT_PUBLIC_CALENDLY_URL at build time to activate the widget
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

// Inject theme-aware color params. Without embed_type in the URL, Calendly
// treats the iframe src as a direct-visit and applies background_color to the
// document body — the same behavior seen when opening the URL in a browser tab.
function buildThemedUrl(baseUrl: string, isDark: boolean): string {
  const url = new URL(baseUrl.split('?')[0]);
  url.searchParams.set('background_color', isDark ? '0e0e14' : 'ffffff');
  url.searchParams.set('text_color', isDark ? 'e4e4ef' : '111111');
  url.searchParams.set('primary_color', isDark ? '7c4dff' : '3f00e9');
  return url.toString();
}

// ─── Placeholder (no URL configured) ─────────────────────────────────────────

function CalendlyPlaceholder() {
  return (
    <div className="space-y-6">
      <div
        role="status"
        aria-label="Online scheduling temporarily unavailable"
        className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[var(--pv-border)] bg-[var(--pv-bg)] p-12 text-center"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--pv-primary)_10%,transparent)]">
          <Calendar className="h-8 w-8 text-[var(--pv-primary)]" aria-hidden="true" />
        </span>
        <div className="space-y-1.5">
          <p className="font-heading text-base font-semibold text-[var(--pv-text)]">
            Online Scheduling Coming Soon
          </p>
          <p className="text-sm text-[var(--pv-text-muted)]">
            Scheduling isn&rsquo;t available here yet — email us at{' '}
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
      <DescriptionCard />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ContactStrategyCall() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [isOpen, setIsOpen] = useState(false);

  if (!CALENDLY_URL) return <CalendlyPlaceholder />;

  const themedUrl = buildThemedUrl(CALENDLY_URL, isDark);
  const bgColor = isDark ? '#0e0e14' : '#ffffff';

  return (
    <>
      <div className="space-y-6">
        {/* CTA card */}
        <div className="flex flex-col items-center gap-6 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-bg)] px-8 py-14 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--pv-primary)_10%,transparent)]">
            <CalendarCheck className="h-8 w-8 text-[var(--pv-primary)]" aria-hidden="true" />
          </span>

          <div className="space-y-2">
            <h3 className="font-heading text-xl font-semibold text-[var(--pv-text)]">
              Book a 30-Minute Discovery Call
            </h3>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--pv-text-muted)]">
              Pick a time that works for you. We&rsquo;ll talk through your goals and figure out
              whether working together makes sense.
            </p>
          </div>

          <Button
            variant="cta"
            size="lg"
            onClick={() => setIsOpen(true)}
            aria-label="Open scheduling calendar"
          >
            <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
            Choose a Time
          </Button>
        </div>

        <DescriptionCard />
      </div>

      {/* ── Custom modal ── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Schedule a strategy call"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        >
          {/* Backdrop — click to close */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal container — we own this, so background is always correct */}
          <div
            className="relative z-10 w-full max-w-[1000px] overflow-hidden rounded-2xl shadow-2xl"
            style={{
              height: 'min(90svh, 700px)',
              backgroundColor: bgColor,
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close scheduling modal"
              className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white transition-colors hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            {/* Plain iframe — no embed_type param means Calendly renders as a full
                page visit and correctly applies background_color to the document body */}
            <iframe
              src={themedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              title="Schedule a Strategy Call — Calendly"
              style={{ backgroundColor: bgColor, colorScheme: isDark ? 'dark' : 'light' }}
            />
          </div>
        </div>
      )}
    </>
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
        you&rsquo;re working toward. We&rsquo;ll use the time to determine whether working together
        makes sense and what the right next step would be.
      </p>
    </div>
  );
}
