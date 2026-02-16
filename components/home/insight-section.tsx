'use client';

import { useRef } from 'react';

import { motion, useInView } from 'framer-motion';

import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { insightSection } from '@/data/homepage';

import { Container } from './container';

const BEAT_COUNT = insightSection.beats.length;

function InsightBeat({ label, text, index }: { label: string; text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const isLast = index === BEAT_COUNT - 1;

  // Progress the accent color from --pv-primary to --pv-primary-2
  const gradientProgress = index / (BEAT_COUNT - 1);
  const accentStyle = {
    background: `linear-gradient(180deg, var(--pv-primary) ${(1 - gradientProgress) * 100}%, var(--pv-primary-2) 100%)`,
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
      className={`relative pl-8 ${isLast ? '' : 'pb-2'}`}
    >
      {/* Left accent line */}
      <motion.div
        className="absolute left-0 top-0 w-[3px] rounded-full"
        style={accentStyle}
        initial={{ height: 0 }}
        animate={isInView ? { height: '100%' } : { height: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      />

      {/* Beat label */}
      <p
        className="mb-2 text-xs font-semibold uppercase tracking-[0.15em]"
        style={{
          color: gradientProgress < 0.5 ? 'var(--pv-primary)' : 'var(--pv-primary-2)',
        }}
      >
        {label}
      </p>

      {/* Beat text */}
      <p
        className={`text-[1.0625rem] leading-[1.85] md:text-lg md:leading-[1.85] ${
          isLast ? 'font-semibold text-[var(--pv-text)]' : 'text-[var(--pv-text-muted)]'
        }`}
      >
        {text}
      </p>
    </motion.div>
  );
}

export function InsightSection() {
  return (
    <section
      className="border-b border-[var(--pv-border)] bg-[var(--pv-bg)]"
      aria-labelledby="insight-heading"
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
              id="insight-heading"
              className="mb-12 font-heading text-[2rem] leading-[2.5rem] tracking-[-0.02em] text-[var(--pv-text)] md:text-[2.5rem] md:leading-[3rem]"
            >
              {insightSection.heading}
            </h2>
          </MotionItem>

          {/* Narrative beats */}
          <div className="space-y-8">
            {insightSection.beats.map((beat, i) => (
              <InsightBeat key={beat.label} label={beat.label} text={beat.text} index={i} />
            ))}
          </div>
        </MotionSection>
      </Container>
    </section>
  );
}
