import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { RequestReviewCta } from '@/components/ui/request-review-cta';
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
      className="bg-[var(--pv-surface)] py-16 md:py-24 dark:bg-[#0d1230]"
      aria-labelledby={headingId}
    >
      <Container>
        <MotionSection
          as="div"
          className="mx-auto max-w-3xl space-y-6 text-center"
        >
          <MotionItem>
            <div className="space-y-5">
              <div className="mx-auto h-[3px] w-14 rounded-full bg-gradient-to-r from-[var(--pv-primary)] to-[var(--pv-primary-2)]" />
              <h2
                id={headingId}
                className="font-heading text-3xl font-semibold leading-tight md:text-4xl"
              >
                {title}
              </h2>
            </div>
          </MotionItem>

          {paragraphs.map((paragraph, idx) => (
            <MotionItem key={`paragraph-${idx}`} delay={0.08 + idx * 0.06}>
              <p className="text-pretty text-lg text-[var(--pv-text-muted)] md:text-xl">
                {paragraph}
              </p>
            </MotionItem>
          ))}

          <MotionItem delay={0.2}>
            <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:justify-center">
              <Button asChild variant="cta">
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
              {secondaryCta && secondaryCta.label === 'Request a Website Review' ? (
                <RequestReviewCta variant="ctaGhost" />
              ) : secondaryCta ? (
                <Button asChild variant="ctaGhost">
                  <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              ) : null}
            </div>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
