import { MotionItem, MotionSection } from '@/components/ui/motion-section';

import { Container } from './container';

export function ValueSection() {
  return (
    <section className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)] dark:bg-[var(--pv-bg)]">
      <Container>
        <MotionSection
          as="div"
          className="grid gap-12 py-16 md:grid-cols-2 md:items-center md:py-24"
        >
          <MotionItem className="space-y-6">
            <h2 className="font-heading text-[2.5rem] leading-[3.125rem] text-[var(--pv-text)]">
              Your website is often the first impression of your brand.
            </h2>
            <p className="text-lg text-[var(--pv-text-muted)]">
              We make sure it’s a good one — custom-coded for speed, designed for clarity, and built
              to help your business grow.
            </p>
          </MotionItem>
          <MotionItem
            delay={0.1}
            className="relative overflow-hidden rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-8 shadow-pv"
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-pv bg-[radial-gradient(circle_at_top,var(--pv-primary)/0.18,transparent_70%)] opacity-80"
              aria-hidden
            />
            <div className="relative space-y-6 text-[var(--pv-text)]">
              <div className="space-y-3">
                <h3 className="font-heading text-2xl">Built for impact</h3>
                <p className="text-[var(--pv-text-muted)]">
                  Your website has about three seconds to connect. We blend UX, copywriting, and
                  engineering to make sure it grabs attention fast, keeps people engaged, and guides
                  them naturally to the next step.
                </p>
              </div>
              <MotionSection
                as="div"
                className="grid gap-4 text-sm text-[var(--pv-text-muted)] sm:grid-cols-2"
                delay={0.2}
              >
                <MotionItem className="bg-[var(--pv-surface)]/90 rounded-pv-sm border border-[var(--pv-border)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pv-text-muted)]">
                    Bounce Risk
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--pv-text)]">-50%</p>
                  <p className="mt-1 leading-6">
                    Visitors decide in seconds. Strong headline clarity drops bounce rates by half.
                  </p>
                </MotionItem>
                <MotionItem
                  delay={0.08}
                  className="bg-[var(--pv-surface)]/90 rounded-pv-sm border border-[var(--pv-border)] p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pv-text-muted)]">
                    Retention Lift
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--pv-text)]">+32%</p>
                  <p className="mt-1 leading-6">
                    Clear value props and fast load times keep users exploring—and converting.
                  </p>
                </MotionItem>
              </MotionSection>
            </div>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
