import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function TrustTransparencySection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-8 text-center">
        <MotionSection as="div" className="space-y-8">
          <MotionItem className="mx-auto h-px w-full max-w-3xl bg-[var(--pv-border)]" aria-hidden />
          <MotionItem delay={0.08} className="space-y-5">
            <h2 className="text-3xl font-semibold md:text-4xl">Trust &amp; Transparency</h2>
            <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
              We believe in pricing that’s clear and upfront. No hidden fees, no confusing tiers —
              just packages designed to give you exactly what you need, when you need it.
            </p>
          </MotionItem>
          <MotionItem delay={0.16} className="mx-auto h-px w-full max-w-3xl bg-[var(--pv-border)]" aria-hidden />
        </MotionSection>
      </Container>
    </section>
  );
}
