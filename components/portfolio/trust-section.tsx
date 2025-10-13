import { Container } from '@/components/ui/container';

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
        <div className="space-y-5 text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">Trust Through Collaboration</h2>
          <p className="mx-auto max-w-3xl text-lg text-[var(--pv-text-muted)] md:text-xl">
            Our portfolio shows the variety of industries we serve — but what stays the same is our
            focus on clarity, usability, and results. Each project is a collaboration. We listen,
            adapt, and deliver a website that reflects your vision while adding UX strategy and
            technical expertise.
          </p>
        </div>
        <div className="mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {clientHighlights.map((client) => (
            <div
              key={client.name}
              className="flex h-full flex-col gap-2 rounded-[1.5rem] border border-[var(--pv-border)] bg-[var(--pv-surface)] p-5 text-left shadow-[0_20px_45px_-40px_rgba(63,0,233,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--pv-primary)] dark:bg-[var(--pv-bg)]"
            >
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--pv-text-muted)]">
                Client
              </span>
              <p className="text-base font-semibold text-[var(--pv-text)]">{client.name}</p>
              <p className="text-sm leading-6 text-[var(--pv-text-muted)]">{client.detail}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
