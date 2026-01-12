import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import type { LocalServicePageDefinition } from '@/data/local-service-pages';

interface LocalServiceProofProps {
  proof: LocalServicePageDefinition['proof'];
  city: string;
  serviceName: string;
}

export function LocalServiceProof({ proof, city, serviceName }: LocalServiceProofProps) {
  return (
    <section className="bg-[var(--pv-surface)] py-16 md:py-24">
      <Container className="max-w-5xl">
        <MotionSection
          as="div"
          className="grid gap-10 md:grid-cols-[minmax(0,1.25fr),minmax(0,1fr)] md:items-center"
        >
          {/* Left column - Content */}
          <div className="space-y-6">
            <MotionItem>
              <span className="text-sm uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
                {serviceName} Results
              </span>
            </MotionItem>
            <MotionItem delay={0.08}>
              <h2 className="font-heading text-3xl font-semibold leading-tight md:text-4xl">
                {proof.headline}
              </h2>
            </MotionItem>
            <MotionItem delay={0.12}>
              <p className="text-base leading-7 text-[var(--pv-text-muted)] md:text-lg md:leading-8">
                {proof.body}
              </p>
            </MotionItem>
          </div>

          {/* Right column - Stat & Testimonial */}
          <div className="space-y-6">
            {proof.stat && (
              <MotionItem delay={0.16}>
                <div className="rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-6 shadow-[0_16px_48px_-32px_rgba(63,0,233,0.25)]">
                  <div className="flex flex-col gap-2">
                    <span className="font-heading text-5xl font-semibold text-[var(--pv-primary)]">
                      {proof.stat.value}
                    </span>
                    <span className="text-sm leading-6 text-[var(--pv-text-muted)]">
                      {proof.stat.label}
                    </span>
                  </div>
                </div>
              </MotionItem>
            )}

            {proof.testimonial && (
              <MotionItem delay={0.2}>
                <blockquote className="rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-6">
                  <p className="mb-4 text-base italic leading-7 text-[var(--pv-text-muted)]">
                    &ldquo;{proof.testimonial.quote}&rdquo;
                  </p>
                  <footer className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[var(--pv-primary)]/10" />
                    <div>
                      <cite className="not-italic font-medium text-[var(--pv-text)]">
                        {proof.testimonial.name}
                      </cite>
                      <p className="text-xs text-[var(--pv-text-muted)]">
                        {proof.testimonial.role}
                        {proof.testimonial.company && `, ${proof.testimonial.company}`}
                      </p>
                    </div>
                  </footer>
                </blockquote>
              </MotionItem>
            )}
          </div>
        </MotionSection>
      </Container>
    </section>
  );
}
