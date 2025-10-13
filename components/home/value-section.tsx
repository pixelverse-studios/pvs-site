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
        <div className="relative overflow-hidden rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-8 shadow-pv">
          <div
            className="pointer-events-none absolute inset-0 rounded-pv bg-[radial-gradient(circle_at_top,var(--pv-primary)/0.18,transparent_70%)] opacity-80"
            aria-hidden
          />
          <div className="relative space-y-6 text-[var(--pv-text)]">
            <div className="space-y-3">
              <h3 className="font-heading text-2xl">Built for impact</h3>
              <p className="text-[var(--pv-text-muted)]">
                Headlines get roughly three seconds to land. We combine UX, copy, and engineering so
                your hero hooks fast, keeps people scrolling, and leads them straight to the next
                step.
              </p>
            </div>
            <div className="grid gap-4 text-sm text-[var(--pv-text-muted)] sm:grid-cols-2">
              <div className="rounded-pv-sm border border-[var(--pv-border)] bg-[var(--pv-surface)]/90 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pv-text-muted)]">
                  Bounce Risk
                </p>
                <p className="mt-2 text-2xl font-semibold text-[var(--pv-text)]">50%</p>
                <p className="mt-1 leading-6">
                  Visitors decide in seconds. Strong hero clarity drops bounce rates by half.
                </p>
              </div>
              <div className="rounded-pv-sm border border-[var(--pv-border)] bg-[var(--pv-surface)]/90 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pv-text-muted)]">
                  Retention Lift
                </p>
                <p className="mt-2 text-2xl font-semibold text-[var(--pv-text)]">+32%</p>
                <p className="mt-1 leading-6">
                  Clear value props and fast load times keep users exploring—and converting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
