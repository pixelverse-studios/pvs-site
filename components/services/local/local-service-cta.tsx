import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import type { LocalServicePageDefinition } from '@/data/local-service-pages';

interface LocalServiceCtaProps {
  cta: LocalServicePageDefinition['cta'];
  contactHref: string;
}

export function LocalServiceCta({ cta, contactHref }: LocalServiceCtaProps) {
  return (
    <section className="bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] py-16 md:py-24">
      <Container className="max-w-3xl text-center">
        <MotionSection as="div" className="space-y-6">
          <MotionItem>
            <h2 className="font-heading text-3xl font-semibold text-white md:text-4xl">
              {cta.headline}
            </h2>
          </MotionItem>
          <MotionItem delay={0.08}>
            <p className="mx-auto max-w-2xl text-lg leading-8 text-white/90">{cta.body}</p>
          </MotionItem>
          <MotionItem delay={0.12} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full bg-white text-[var(--pv-primary)] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)] hover:bg-white/90 sm:w-auto"
            >
              <Link href={contactHref}>{cta.primaryLabel}</Link>
            </Button>
            {cta.secondaryLabel && cta.secondaryHref && (
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="w-full border border-white/30 text-white hover:bg-white/10 sm:w-auto"
              >
                <Link href={cta.secondaryHref}>{cta.secondaryLabel}</Link>
              </Button>
            )}
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
