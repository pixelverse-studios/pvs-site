import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function PortfolioIntroSection() {
  return (
    <section className="pt-hero bg-[var(--pv-surface)] pb-16 md:pb-24">
      <Container className="max-w-3xl text-center">
        <MotionSection as="div" className="space-y-6">
          <MotionItem>
            <span className="inline-flex items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] px-4 py-1 text-xs uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
              Portfolio
            </span>
          </MotionItem>
          <MotionItem delay={0.08}>
            <h1 className="text-4xl font-semibold leading-[3rem] md:text-5xl md:leading-[3.5rem]">
              Every project tells a story
            </h1>
          </MotionItem>
          <MotionItem delay={0.16}>
            <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
              Every project tells a story - about growth, trust, and digital transformation. Explore
              the work we’ve done and see how we help businesses like yours succeed online.
            </p>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
