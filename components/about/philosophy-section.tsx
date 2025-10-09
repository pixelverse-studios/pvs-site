import { Container } from '@/components/ui/container';

export function PhilosophySection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="flex flex-col items-center gap-6 text-center">
        <div className="h-1 w-24 rounded-full bg-[var(--pv-gradient)]" aria-hidden="true" />
        <div className="max-w-3xl space-y-6">
          <h2 className="font-heading text-3xl md:text-4xl">
            Our approach is rooted in partnership and guided by purpose
          </h2>
          <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
            Every project is a partnership. We take time to understand your goals, your audience, and
            your challenges — then design and code a solution that fits.
          </p>
        </div>
      </Container>
    </section>
  );
}
