import { Container } from './container';

export function ValueSection() {
  return (
    <section className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)] dark:bg-[var(--pv-bg)]">
      <Container className="grid gap-12 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div className="space-y-6">
          <h2 className="font-heading text-[2.5rem] leading-[3.125rem] text-[var(--pv-text)]">
            Your website is often the first impression of your brand.
          </h2>
          <p className="text-lg text-[var(--pv-text-muted)]">
            We make sure it’s a good one — custom-coded for speed, designed for clarity, and built to help your
            business grow.
          </p>
        </div>
        <div className="relative rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-8 shadow-pv">
          <div className="absolute inset-0 rounded-pv bg-[linear-gradient(90deg,var(--pv-primary),var(--pv-primary-2))] opacity-[0.08] mix-blend-overlay" aria-hidden />
          <div className="relative space-y-4 text-[var(--pv-text)]">
            <h3 className="font-heading text-2xl">Built for momentum</h3>
            <p className="text-[var(--pv-text-muted)]">
              Every experience is engineered for performance and guided by UX principles that keep people moving toward conversion.
            </p>
            <div className="rounded-pv-sm border border-dashed border-[var(--pv-border)] bg-[var(--pv-surface)] p-4 text-sm text-[var(--pv-text-muted)]">
              {/* TODO: Replace placeholder with motion-based visual or product showcase */}
              Placeholder visual space for interactive prototype or stat graphic.
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
