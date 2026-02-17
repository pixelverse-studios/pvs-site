import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { finalCta } from '@/data/homepage';

import { Container } from './container';

export function FinalCtaSection() {
  const lines = finalCta.description.split('\n');

  return (
    <section className="bg-[var(--pv-bg)] py-24 md:py-32">
      <Container>
        <MotionSection as="div" className="mx-auto max-w-2xl text-center">
          {/* Gradient accent */}
          <MotionItem>
            <div
              className="mx-auto mb-8 h-1 w-12 rounded-full"
              style={{ background: 'var(--pv-gradient)' }}
              aria-hidden
            />
          </MotionItem>

          {/* Heading */}
          <MotionItem>
            <h2 className="font-heading text-[2rem] leading-[2.5rem] tracking-[-0.02em] text-[var(--pv-text)] md:text-[2.75rem] md:leading-[3.25rem]">
              {finalCta.heading}
            </h2>
          </MotionItem>

          {/* Description paragraphs */}
          <MotionItem delay={0.08}>
            <div className="mx-auto mt-6 max-w-xl space-y-4">
              {lines.map((line, i) => (
                <p
                  key={i}
                  className="text-base leading-[1.75] text-[var(--pv-text-muted)] md:text-[1.0625rem]"
                >
                  {line}
                </p>
              ))}
            </div>
          </MotionItem>

          {/* CTA Button */}
          <MotionItem delay={0.14}>
            <div className="mt-10">
              <Button asChild variant="cta">
                <Link href={finalCta.cta.href}>{finalCta.cta.label}</Link>
              </Button>
            </div>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
