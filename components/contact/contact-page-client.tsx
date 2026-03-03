'use client';

import { useState } from 'react';

import { Container } from '@/components/ui/container';
import { ContactDetailsForm } from './contact-details-form';
import { ContactPathSelector, type ContactPath } from './contact-path-selector';
import { ContactReviewForm } from './contact-review-form';
import { ContactStrategyCall } from './contact-strategy-call';

export function ContactPageClient({ defaultPath = 'details' }: { defaultPath?: ContactPath }) {
  const [activePath, setActivePath] = useState<ContactPath>(defaultPath);

  return (
    <section className="bg-[var(--pv-bg)] py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Path selector */}
          <ContactPathSelector activePath={activePath} onSelect={setActivePath} />

          {/* Form slot — Calendly has its own card styling, so skip wrapper for 'call' */}
          {activePath === 'call' ? (
            <ContactStrategyCall />
          ) : (
            <div className="rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-8 md:p-12">
              {activePath === 'details' && <ContactDetailsForm />}
              {activePath === 'review' && <ContactReviewForm />}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
