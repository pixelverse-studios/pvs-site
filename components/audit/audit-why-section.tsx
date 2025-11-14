import { CheckCircle2 } from 'lucide-react';

import { Container } from '@/components/ui/container';
import { SectionHeader } from '@/components/ui/section-header';

const benefits = [
  'Higher engagement and retention',
  'Better search rankings',
  'Increased conversions',
  'Stronger brand trust',
] as const;

export function AuditWhySection() {
  return (
    <section className="border-y border-[var(--pv-border)] bg-[var(--pv-surface)]/60 py-16 dark:bg-[var(--pv-surface)]/20 md:py-24">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <SectionHeader
          eyebrow="Why It Matters"
          title="Your website is your digital first impression."
          description="Small usability or performance issues can quietly reduce conversions and visibility. Our audit highlights where your site performs well and where improvements could make a measurable impact."
        />
        <ul className="space-y-6 rounded-3xl border border-[var(--pv-border)] bg-[var(--pv-bg)]/90 p-8 shadow-[var(--pv-shadow)]">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-4">
              <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--pv-primary)]/15 text-[var(--pv-primary)] dark:text-white">
                <CheckCircle2 className="h-5 w-5" aria-hidden />
              </span>
              <p className="text-lg text-[var(--pv-text)]">{benefit}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
