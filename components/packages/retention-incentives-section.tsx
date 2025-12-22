import { CheckCircle2 } from 'lucide-react';

import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

const incentives = [
  'Save up to 20% on annual plans',
  'Get free add-ons with long-term commitments',
  'Extra discounts when bundling web + SEO',
  'Loyalty perks like audits and early access',
];

export function RetentionIncentivesSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="grid gap-10 md:grid-cols-2 md:items-center">
        <MotionSection as="div" className="space-y-5">
          <MotionItem>
            <p className="text-lg uppercase tracking-[0.3em] text-[var(--pv-text-muted)]">
              Stay longer, save more
            </p>
          </MotionItem>
          <MotionItem delay={0.08}>
            <h2 className="text-3xl font-semibold md:text-4xl">
              <span className="inline-block bg-gradient-to-r from-[var(--pv-primary)] to-[var(--pv-primary-2)] bg-clip-text text-transparent">
                Save up to 20%
              </span>{' '}
              on plans that grow with you
            </h2>
          </MotionItem>
          <MotionItem delay={0.16}>
            <p className="text-lg text-[var(--pv-text-muted)]">
              Our retention incentives reward long-term partnerships with savings, extras, and
              insights that keep your website evolving alongside your business.
            </p>
          </MotionItem>
        </MotionSection>
        <MotionSection as="ul" className="space-y-4" delay={0.12}>
          {incentives.map((item, index) => (
            <MotionItem
              key={item}
              delay={index * 0.08}
              triggerOnViewport={false}
              className="bg-[var(--pv-surface)]/70 dark:bg-[var(--pv-bg)]/60 flex items-start gap-3 rounded-pv border border-[var(--pv-border)] p-4 shadow-pv transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)]"
            >
              <CheckCircle2
                className="mt-0.5 h-5 w-5 text-[var(--pv-primary)]"
                aria-hidden="true"
              />
              <span className="text-sm text-[var(--pv-text)] dark:text-white">{item}</span>
            </MotionItem>
          ))}
        </MotionSection>
      </Container>
    </section>
  );
}
