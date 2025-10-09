import { Container } from '@/components/ui/container';

export function IntroSection() {
  return (
    <section className="bg-[var(--pv-surface)] pt-hero pb-16 md:pt-hero md:pb-24">
      <Container className="grid items-center gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] px-4 py-1 text-xs uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
              About PixelVerse Studios
            </span>
            <h1 className="font-heading text-4xl font-semibold leading-[3rem] md:text-5xl md:leading-[3.5rem]">
              Custom code, human-centered experiences, and lasting partnerships
            </h1>
          </div>
          <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
            We believe your website should be more than just a digital brochure. At Pixelverse, every
            site we create is designed around how real people use it — and coded from scratch to make
            it faster, stronger, and more reliable than template-built alternatives.
          </p>
        </div>
        <div
          aria-hidden="true"
          className="relative h-64 w-full overflow-hidden rounded-[1.75rem] border border-[var(--pv-border)] bg-[var(--pv-bg)] shadow-[0_45px_80px_-50px_rgba(63,0,233,0.6)] md:h-[22rem]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--pv-primary)/0.35,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,var(--pv-primary-2)/0.3,transparent_60%)]" />
          <div className="absolute inset-8 rounded-[1.25rem] border border-dashed border-white/25 dark:border-white/10" />
          <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--pv-gradient)] opacity-70 blur-2xl" />
        </div>
      </Container>
    </section>
  );
}
