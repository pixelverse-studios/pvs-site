'use client';

import { useRef } from 'react';

import { motion, useInView } from 'framer-motion';

import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { insightSection } from '@/data/homepage';

import { Container } from './container';

const BEAT_COUNT = insightSection.beats.length;

function InsightCard({ label, text, index }: { label: string; text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const isLast = index === BEAT_COUNT - 1;

  const gradientProgress = index / (BEAT_COUNT - 1);
  const labelColor = gradientProgress < 0.5 ? 'var(--pv-primary)' : 'var(--pv-primary-2)';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: (index % 3) * 0.08 }}
      className="group relative flex h-full flex-col"
    >
      <div className="hover:border-[var(--pv-primary)]/30 relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-8">
        {/* Gradient top accent */}
        <motion.div
          className="absolute left-0 right-0 top-0 h-[2px]"
          style={{ background: 'var(--pv-gradient)' }}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        />

        {/* Number badge */}
        <div
          className="mb-5 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ background: 'var(--pv-gradient)' }}
        >
          {index + 1}
        </div>

        {/* Label */}
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: labelColor }}
        >
          {label}
        </p>

        {/* Text */}
        <p
          className={`text-[0.9375rem] leading-[1.75] md:text-base md:leading-[1.75] ${
            isLast ? 'font-semibold text-[var(--pv-text)]' : 'text-[var(--pv-text-muted)]'
          }`}
        >
          {text}
        </p>
      </div>
    </motion.div>
  );
}

export function InsightSectionVariantC() {
  return (
    <section
      className="border-b border-[var(--pv-border)] bg-[var(--pv-bg)]"
      aria-labelledby="insight-heading"
    >
      <Container className="py-20 md:py-28">
        <MotionSection as="div">
          {/* Header */}
          <div className="mx-auto mb-14 max-w-3xl">
            <MotionItem>
              <div
                className="mb-10 h-1 w-12 rounded-full"
                style={{ background: 'var(--pv-gradient)' }}
                aria-hidden
              />
            </MotionItem>

            <MotionItem>
              <h2
                id="insight-heading"
                className="font-heading text-[2rem] leading-[2.5rem] tracking-[-0.02em] text-[var(--pv-text)] md:text-[2.5rem] md:leading-[3rem]"
              >
                {insightSection.heading}
              </h2>
            </MotionItem>
          </div>

          {/* Cards grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {insightSection.beats.map((beat, i) => (
              <InsightCard key={beat.label} label={beat.label} text={beat.text} index={i} />
            ))}
          </div>
        </MotionSection>
      </Container>
    </section>
  );
}
