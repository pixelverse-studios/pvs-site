import { Container } from '@/components/ui/container';

export function PortfolioIntroSection() {
  return (
    <section className="bg-[var(--pv-surface)] pt-hero pb-16 md:pb-24">
      <Container className="max-w-3xl text-center">
        <div className="space-y-6 animate-in fade-in duration-500">
          <span className="inline-flex items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] px-4 py-1 text-xs uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
            Portfolio
          </span>
          <h1 className="text-4xl font-semibold leading-[3rem] md:text-5xl md:leading-[3.5rem]">
            Every project tells a story
          </h1>
          <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
            Every project tells a story — about growth, trust, and digital transformation. Explore
            the work we’ve done and see how we help businesses like yours succeed online.
          </p>
        </div>
      </Container>
    </section>
  );
}
