import Link from 'next/link';

import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function ClosingSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="flex flex-col items-center gap-8 text-center">
        <MotionSection as="div" className="flex flex-col items-center gap-8 text-center">
          <MotionItem className="space-y-5">
            <h2 className="font-heading text-3xl md:text-4xl">Ready to build what&apos;s next?</h2>
            <p className="max-w-2xl text-lg text-[var(--pv-text-muted)] md:text-xl">
              We measure our success by your success. Pixelverse Studios is here to grow with you,
              support your vision, and celebrate every milestone along the way.
            </p>
          </MotionItem>
          <MotionItem delay={0.1}>
            <Button asChild size="lg" variant="cta">
              <Link href="/contact">Contact Us to Start Your Project</Link>
            </Button>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
