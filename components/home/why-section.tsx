import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { whySection } from '@/data/homepage';

import { Container } from './container';

export function WhySection() {
  return (
    <section
      className="border-b border-[var(--pv-border)] bg-[var(--pv-bg)]"
      aria-labelledby="why-heading"
    >
      <Container className="py-20 md:py-28">
        <MotionSection as="div" className="mx-auto max-w-3xl">
          {/* Gradient accent bar */}
          <MotionItem>
            <div
              className="mb-10 h-1 w-12 rounded-full"
              style={{ background: 'var(--pv-gradient)' }}
              aria-hidden
            />
          </MotionItem>

          {/* Heading */}
          <MotionItem>
            <h2
              id="why-heading"
              className="font-heading text-[2rem] leading-[2.5rem] tracking-[-0.02em] text-[var(--pv-text)] md:text-[2.5rem] md:leading-[3rem]"
            >
              {whySection.heading}
            </h2>
          </MotionItem>

          {/* Narrative paragraphs */}
          <MotionItem delay={0.08} className="mt-8 space-y-6">
            {whySection.paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className={`text-[1.0625rem] leading-[1.85] text-[var(--pv-text-muted)] md:text-lg md:leading-[1.85] ${
                  i === whySection.paragraphs.length - 1 ? 'font-medium text-[var(--pv-text)]' : ''
                }`}
              >
                {paragraph}
              </p>
            ))}
          </MotionItem>

          {/* CTA */}
          <MotionItem delay={0.14} className="mt-10">
            <Link
              href={whySection.cta.href}
              className="group inline-flex items-center gap-2.5 rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] px-6 py-3 text-sm font-semibold text-[var(--pv-text)] shadow-sm transition-all duration-200 hover:border-[var(--pv-primary)] hover:shadow-md"
            >
              {whySection.cta.label}
              <ArrowRight className="h-4 w-4 text-[var(--pv-primary)] transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
