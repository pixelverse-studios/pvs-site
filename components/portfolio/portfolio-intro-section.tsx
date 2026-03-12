import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function PortfolioIntroSection() {
  return (
    <section className="bg-[var(--pv-surface)] pb-16 pt-hero md:pb-24">
      <Container className="max-w-3xl text-center">
        <MotionSection as="div" className="space-y-6">
          <MotionItem>
            <span className="inline-flex items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] px-4 py-1 text-xs uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
              Portfolio
            </span>
          </MotionItem>
          <MotionItem delay={0.08}>
            <h1 className="text-4xl font-semibold leading-[3rem] md:text-5xl md:leading-[3.5rem]">
              Work built around real business goals
            </h1>
          </MotionItem>
          <MotionItem delay={0.16}>
            <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
              Each project started the same way: with a conversation about what wasn&apos;t working
              and why. What came next depended on the business, not a template.
            </p>
          </MotionItem>
          <MotionItem delay={0.24}>
            <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
              Some businesses needed a website built from scratch. Others had a site that looked fine
              but wasn&apos;t generating calls, bookings, or the kind of trust that turns a visitor
              into a customer. In every case, we started by understanding the business first — its
              audience, its goals, and where the current approach was falling short.
            </p>
          </MotionItem>
          <MotionItem delay={0.32}>
            <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
              The work below reflects that approach. These aren&apos;t just websites — they&apos;re
              solutions built around specific problems, tested against real outcomes, and measured by
              whether they moved the business forward. From local service companies building search
              visibility across multiple counties to SaaS products focused on daily user retention,
              the throughline is the same: strategy before design, clarity before features, and
              outcomes over aesthetics.
            </p>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
