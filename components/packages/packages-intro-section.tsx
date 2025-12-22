import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function PackagesIntroSection() {
  return (
    <section className="bg-[var(--pv-surface)] pb-16 pt-hero md:pb-24">
      <Container className="max-w-3xl space-y-6 text-center">
        <MotionSection as="div" className="space-y-6">
          <MotionItem>
            <span className="inline-flex items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] px-4 py-1 text-xs uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
              Packages &amp; Pricing
            </span>
          </MotionItem>
          <MotionItem delay={0.08} className="space-y-4">
            <h1 className="text-4xl font-semibold leading-[3rem] md:text-5xl md:leading-[3.5rem]">
              Choose the Right Fit for Your Business
            </h1>
            <div className="mx-auto h-1 w-24 rounded-full bg-[var(--pv-gradient)]" aria-hidden />
          </MotionItem>
          <MotionItem delay={0.16}>
            <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
              No two businesses are the same — and neither are their websites. That’s why we offer
              flexible packages designed to meet you where you are and grow with you.
            </p>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
