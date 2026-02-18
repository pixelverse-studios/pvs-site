import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import type { CTA } from '@/data/service-paths';

interface ServicesClarificationCtaSectionProps {
  title: string;
  description?: string;
  primaryCta: CTA;
  secondaryCta?: CTA;
}

export function ServicesClarificationCtaSection({
  title,
  description,
  primaryCta,
  secondaryCta,
}: ServicesClarificationCtaSectionProps) {
  const headingId = 'services-clarification-title';
  const paragraphs = (description || '').split('\n\n').filter(Boolean);

  return (
    <section
      className="bg-[var(--pv-bg)] py-16 md:py-24"
      aria-labelledby={headingId}
    >
      <Container>
        <MotionSection
          as="div"
          className="mx-auto max-w-3xl space-y-6 rounded-pv border border-[var(--pv-border)] bg-[var(--pv-surface)] px-6 py-16 text-center shadow-pv"
        >
          <MotionItem>
            <h2
              id={headingId}
              className="font-heading text-3xl font-semibold leading-tight md:text-4xl"
            >
              {title}
            </h2>
          </MotionItem>

          {paragraphs.map((paragraph, idx) => (
            <MotionItem key={`paragraph-${idx}`} delay={0.08 + idx * 0.06}>
              <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
                {paragraph}
              </p>
            </MotionItem>
          ))}

          <MotionItem delay={0.2}>
            <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:justify-center">
              <Button asChild variant="cta">
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
              {secondaryCta && (
                <Button asChild variant="ctaGhost">
                  <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              )}
            </div>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
