import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { cn } from '@/lib/utils';

interface CtaLink {
  label: string;
  href: string;
}

export interface ServiceCtaProps {
  /** Main CTA heading */
  heading: string;
  /** Supporting description */
  description: string;
  /** Primary call-to-action button */
  primaryCta: CtaLink;
  /** Optional secondary call-to-action button */
  secondaryCta?: CtaLink;
  /** Visual variant (default: 'default') */
  variant?: 'default' | 'gradient' | 'surface';
}

const variantClasses = {
  default: '',
  gradient:
    'bg-[linear-gradient(135deg,rgba(63,0,233,0.06),rgba(201,71,255,0.04))] border-y border-[var(--pv-border)]',
  surface: 'bg-[var(--pv-surface)]',
};

export function ServiceCta({
  heading,
  description,
  primaryCta,
  secondaryCta,
  variant = 'default',
}: ServiceCtaProps) {
  return (
    <section className={cn('py-16 md:py-24', variantClasses[variant])}>
      <Container className="max-w-3xl space-y-8 text-center">
        <MotionSection as="div" className="space-y-8">
          <MotionItem className="space-y-5">
            <h2 className="text-3xl font-semibold md:text-4xl">{heading}</h2>
            <p className="text-lg text-[var(--pv-text-muted)]">{description}</p>
          </MotionItem>
          <MotionItem
            delay={0.08}
            className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row"
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
