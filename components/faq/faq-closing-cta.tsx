import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function FaqClosingCtaSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="flex flex-col items-center gap-8 text-center">
        <MotionSection as="div" className="space-y-8">
          <MotionItem className="space-y-5">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Still have questions?
              <br />
              That&apos;s what the conversation is for.
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[var(--pv-text-muted)] md:text-xl">
              If something isn&apos;t covered here — or you&apos;re not sure what your website
              actually needs — the next step is a quick conversation. No pitch, no commitment.
            </p>
          </MotionItem>
          <MotionItem delay={0.08}>
            <Button asChild size="lg" variant="cta" className="w-full md:w-auto">
              <Link href="/contact">Start the Conversation</Link>
            </Button>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
