import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { homepageHero } from '@/data/homepage';

import { Container } from './container';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--pv-border)]">
      <div
        className="absolute inset-0 -z-30 bg-[linear-gradient(90deg,var(--pv-primary),var(--pv-primary-2))]"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-20 bg-[color:var(--pv-overlay-strong)] transition-colors duration-500"
        aria-hidden
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-y-12 left-1/2 h-[130%] w-[70%] -translate-x-1/2 rounded-full bg-white/70 blur-3xl dark:bg-[color:var(--pv-overlay-soft)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.55),transparent_65%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,rgba(34,36,108,0.6),transparent_65%)]" />
        {/* TODO: Replace with branded animated gradient or hero illustration */}
      </div>
      <Container className="relative pb-24 pt-52 text-center sm:pt-56 md:pb-32 md:pt-60">
        <MotionSection
          as="div"
          className="mx-auto flex max-w-3xl flex-col items-center gap-8 rounded-pv-lg bg-white/55 p-6 shadow-[0_40px_90px_-45px_rgba(63,0,233,0.65)] backdrop-blur-md dark:bg-[color:var(--pv-overlay-soft)]"
        >
          <MotionItem className="space-y-5">
            <Badge
              variant="default"
              className="bg-white/90 text-xs font-medium text-[var(--pv-text-muted)] dark:bg-[color:var(--pv-overlay-soft)]"
              aria-label="Rated 5.0 stars by clients"
            >
              {homepageHero.badge}
            </Badge>
            <h1 className="text-shadow-md font-heading text-4xl font-semibold sm:text-5xl md:text-6xl">
              <span className="bg-[linear-gradient(90deg,var(--pv-primary-2),var(--pv-primary))] bg-clip-text text-transparent">
                {homepageHero.headline}
              </span>
            </h1>
            <p className="text-lg text-[var(--pv-text)] md:text-xl">{homepageHero.subheadline}</p>
          </MotionItem>
          <MotionItem delay={0.15} className="w-full">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Button asChild size="lg" variant="cta" className="flex-1 sm:flex-none">
                <Link href={homepageHero.primaryCta.href}>{homepageHero.primaryCta.label}</Link>
              </Button>
              <Button asChild size="lg" variant="ctaGhost" className="flex-1 sm:flex-none">
                <Link href={homepageHero.secondaryCta.href}>
                  {homepageHero.secondaryCta.label}
                </Link>
              </Button>
            </div>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
