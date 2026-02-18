import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

/**
 * CTA link with fully customizable label text.
 *
 * Supports conversational labels (e.g., "Start the Conversation", "See How It Works")
 * as well as action-oriented labels (e.g., "Get a Free Quote", "View Our Work").
 * No label text is hardcoded — pass whatever fits the page tone.
 */
interface CtaLink {
  label: string;
  href: string;
}

/**
 * Hero section for individual service pages.
 *
 * All CTA text is caller-supplied — use whatever tone fits the page.
 *
 * @example Conversational tone (Web Development page)
 * ```tsx
 * <ServiceHero
 *   eyebrow="Web Design & Development"
 *   title="Websites Built to Convert, Not Just Look Good"
 *   description="We build fast, custom websites that turn visitors into clients."
 *   primaryCta={{ label: "Start the Conversation", href: "/contact" }}
 *   secondaryCta={{ label: "See How It Works", href: "#process" }}
 *   icon={Monitor}
 * />
 * ```
 *
 * @example Direct/action tone
 * ```tsx
 * <ServiceHero
 *   eyebrow="Local SEO"
 *   title="Get Found by Customers in Your City"
 *   description="Rank higher in local search and bring in more foot traffic."
 *   primaryCta={{ label: "Get a Free Audit", href: "/contact" }}
 *   secondaryCta={{ label: "View Results", href: "/portfolio" }}
 * />
 * ```
 */
export interface ServiceHeroProps {
  /** Small label above the main heading (e.g., "Web Development") */
  eyebrow: string;
  /** H1 heading — primary keyword for SEO */
  title: string;
  /** Supporting description copy */
  description: string;
  /**
   * Primary call-to-action button.
   * Label is fully customizable — use conversational ("Start the Conversation")
   * or action-oriented ("Get a Free Quote") copy as needed.
   */
  primaryCta: CtaLink;
  /**
   * Optional secondary call-to-action button.
   * Label is fully customizable — e.g., "See How It Works", "View Our Work".
   */
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
