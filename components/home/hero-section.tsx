import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

import { Container } from './container';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--pv-border)]">
      <div
        className="absolute inset-0 -z-30 bg-[linear-gradient(90deg,var(--pv-primary),var(--pv-primary-2))]"
        aria-hidden
      />
      <div className="absolute inset-0 -z-20 bg-white/75 dark:bg-[#050510]/80" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-y-12 left-1/2 h-[130%] w-[70%] -translate-x-1/2 rounded-full bg-white/70 blur-3xl dark:bg-white/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.55),transparent_65%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.65),transparent_65%)]" />
        {/* TODO: Replace with branded animated gradient or hero illustration */}
      </div>
      <Container className="relative pt-52 pb-24 text-center sm:pt-56 md:pt-60 md:pb-32">
        <MotionSection
          as="div"
          className="mx-auto flex max-w-3xl flex-col items-center gap-8 rounded-pv-lg bg-white/55 p-6 shadow-[0_40px_90px_-45px_rgba(63,0,233,0.65)] backdrop-blur-md dark:bg-[#080811]/80"
        >
          <MotionItem className="space-y-5">
            <span className="inline-flex items-center rounded-full border border-[var(--pv-border)] bg-white/80 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-[var(--pv-text)] shadow-sm dark:bg-white/10 dark:text-white">
              PixelVerse Studios
            </span>
            <h1 className="font-heading text-4xl font-semibold text-[var(--pv-text)] text-shadow-md sm:text-5xl md:text-6xl">
              Custom-built Websites:{' '}
              <span className="bg-[linear-gradient(90deg,var(--pv-primary),var(--pv-primary-2))] bg-clip-text text-transparent">
                Your business deserves more than a template
              </span>
            </h1>
            <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
              We create digital presences built to scale.
            </p>
          </MotionItem>
          <MotionItem delay={0.15}>
            <Button asChild size="lg" variant="cta">
              <Link href="#contact">Let&apos;s Discuss Your Project</Link>
            </Button>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
