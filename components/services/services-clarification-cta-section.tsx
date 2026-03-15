import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { RequestReviewCta } from '@/components/ui/request-review-cta';
import { ScrollReveal } from '@/components/home/scroll-reveal';
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
      className="relative overflow-hidden bg-[var(--pv-surface)] py-16 md:py-24 dark:bg-[var(--pv-gradient)] dark:text-white"
      aria-labelledby={headingId}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden dark:block dark:bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.22),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.16),transparent_50%)]"
      />
      <Container className="relative">
        <ScrollReveal
          className="stagger-children mx-auto max-w-3xl space-y-6 text-center"
          threshold={0.2}
        >
          <div className="stagger-item">
            <div className="space-y-5">
              <div className="mx-auto h-[3px] w-14 rounded-full bg-gradient-to-r from-[var(--pv-primary)] to-[var(--pv-primary-2)]" />
              <h2
                id={headingId}
                className="font-heading text-3xl font-semibold leading-tight md:text-4xl"
              >
                {title}
              </h2>
            </div>
          </div>

          {paragraphs.map((paragraph, idx) => (
            <div key={`paragraph-${idx}`} className="stagger-item">
              <p className="text-pretty text-lg text-[var(--pv-text-muted)] md:text-xl dark:text-white/85">
                {paragraph}
              </p>
            </div>
          ))}

          <div className="stagger-item">
            <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:justify-center">
              <Button asChild variant="cta">
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
              {secondaryCta && (
                secondaryCta.isReviewCta ? (
                  <RequestReviewCta variant="ctaGhost" />
                ) : (
                  <Button asChild variant="ctaGhost">
                    <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                  </Button>
                )
              )}
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
