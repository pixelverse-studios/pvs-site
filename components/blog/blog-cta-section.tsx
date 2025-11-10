import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function BlogCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--pv-surface)] text-[var(--pv-text)] dark:bg-[var(--pv-gradient)] dark:text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden dark:block dark:bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.22),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.16),transparent_50%)]"
      />
      <Container className="relative py-16 md:py-24">
        <MotionSection
          as="div"
          className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
          triggerOnViewport={false}
        >
          <MotionItem className="inline-flex items-center gap-2 rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)]/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--pv-text-muted)] dark:border-white/30 dark:bg-white/10 dark:text-white/80">
            Work with PixelVerse
          </MotionItem>
          <MotionItem className="space-y-4">
            <h2 className="font-heading text-[2.5rem] leading-[3rem]">
              Ready to put these ideas into action?
            </h2>
            <p className="text-lg text-[var(--pv-text-muted)] dark:text-white/85">
              We help businesses design, develop, and optimize websites that turn insight into
              measurable results.
            </p>
          </MotionItem>
          <MotionItem className="flex flex-col items-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="cta">
              <Link href="/contact">Book a strategy call</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[var(--pv-border)] bg-[var(--pv-bg)] text-[var(--pv-primary)] hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)] dark:border-white/40 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
            >
              <Link href="/portfolio">See recent launches</Link>
            </Button>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
