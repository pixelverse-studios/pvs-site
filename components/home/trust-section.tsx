import { Container } from './container';

const placeholderLogos = ['Nova Labs', 'Latitude Co.', 'Parse Studio', 'Brightwave'];

export function TrustSection() {
  return (
    <section className="bg-[var(--pv-surface)]/70 dark:bg-[var(--pv-surface)]/40 border-b border-[var(--pv-border)]">
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <h2 className="font-heading text-[2.25rem] leading-[2.75rem] text-[var(--pv-text)]">
            From startups to established businesses, we’ve helped brands create websites that
            actually work.
          </h2>
          <p className="text-lg text-[var(--pv-text-muted)]">
            Our process is clear, collaborative, and built around delivering results you can trust.
          </p>
        </div>
        <div className="mt-12">
          <div className="flex flex-wrap items-center justify-center gap-6 rounded-pv border border-dashed border-[var(--pv-border)] bg-[var(--pv-bg)] px-6 py-8 text-sm text-[var(--pv-text-muted)] md:gap-8">
            {placeholderLogos.map((logo) => (
              <span
                key={logo}
                className="flex h-12 items-center justify-center rounded-pv-sm border border-[var(--pv-border)] bg-[var(--pv-surface)] px-6 text-xs uppercase tracking-[0.2em]"
              >
                {logo}
              </span>
            ))}
            {/* TODO: Replace placeholders with actual client logos or carousel */}
          </div>
        </div>
      </Container>
    </section>
  );
}
