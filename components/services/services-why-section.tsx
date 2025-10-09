import { Container } from '@/components/ui/container';

export function ServicesWhySection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-3xl text-center">
        <div className="inline-flex h-1 w-24 items-center justify-center rounded-full bg-[var(--pv-gradient)]" />
        <div className="mt-8 space-y-5">
          <h2 className="text-3xl font-semibold md:text-4xl">Why choose PixelVerse</h2>
          <p className="text-lg text-[var(--pv-text-muted)]">
            We don’t cut corners with templates or one-size-fits-all solutions. Everything we
            deliver is custom, measurable, and designed to set you apart.
          </p>
        </div>
      </Container>
    </section>
  );
}
