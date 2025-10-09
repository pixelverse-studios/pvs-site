import { Container } from '@/components/ui/container';

const clientLogos = ['Northshore', 'Aurora Health', 'Clearline', 'VividFlow'];

export function PortfolioTrustSection() {
  return (
    <section className="bg-[var(--pv-bg)] py-16 md:py-24">
      <Container className="space-y-10 text-center">
        <div className="space-y-5">
          <h2 className="text-3xl font-semibold md:text-4xl">Trust Through Collaboration</h2>
          <p className="mx-auto max-w-3xl text-lg text-[var(--pv-text-muted)] md:text-xl">
            Our portfolio shows the variety of industries we serve — but what stays the same is our
            focus on clarity, usability, and results. Each project is a collaboration. We listen,
            adapt, and deliver a website that reflects your vision while adding UX strategy and
            technical expertise.
          </p>
        </div>
        <div className="mx-auto h-px w-full max-w-4xl bg-[var(--pv-border)]" aria-hidden />
        <div className="grid gap-4 text-sm text-[var(--pv-text-muted)] sm:grid-cols-2 md:grid-cols-4">
          {clientLogos.map((logo) => (
            <div
              key={logo}
              className="flex items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-3 text-sm font-medium uppercase tracking-[0.15em] text-[var(--pv-text-muted)] shadow-[0_20px_45px_-40px_rgba(63,0,233,0.65)] dark:bg-[var(--pv-bg)]"
            >
              {logo}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
