'use client';

import { Calendar } from 'lucide-react';
import { useTheme } from 'next-themes';
import { InlineWidget, useCalendlyEventListener } from 'react-calendly';

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

  useCalendlyEventListener({
    onEventScheduled: (e) => {
      const event_uri = e.data.payload.event.uri;
      const invitee_uri = e.data.payload.invitee.uri;

      fetch(`${API_BASE_URL}/api/webhooks/calendly`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_uri, invitee_uri }),
      }).catch((err) => {
        console.error('[Calendly] Webhook POST failed:', err);
      });
    },
  });

  if (!CALENDLY_URL) return <CalendlyPlaceholder />;

  const pageSettings = {
    backgroundColor: isDark ? '0e0e14' : 'ffffff',
    textColor: isDark ? 'e4e4ef' : '111111',
    primaryColor: isDark ? '7c4dff' : '3f00e9',
  };

  const bgColor = isDark ? '#0e0e14' : '#ffffff';

  return (
    <div className="space-y-6">
      <div style={{ backgroundColor: bgColor, borderRadius: '12px', overflow: 'hidden' }}>
        <InlineWidget
          url={CALENDLY_URL}
          pageSettings={pageSettings}
          styles={{ minHeight: '700px', backgroundColor: bgColor }}
        />
      </div>
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
        you&rsquo;re working toward. We&rsquo;ll use the time to determine whether working together
        makes sense and what the right next step would be.
      </p>
    </div>
  );
}
