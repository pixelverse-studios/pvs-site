import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function ServicesWhySection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-3xl text-center">
        <MotionSection as="div" className="space-y-8">
          <MotionItem className="inline-flex h-1 w-24 items-center justify-center rounded-full bg-[var(--pv-gradient)]" />
          <MotionItem delay={0.08} className="space-y-5">
            <h2 className="text-3xl font-semibold md:text-4xl">Why choose PixelVerse</h2>
            <p className="text-lg text-[var(--pv-text-muted)]">
              We don’t cut corners with templates or one-size-fits-all solutions. Everything we
              deliver is custom, measurable, and designed to set you apart.
            </p>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
