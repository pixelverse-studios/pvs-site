import Link from 'next/link';

import { CityServicePageDefinition } from '@/data/services-city-pages';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

interface CityServicesCtaSectionProps {
  cta: CityServicePageDefinition['cta'];
}

export function CityServicesCtaSection({ cta }: CityServicesCtaSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-4xl">
        <MotionSection
          as="div"
          className="flex flex-col items-center gap-6 rounded-pv border border-[var(--pv-primary)]/40 bg-[linear-gradient(135deg,rgba(63,0,233,0.12),rgba(201,71,255,0.1))] px-8 py-12 text-center shadow-[0_40px_90px_-60px_rgba(63,0,233,0.55)]"
        >
          <MotionItem>
            <h2 className="font-heading text-3xl font-semibold text-[var(--pv-text)] md:text-4xl">
              {cta.headline}
            </h2>
          </MotionItem>
          <MotionItem delay={0.08}>
            <p className="text-lg leading-8 text-[var(--pv-text-muted)]">{cta.body}</p>
          </MotionItem>
          <MotionItem delay={0.12} className="flex flex-col gap-4 md:flex-row">
            <Button asChild size="lg" variant="cta">
              <Link href={cta.primary.href}>{cta.primary.label}</Link>
            </Button>
            {cta.secondary ? (
              <Button asChild variant="ghost" size="lg" className="border border-[var(--pv-border)]">
                <Link href={cta.secondary.href}>{cta.secondary.label}</Link>
              </Button>
            ) : null}
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
