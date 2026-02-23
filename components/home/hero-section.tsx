'use client';

import Link from 'next/link';
import {
  Code2,
  Figma,
  Globe,
  Layers,
  LayoutGrid,
  Palette,
  Pencil,
  Rocket,
  Smartphone,
  Sparkles,
} from 'lucide-react';

import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { homepageHero } from '@/data/homepage';

import { Container } from './container';

const floatingIcons = [
  // Left side — design-oriented
  { Icon: Palette, className: 'hero-float-icon hero-float-1 left-[6%] top-[18%]' },
  { Icon: Figma, className: 'hero-float-icon hero-float-2 left-[12%] top-[55%]' },
  { Icon: Pencil, className: 'hero-float-icon hero-float-3 left-[3%] top-[72%]' },
  { Icon: Sparkles, className: 'hero-float-icon hero-float-4 left-[18%] top-[38%]' },
  { Icon: LayoutGrid, className: 'hero-float-icon hero-float-5 left-[8%] top-[85%]' },
  // Right side — development-oriented
  { Icon: Code2, className: 'hero-float-icon hero-float-6 right-[7%] top-[22%]' },
  { Icon: Globe, className: 'hero-float-icon hero-float-7 right-[14%] top-[50%]' },
  { Icon: Layers, className: 'hero-float-icon hero-float-8 right-[4%] top-[68%]' },
  { Icon: Rocket, className: 'hero-float-icon hero-float-9 right-[16%] top-[34%]' },
  { Icon: Smartphone, className: 'hero-float-icon hero-float-10 right-[9%] top-[82%]' },
];

export function HeroSection({ badge }: { badge?: string }) {
  return (
    <section className="hero-aurora relative overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0 -z-30 bg-gradient-to-b from-[var(--pv-surface)] via-[var(--pv-bg)] to-[var(--pv-bg)]"
        aria-hidden
      />

      {/* Content spotlight — soft brand glow behind text */}
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_50%_45%,var(--pv-hero-spotlight),transparent_70%)]"
        aria-hidden
      />

      {/* Edge vignette */}
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,transparent_30%,var(--pv-bg)_100%)] opacity-70"
        aria-hidden
      />

      {/* Floating icons — hidden on mobile, visible on larger screens */}
      <div className="absolute inset-0 -z-10 hidden md:block" aria-hidden>
        {floatingIcons.map(({ Icon, className }, i) => (
          <Icon key={i} className={className} strokeWidth={1.2} />
        ))}
      </div>

      <Container className="relative pb-32 pt-52 sm:pt-56 md:pb-44 md:pt-64">
        <MotionSection
          as="div"
          className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center"
          triggerOnViewport={false}
          motionProps={{ initial: 'hidden', animate: 'visible' }}
        >
          {/* Badge */}
          <MotionItem triggerOnViewport={false}>
            <div className="badge-shimmer inline-flex items-center gap-2.5 rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)]/70 px-4 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.04] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--pv-primary)] shadow-[0_0_8px_2px_var(--pv-primary)] dark:bg-[var(--pv-primary-2)] dark:shadow-[0_0_8px_2px_var(--pv-primary-2)]" />
              <span className="text-xs font-medium tracking-wide text-[var(--pv-text-muted)]">
                {badge ?? homepageHero.badge}
              </span>
            </div>
          </MotionItem>

          {/* Headline */}
          <MotionItem delay={0.08} className="space-y-2" triggerOnViewport={false}>
            <h1 className="hero-headline font-heading text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              <span className="bg-[linear-gradient(145deg,var(--pv-primary)_0%,#6d28d9_40%,var(--pv-primary-2)_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(145deg,#ffffff_0%,#c4b5fd_35%,var(--pv-primary-2)_75%,#f0abfc_100%)]">
                {homepageHero.headline}
              </span>
            </h1>
          </MotionItem>

          {/* Subheadlines */}
          <MotionItem delay={0.14} className="max-w-xl space-y-3" triggerOnViewport={false}>
            {homepageHero.subheadline.map((line, i) => (
              <p
                key={i}
                className="text-[1.0625rem] leading-[1.7] text-[var(--pv-text-muted)]"
              >
                {line}
              </p>
            ))}
          </MotionItem>

          {/* CTAs */}
          <MotionItem delay={0.2} triggerOnViewport={false}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Link
                href={homepageHero.primaryCta.href}
                className="btn-glow-pulse inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(to_bottom,var(--pv-primary),#2d00b3)] px-8 text-sm font-semibold text-white shadow-[0_4px_16px_-2px_rgba(63,0,233,0.45),0_1px_3px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-4px_rgba(63,0,233,0.55)] active:translate-y-0 dark:bg-[linear-gradient(to_bottom,#a78bfa,var(--pv-primary-2))] dark:text-[#0a0020] dark:shadow-[0_4px_24px_-4px_rgba(201,71,255,0.4)] dark:hover:shadow-[0_8px_32px_-4px_rgba(201,71,255,0.55)]"
              >
                {homepageHero.primaryCta.label}
              </Link>

              <Link
                href={homepageHero.secondaryCta.href}
                className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)]/50 px-7 text-sm font-medium text-[var(--pv-text-muted)] backdrop-blur-sm transition-all duration-200 hover:border-[var(--pv-text-muted)] hover:text-[var(--pv-text)] active:scale-[0.98] dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-white/70 dark:hover:border-white/[0.2] dark:hover:text-white"
              >
                {homepageHero.secondaryCta.label}
              </Link>
            </div>
          </MotionItem>
        </MotionSection>
      </Container>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--pv-bg)] via-[var(--pv-bg)]/60 to-transparent"
        aria-hidden
      />
    </section>
  );
}
