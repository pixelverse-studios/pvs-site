import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function IntroSection() {
  return (
    <section className="bg-[var(--pv-surface)] pt-hero pb-16 md:pt-hero md:pb-24">
      <Container className="flex max-w-3xl flex-col items-center gap-8 text-center">
        <MotionSection as="div" className="flex w-full flex-col items-center gap-8 text-center">
          <MotionItem>
            <span className="inline-flex items-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] px-4 py-1 text-xs uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
              About PixelVerse Studios
            </span>
          </MotionItem>
          <MotionItem delay={0.1} className="space-y-4">
            <h1 className="font-heading text-4xl font-semibold leading-[3rem] md:text-5xl md:leading-[3.5rem]">
              Custom code, human-centered experiences, and lasting partnerships
            </h1>
            <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
              We believe your website should be more than just a digital brochure. At Pixelverse, every
              site we create is designed around how real people use it — and coded from scratch to make
              it faster, stronger, and more reliable than template-built alternatives.
            </p>
          </MotionItem>
          <MotionItem delay={0.2}>
            <div className="flex items-center gap-3 rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)]/90 px-4 py-2 text-sm text-[var(--pv-text-muted)] shadow-[0_30px_60px_-45px_rgba(63,0,233,0.65)] md:flex-row md:text-left">
              <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-[var(--pv-primary)]" />
              <span className="text-left">Strategy-led builds, engineered to move your metrics.</span>
            </div>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
