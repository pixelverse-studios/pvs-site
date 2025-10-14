import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

const clientHighlights = [
  {
    name: 'Jones Pressure Washing',
    detail: 'Local home services brand — custom scheduling + SEO foundations.',
  },
  {
    name: '360 Degree Care',
    detail: 'Healthcare network — accessibility-first redesign and lead nurturing.',
  },
  {
    name: 'Domani',
    detail: 'Productivity SaaS — growth marketing site and analytics-ready funnels.',
  },
];

export function PortfolioTrustSection() {
  return (
    <section className="bg-[var(--pv-bg)] py-16 md:py-24">
      <Container className="space-y-12">
        <MotionSection as="div" className="space-y-5 text-center">
          <MotionItem>
            <h2 className="text-3xl font-semibold md:text-4xl"></h2>
          </MotionItem>
          <MotionItem delay={0.08}>
            <p className="mx-auto max-w-3xl text-lg text-[var(--pv-text-muted)] md:text-xl"></p>
          </MotionItem>
        </MotionSection>
        <MotionSection
          as="div"
          className="mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3"
          delay={0.12}
        >
          {clientHighlights.map((client, index) => (
            <MotionItem
              key={client.name}
              delay={index * 0.08}
              triggerOnViewport={false}
              className="flex h-full flex-col gap-2 rounded-[1.5rem] border border-[var(--pv-border)] bg-[var(--pv-surface)] p-5 text-left shadow-[0_20px_45px_-40px_rgba(63,0,233,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--pv-primary)] dark:bg-[var(--pv-bg)]"
            >
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--pv-text-muted)]">
                Client
              </span>
              <p className="text-base font-semibold text-[var(--pv-text)]">{client.name}</p>
              <p className="text-sm leading-6 text-[var(--pv-text-muted)]">{client.detail}</p>
            </MotionItem>
          ))}
        </MotionSection>
      </Container>
    </section>
  );
}
