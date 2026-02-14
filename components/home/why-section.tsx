import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { whySection } from '@/data/homepage';

import { Container } from './container';

export function WhySection() {
  return (
    <section className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)]">
      <Container className="py-16 md:py-24">
        <MotionSection as="div" className="grid gap-12 md:grid-cols-2 md:gap-16">
          {/* Left column: Narrative text */}
          <MotionItem className="space-y-6">
            {whySection.eyebrow && (
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
                {whySection.eyebrow}
              </p>
            )}
            <h2 className="font-heading text-[2.5rem] leading-[3.125rem] text-[var(--pv-text)]">
              {whySection.heading}
            </h2>
            <p className="text-lg leading-relaxed text-[var(--pv-text-muted)]">
              {whySection.description}
            </p>
          </MotionItem>

          {/* Right column: Problem points */}
          <MotionItem delay={0.1} className="space-y-8">
            {whySection.problemPoints.map((point, index) => (
              <MotionItem key={point.title} delay={0.1 + index * 0.08} className="space-y-3">
                <div className="flex gap-3">
                  <span
                    className="mt-1.5 inline-flex h-2 w-2 shrink-0 rounded-full bg-[var(--pv-primary)]"
                    aria-hidden="true"
                  />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-[var(--pv-text)]">{point.title}</h3>
                    <p className="leading-relaxed text-[var(--pv-text-muted)]">
                      {point.description}
                    </p>
                  </div>
                </div>
              </MotionItem>
            ))}
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
