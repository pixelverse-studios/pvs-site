import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function ContactTrustSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="relative overflow-hidden rounded-pv border border-[var(--pv-border)] bg-[var(--pv-surface)]/85 px-6 py-12 text-center shadow-[0_30px_60px_-45px_rgba(63,0,233,0.65)] dark:bg-[var(--pv-bg)]/80 md:px-12">
        <MotionSection as="div" className="space-y-6">
          <MotionItem className="absolute inset-x-0 top-0 h-1 bg-[var(--pv-gradient)]" aria-hidden />
          <MotionItem delay={0.08} className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-3xl font-semibold md:text-4xl">Transparent from day one</h2>
            <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
              We know choosing a design partner is a big decision. That’s why we keep communication
              simple, transparent, and honest from the very first message.
            </p>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
