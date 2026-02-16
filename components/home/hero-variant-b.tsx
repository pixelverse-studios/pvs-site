import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { homepageHero } from '@/data/homepage';

import { Container } from './container';

export function HeroVariantB() {
  return (
    <section className="grain-overlay relative overflow-hidden border-b border-[var(--pv-border)] bg-[var(--pv-surface)]">
      {/* Subtle dot pattern for texture */}
      <div className="dot-pattern absolute inset-0 opacity-50" aria-hidden />

      <Container className="relative pb-24 pt-52 sm:pt-56 md:pb-32 md:pt-60">
        <MotionSection
          as="div"
          className="grid items-start gap-16 md:grid-cols-[1.2fr_1fr] md:gap-12 lg:gap-20"
        >
          {/* Left: Badge + Oversized headline */}
          <MotionItem className="space-y-8">
            {/* Custom editorial badge */}
            <div className="badge-shimmer inline-flex items-center gap-2.5 rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] px-4 py-2 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--pv-primary)]" />
              <span className="text-xs font-medium tracking-wide text-[var(--pv-text-muted)]">
                {homepageHero.badge}
              </span>
            </div>

            <h1 className="font-heading text-[2.75rem] leading-[1.08] tracking-[-0.025em] sm:text-[3.5rem] lg:text-[4.25rem]">
              <span className="font-light text-[var(--pv-text)]">Web Design &amp;</span>
              <br />
              <span className="font-light text-[var(--pv-text)]">Development,</span>
              <br />
              <span className="bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] bg-clip-text font-semibold text-transparent">
                Done With Intention
              </span>
            </h1>
          </MotionItem>

          {/* Right: Descriptions + CTAs, separated by vertical line */}
          <MotionItem
            delay={0.12}
            className="flex flex-col gap-10 md:border-l md:border-[var(--pv-border)] md:pl-10 lg:pl-14"
          >
            <div className="space-y-4">
              {homepageHero.subheadline.map((line, i) => (
                <p key={i} className="text-[1.0625rem] leading-[1.7] text-[var(--pv-text-muted)]">
                  {line}
                </p>
              ))}
            </div>

            {/* Custom editorial buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Primary: dark pill with shimmer */}
              <Link
                href={homepageHero.primaryCta.href}
                className="btn-shimmer inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-b from-[var(--pv-text)] to-[#000] px-7 text-sm font-medium text-white shadow-[0_2px_8px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] active:translate-y-0 dark:from-white dark:to-[#e8e8f0] dark:text-[#111]"
              >
                {homepageHero.primaryCta.label}
              </Link>

              {/* Secondary: reusable ghost CTA */}
              <Button asChild variant="ctaGhost" className="h-12 rounded-full">
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
