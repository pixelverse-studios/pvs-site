import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { processSection } from '@/data/homepage';

import { Container } from './container';

// Animation timing constants
const CARD_STAGGER_INCREMENT = 0.12;

export function ProcessSection() {
  const { eyebrow, heading, subtitle, steps } = processSection;

  return (
    <section
      className="border-b border-[var(--pv-border)] bg-[var(--pv-bg)]"
      aria-labelledby="process-heading"
    >
      <Container className="py-16 md:py-24">
        <MotionSection as="div" className="space-y-12">
          {/* Header */}
          <MotionItem className="mx-auto max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
              {eyebrow}
            </p>
            <h2
              id="process-heading"
              className="font-heading text-[2.5rem] leading-[3.125rem] text-[var(--pv-text)]"
            >
              {heading}
            </h2>
            <p className="mt-4 text-lg text-[var(--pv-text-muted)]">
              {subtitle}
            </p>
          </MotionItem>

          {/* Process Steps - Horizontal on desktop, vertical on mobile */}
          <MotionSection
            as="div"
            className="relative flex flex-col gap-8 md:flex-row md:items-stretch md:justify-between"
            delay={0.1}
          >
            {steps.map((step, index) => (
              <MotionItem
                key={step.title}
                delay={index * CARD_STAGGER_INCREMENT}
                className="relative flex-1"
              >
                {/* Process Card */}
                <div className="group relative flex h-full flex-col items-center space-y-4 rounded-pv border border-[var(--pv-border)] bg-[var(--pv-surface)] p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-pv">
                  {/* Numbered Badge */}
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-sm font-semibold text-white shadow-[0_12px_24px_-12px_rgba(63,0,233,0.8)] transition-transform duration-200 group-hover:scale-110">
                    {String(step.number).padStart(2, '0')}
                  </span>

                  {/* Step Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-[var(--pv-text)]">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-[var(--pv-text-muted)]">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connecting Line (desktop only, hidden on last item) */}
                {index < steps.length - 1 && (
                  <div
                    className="absolute left-[calc(100%+1rem)] top-[2.25rem] hidden h-0.5 w-[calc(100%-2rem)] bg-[linear-gradient(90deg,var(--pv-primary),var(--pv-primary-2))] opacity-30 md:block"
                    aria-hidden="true"
                  />
                )}
              </MotionItem>
            ))}
          </MotionSection>
        </MotionSection>
      </Container>
    </section>
  );
}
