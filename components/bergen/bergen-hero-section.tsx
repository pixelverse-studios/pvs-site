import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function BergenHeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--pv-border)] bg-[color:var(--pv-surface)]">
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,var(--pv-primary),var(--pv-primary-2))] opacity-70"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.55),transparent_65%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(10,10,15,0.6),transparent_65%)]"
      />
      <Container className="relative py-24 md:py-32">
        <MotionSection className="mx-auto flex max-w-4xl flex-col items-center gap-10 text-center">
          <MotionItem className="inline-flex items-center gap-2 rounded-full border border-white/70 px-5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm backdrop-blur-md dark:border-white/30">
            PixelVerse Studios · Bergen County
          </MotionItem>
          <MotionItem className="space-y-6">
            <h1 className="font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
              Custom-coded websites & growth programs for Bergen County businesses
            </h1>
            <p className="text-lg text-white/85 md:text-xl">
              The same PixelVerse service mix—strategy, UX, development, SEO, and CRO—delivered with the
              speed and polish we’re known for, now aimed squarely at Bergen County searches and buyers.
            </p>
          </MotionItem>
          <MotionItem className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="cta">
              <Link href="/contact">Book a Bergen Strategy Call</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/70 !text-white hover:bg-white/10 hover:!text-white"
            >
              <Link href="#bergen-towns">Explore Town Coverage</Link>
            </Button>
          </MotionItem>
          <MotionItem className="grid gap-6 rounded-pv-lg border border-white/25 bg-white/15 p-6 text-left text-white backdrop-blur-md md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-semibold">{stat.value}</p>
                <p className="mt-2 text-sm uppercase tracking-wide text-white/75">{stat.label}</p>
              </div>
            ))}
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}

const stats = [
  { label: 'Custom builds launched', value: '120+' },
  { label: 'Average SEO traffic lift', value: '+68%' },
  { label: 'Dedicated local support', value: '24/5' }
];
