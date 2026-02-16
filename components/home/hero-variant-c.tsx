'use client';

import Link from 'next/link';

import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { homepageHero } from '@/data/homepage';

import { Container } from './container';

export function HeroVariantC() {
  return (
    <section className="grain-overlay relative overflow-hidden border-b border-[var(--pv-border)]">
      {/* Theme-aware base background */}
      <div
        className="absolute inset-0 -z-30 bg-gradient-to-b from-[var(--pv-surface)] to-[var(--pv-bg)]"
        aria-hidden
      />

      {/* Aurora gradient orbs — soft in light, vivid in dark */}
      <div className="absolute inset-0 -z-20 overflow-hidden" aria-hidden>
        <div className="aurora-layer aurora-layer-1" />
        <div className="aurora-layer aurora-layer-2" />
        <div className="aurora-layer aurora-layer-3" />
      </div>

      {/* Center glow — subtle brand presence */}
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,var(--pv-overlay-glow),transparent_70%)]"
        aria-hidden
      />

      {/* Vignette — soft fade at edges */}
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--pv-bg)_100%)] opacity-60"
        aria-hidden
      />

      <Container className="relative pb-28 pt-52 sm:pt-56 md:pb-40 md:pt-64">
        <MotionSection
          as="div"
          className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center"
        >
          {/* Badge */}
          <MotionItem>
            <div className="badge-shimmer bg-[var(--pv-bg)]/80 inline-flex items-center gap-2.5 rounded-full border border-[var(--pv-border)] px-4 py-2 backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.04]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--pv-primary)] shadow-[0_0_6px_var(--pv-primary)] dark:bg-[var(--pv-primary-2)] dark:shadow-[0_0_6px_var(--pv-primary-2)]" />
              <span className="text-xs font-medium tracking-wide text-[var(--pv-text-muted)]">
                {homepageHero.badge}
              </span>
            </div>
          </MotionItem>

          {/* Headline with gradient text */}
          <MotionItem delay={0.08} className="space-y-2">
            <h1 className="font-heading text-4xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              <span className="bg-[linear-gradient(135deg,var(--pv-primary)_10%,var(--pv-primary-2)_80%)] bg-clip-text text-transparent dark:bg-[linear-gradient(135deg,#ffffff_10%,#d4c4ff_45%,var(--pv-primary-2)_80%)]">
                {homepageHero.headline}
              </span>
            </h1>
          </MotionItem>

          {/* Subheadlines */}
          <MotionItem delay={0.14} className="max-w-xl space-y-3">
            {homepageHero.subheadline.map((line, i) => (
              <p key={i} className="text-[1.0625rem] leading-[1.7] text-[var(--pv-text-muted)]">
                {line}
              </p>
            ))}
          </MotionItem>

          {/* CTAs */}
          <MotionItem delay={0.2}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              {/* Primary: inverted solid with glow */}
              <Link
                href={homepageHero.primaryCta.href}
                className="btn-glow-pulse inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-b from-[var(--pv-text)] to-[#000] px-7 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] active:translate-y-0 dark:from-white dark:to-[#e8e8f0] dark:text-[#06041a] dark:shadow-[0_16px_32px_-8px_rgba(255,255,255,0.2)] dark:hover:shadow-[0_20px_40px_-8px_rgba(255,255,255,0.3)]"
              >
                {homepageHero.primaryCta.label}
              </Link>

              {/* Secondary: ghost border */}
              <Link
                href={homepageHero.secondaryCta.href}
                className="bg-[var(--pv-bg)]/50 inline-flex h-12 items-center justify-center rounded-full border border-[var(--pv-border)] px-7 text-sm font-medium text-[var(--pv-text-muted)] backdrop-blur-sm transition-all duration-200 hover:border-[var(--pv-text-muted)] hover:text-[var(--pv-text)] active:scale-[0.98] dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-white/70 dark:hover:border-white/[0.2] dark:hover:text-white"
              >
                {homepageHero.secondaryCta.label}
              </Link>
            </div>
          </MotionItem>
        </MotionSection>
      </Container>

      {/* Bottom gradient fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--pv-bg)] to-transparent"
        aria-hidden
      />
    </section>
  );
}
