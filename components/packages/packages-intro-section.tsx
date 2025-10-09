import { Container } from '@/components/ui/container';

export function PackagesIntroSection() {
  return (
    <section className="bg-[var(--pv-surface)] pt-hero pb-16 md:pb-24">
      <Container className="max-w-3xl text-center space-y-6">
        <span className="inline-flex items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] px-4 py-1 text-xs uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
          Packages &amp; Pricing
        </span>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold leading-[3rem] md:text-5xl md:leading-[3.5rem]">
            Choose the Right Fit for Your Business
          </h1>
          <div className="mx-auto h-1 w-24 rounded-full bg-[var(--pv-gradient)]" aria-hidden />
        </div>
        <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
          No two businesses are the same — and neither are their websites. That’s why we offer
          flexible packages designed to meet you where you are and grow with you.
        </p>
      </Container>
    </section>
  );
}
