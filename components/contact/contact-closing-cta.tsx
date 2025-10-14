import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function ContactClosingCtaSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,var(--pv-primary)/0.18,transparent_70%)] blur-3xl"
        aria-hidden
      />
      <Container className="flex flex-col items-center gap-8 text-center">
        <MotionSection as="div" className="space-y-8">
          <MotionItem className="space-y-5">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Your business deserves a website that works. Let&apos;s make it happen.
            </h2>
            <p className="max-w-2xl text-lg text-[var(--pv-text-muted)] md:text-xl">
              We’ll craft a roadmap tailored to your goals and bring the team that can design, build,
              and iterate alongside you.
            </p>
          </MotionItem>
          <MotionItem delay={0.08}>
            <Button asChild size="lg" variant="cta" className="w-full md:w-auto">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
