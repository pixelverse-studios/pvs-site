import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function ServicesClosingCtaSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-3xl space-y-8 text-center">
        <MotionSection as="div" className="space-y-8">
          <MotionItem className="space-y-5">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Your business deserves a site built for more. Let&apos;s make it happen.
            </h2>
            <p className="text-lg text-[var(--pv-text-muted)]">
              Partner with a team that designs every touchpoint intentionally and codes every feature
              for performance.
            </p>
          </MotionItem>
          <MotionItem delay={0.08} className="flex w-full justify-center">
            <Button asChild size="lg" variant="cta" className="w-full md:w-auto">
              <Link href="/contact">Contact Us to Start Your Project</Link>
            </Button>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
