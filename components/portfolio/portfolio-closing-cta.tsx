import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function PortfolioClosingCtaSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-3xl space-y-8 text-center">
        <MotionSection as="div" className="space-y-8">
          <MotionItem className="space-y-5">
            <h2 className="text-3xl font-semibold md:text-4xl">
              See something that resonates?
            </h2>
            <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
              If you&apos;re wondering whether something similar could work for your business,
              the right next step is a conversation — not a proposal. We&apos;ll look at where
              you are and figure out what actually makes sense.
            </p>
          </MotionItem>
          <MotionItem delay={0.08} className="flex justify-center">
            <Button asChild size="lg" variant="cta">
              <Link href="/contact">Start the Conversation</Link>
            </Button>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
