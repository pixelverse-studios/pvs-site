'use client';

import { Suspense } from 'react';

import { Container } from '@/components/ui/container';
import { ContactDetailsForm } from './contact-details-form';
import { ContactPathSelector, useContactPath } from './contact-path-selector';
import { ContactReviewForm } from './contact-review-form';
import { ContactStrategyCall } from './contact-strategy-call';

export function ContactPageClient() {
  const activePath = useContactPath();

  return (
    <section className="bg-[var(--pv-bg)] py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Path selector */}
          <ContactPathSelector />

          {/* Form slot — Calendly has its own card styling, so skip wrapper for 'call' */}
          {activePath === 'call' ? (
            <ContactStrategyCall />
          ) : (
            <div className="rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-8 md:p-12">
              {/* Suspense boundary required because the forms call useSearchParams()
                  to read ?promo= for auto-population on statically prerendered pages. */}
              <Suspense fallback={null}>
                {activePath === 'details' && <ContactDetailsForm />}
                {activePath === 'review' && <ContactReviewForm />}
              </Suspense>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
