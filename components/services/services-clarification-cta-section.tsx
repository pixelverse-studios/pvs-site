import { TrackedLink } from '@/components/analytics/tracked-link';
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
      className="relative overflow-hidden bg-[var(--pv-surface)] py-16 dark:bg-[var(--pv-gradient)] dark:text-white md:py-24"
      aria-labelledby={headingId}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden dark:block dark:bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.22),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.16),transparent_50%)]"
      />
      <Container className="relative">
        <MotionSection as="div" className="mx-auto max-w-3xl space-y-6 text-center">
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
              <p className="text-pretty text-lg text-[var(--pv-text-muted)] dark:text-white/85 md:text-xl">
                {paragraph}
              </p>
            </MotionItem>
          ))}

          <MotionItem delay={0.2}>
            <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:justify-center">
              <Button asChild variant="cta">
                <TrackedLink
                  href={primaryCta.href}
                  trackingKind="cta"
                  trackingLabel={`Services clarification primary: ${primaryCta.label}`}
                >
                  {primaryCta.label}
                </TrackedLink>
              </Button>
              {secondaryCta &&
                (secondaryCta.isReviewCta ? (
                  <RequestReviewCta variant="ctaGhost" />
                ) : (
                  <Button asChild variant="ctaGhost">
                    <TrackedLink
                      href={secondaryCta.href}
                      trackingKind="cta"
                      trackingLabel={`Services clarification secondary: ${secondaryCta.label}`}
                    >
                      {secondaryCta.label}
                    </TrackedLink>
                  </Button>
                ))}
            </div>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
