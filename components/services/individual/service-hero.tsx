import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

interface CtaLink {
  label: string;
  href: string;
}

export interface ServiceHeroProps {
  /** Small label above the main heading (e.g., "Web Development") */
  eyebrow: string;
  /** H1 heading - primary keyword for SEO */
  title: string;
  /** Supporting description copy */
  description: string;
  /** Primary call-to-action button */
  primaryCta: CtaLink;
  /** Optional secondary call-to-action button */
  secondaryCta?: CtaLink;
  /** Optional icon displayed alongside the eyebrow */
  icon?: LucideIcon;
}

export function ServiceHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  icon: Icon,
}: ServiceHeroProps) {
  return (
    <section className="bg-[var(--pv-surface)] pb-16 pt-hero md:pb-24">
      <Container className="max-w-4xl text-center">
        <MotionSection as="div" className="space-y-6">
          <MotionItem className="flex items-center justify-center gap-3">
            {Icon && (
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_12px_28px_-12px_rgba(63,0,233,0.7)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
            )}
            <span className="text-sm uppercase tracking-[0.3em] text-[var(--pv-text-muted)]">
              {eyebrow}
            </span>
          </MotionItem>
          <MotionItem delay={0.08}>
            <h1 className="font-heading text-4xl font-semibold leading-[3rem] md:text-5xl md:leading-[3.5rem]">
              {title}
            </h1>
          </MotionItem>
          <MotionItem delay={0.12}>
            <p className="mx-auto max-w-2xl text-lg text-[var(--pv-text-muted)] md:text-xl">
              {description}
            </p>
          </MotionItem>
          <MotionItem
            delay={0.16}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" variant="cta" className="w-full sm:w-auto">
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
            {secondaryCta && (
              <Button asChild size="lg" variant="ctaGhost" className="w-full sm:w-auto">
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            )}
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
