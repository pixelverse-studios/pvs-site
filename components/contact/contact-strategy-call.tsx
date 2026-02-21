'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, MessageSquare, Target } from 'lucide-react';
import { useTheme } from 'next-themes';
import { PopupButton, useCalendlyEventListener } from 'react-calendly';

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const WHAT_TO_EXPECT = [
  { icon: Clock, label: '30 minutes', detail: 'No fluff, just focused conversation' },
  { icon: Target, label: 'Your goals first', detail: 'We listen before we suggest anything' },
  { icon: MessageSquare, label: 'Honest fit check', detail: "We'll tell you if we're not the right match" },
];

// ─── Placeholder (no URL configured) ─────────────────────────────────────────

function CalendlyPlaceholder() {
  return (
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
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ContactStrategyCall() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [rootEl, setRootEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setRootEl(document.body);
  }, []);

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

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)]">
      {/* Header strip */}
      <div className="border-b border-[var(--pv-border)] px-8 py-6 md:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--pv-text-muted)]">
          Strategy Call
        </p>
        <h3 className="mt-1 font-heading text-xl font-semibold text-[var(--pv-text)]">
          Let&rsquo;s talk about your project
        </h3>
      </div>

      {/* Body */}
      <div className="px-8 py-8 md:px-12">
        <p className="text-sm leading-relaxed text-[var(--pv-text-muted)]">
          This call is designed to understand your goals, your current situation, and what you&rsquo;re
          working toward. We&rsquo;ll use the time to determine whether working together makes sense
          and what the right next step would be.
        </p>

        {/* What to expect */}
        <ul className="mt-6 space-y-3">
          {WHAT_TO_EXPECT.map(({ icon: Icon, label, detail }) => (
            <li key={label} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--pv-primary)_10%,transparent)]">
                <Icon className="h-3.5 w-3.5 text-[var(--pv-primary)]" aria-hidden="true" />
              </span>
              <span className="text-sm text-[var(--pv-text)]">
                <span className="font-medium">{label}</span>
                <span className="mx-1.5 text-[var(--pv-text-muted)]">—</span>
                <span className="text-[var(--pv-text-muted)]">{detail}</span>
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-8">
          {rootEl && (
            <PopupButton
              url={CALENDLY_URL}
              rootElement={rootEl}
              pageSettings={pageSettings}
              text="Pick a time that works"
              className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-[var(--pv-primary)] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-bg)]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
