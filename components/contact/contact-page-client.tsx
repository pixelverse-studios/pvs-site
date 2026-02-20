'use client';

import { useState } from 'react';

import { Container } from '@/components/ui/container';
import { ContactPathSelector, type ContactPath } from './contact-path-selector';

export function ContactPageClient() {
  const [activePath, setActivePath] = useState<ContactPath>('details');

  return (
    <section className="bg-[var(--pv-bg)] py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Path selector */}
          <ContactPathSelector activePath={activePath} onSelect={setActivePath} />

          {/* Form slot */}
          <div className="rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-8 md:p-12">
            {activePath === 'details' && (
              <div className="text-center text-[var(--pv-text-muted)]">
                <p className="font-medium">Details form coming soon</p>
              </div>
            )}
            {activePath === 'call' && (
              <div className="text-center text-[var(--pv-text-muted)]">
                <p className="font-medium">Calendly embed coming soon</p>
              </div>
            )}
            {activePath === 'review' && (
              <div className="text-center text-[var(--pv-text-muted)]">
                <p className="font-medium">Website review form coming soon</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
