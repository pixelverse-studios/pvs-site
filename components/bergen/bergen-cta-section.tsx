import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function BergenCtaSection() {
  return (
    <section className="relative overflow-hidden border-y border-[var(--pv-border)] bg-[var(--pv-bg)] py-20 md:py-28">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1/2 -translate-y-1/3 bg-[radial-gradient(circle,var(--pv-primary-2)_0%,transparent_70%)] opacity-50 blur-3xl dark:opacity-60"
      />
      <Container className="relative">
        <MotionSection className="mx-auto max-w-3xl text-center">
          <MotionItem className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
              Strategy · UX · Engineering · SEO · CRO
            </p>
            <h2 className="font-heading text-4xl leading-tight md:text-5xl">
              Let’s apply the full PixelVerse program to your Bergen County goals
            </h2>
            <p className="text-lg text-[var(--pv-text-muted)]">
              Share where you want to grow, and we’ll craft a Bergen-focused plan that covers design,
              SEO, content, and ongoing optimization in under 48 hours.
            </p>
          </MotionItem>
          <MotionItem className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="cta">
              <Link href="/contact">Schedule your consult</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/portfolio">View recent launches</Link>
            </Button>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
