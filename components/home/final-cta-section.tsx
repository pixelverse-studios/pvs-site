import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

import { Container } from './container';

export function FinalCtaSection() {
  return (
    <section id="contact" className="bg-[var(--pv-bg)] py-16 md:py-24">
      <Container>
        <MotionSection
          as="div"
          className="mx-auto max-w-3xl space-y-6 rounded-pv border border-[var(--pv-border)] bg-[var(--pv-surface)] px-6 py-16 text-center shadow-pv"
        >
          <MotionItem>
            <h2 className="font-heading text-[2.5rem] leading-[3.125rem] text-[var(--pv-text)]">
              Let&apos;s talk about what you actually need.
            </h2>
          </MotionItem>
          <MotionItem delay={0.1}>
            <p className="text-lg text-[var(--pv-text-muted)]">
              No pressure. No sales pitch. Just a conversation about your goals and how we might
              help.
            </p>
          </MotionItem>
          <MotionItem delay={0.15}>
            <Button asChild size="lg" variant="cta" className="w-full md:w-auto">
              <Link href="/contact">Book a Free Call</Link>
            </Button>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
