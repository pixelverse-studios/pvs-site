import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function BlogHeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--pv-border)] bg-[var(--pv-surface)] pt-hero">
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[linear-gradient(110deg,rgba(63,0,233,0.12)_0%,rgba(201,71,255,0.18)_40%,rgba(255,255,255,0)_100%)] dark:bg-[linear-gradient(110deg,rgba(63,0,233,0.24)_0%,rgba(12,10,48,0.92)_80%,rgba(12,10,48,0.98)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-80 blur-3xl"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(63,0,233,0.22), transparent 55%), radial-gradient(circle at 70% 40%, rgba(201,71,255,0.18), transparent 50%)',
        }}
      />
      <Container className="relative py-20 md:py-28">
        <MotionSection
          as="div"
          className="mx-auto flex max-w-3xl flex-col items-center gap-10 text-center"
        >
          <MotionItem className="inline-flex items-center gap-2 rounded-full border border-[rgba(63,0,233,0.25)] bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[rgba(63,0,233,0.8)] shadow-sm backdrop-blur-sm dark:border-white/20 dark:bg-white/10 dark:text-white/80">
            Insights Hub
          </MotionItem>
          <MotionItem className="space-y-6">
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-[var(--pv-text)] sm:text-5xl md:text-[3.5rem] md:leading-[3.75rem]">
              Insights, playbooks, and launch notes for{' '}
              <span className="bg-[var(--pv-gradient)] bg-clip-text text-transparent">
                conversion-first brands
              </span>
            </h1>
            <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
              The PixelVerse team documents what we test inside service brand builds - from SEO
              content engines to analytics cadences - so your next release ships smarter.
            </p>
          </MotionItem>
          <MotionItem className="flex flex-col items-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="cta">
              <Link href="#latest">Read the latest posts</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/contact">Plan your next launch</Link>
            </Button>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
