'use client';

import { useRef } from 'react';

import { motion, useInView } from 'framer-motion';

import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { insightSection } from '@/data/homepage';

import { Container } from './container';

const BEAT_COUNT = insightSection.beats.length;

function InsightBeat({ label, text, index }: { label: string; text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const isLast = index === BEAT_COUNT - 1;

  const gradientProgress = index / (BEAT_COUNT - 1);
  const labelColor = gradientProgress < 0.5 ? 'var(--pv-primary)' : 'var(--pv-primary-2)';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative"
    >
      {/* Top accent pip */}
      <motion.div
        className="absolute left-0 top-0 w-1 rounded-full"
        style={{ background: 'var(--pv-gradient)' }}
        initial={{ height: 0 }}
        animate={isInView ? { height: 12 } : { height: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      />

      <div className="pl-6 pt-1">
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: labelColor }}
        >
          {label}
        </p>

        <p
          className={`text-[1.0625rem] leading-[1.85] md:text-lg md:leading-[1.85] ${
            isLast ? 'font-semibold text-[var(--pv-text)]' : 'text-[var(--pv-text-muted)]'
          }`}
        >
          {text}
        </p>
      </div>

      {/* Dashed connector to next beat */}
      {!isLast && (
        <motion.div
          className="absolute left-[5px] top-full w-px border-l border-dashed border-[var(--pv-border)]"
          initial={{ height: 0 }}
          animate={isInView ? { height: 40 } : { height: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
        />
      )}
    </motion.div>
  );
}

export function InsightSectionVariantB() {
  return (
    <section
      className="border-b border-[var(--pv-border)] bg-[var(--pv-bg)]"
      aria-labelledby="insight-heading"
    >
      <Container className="py-20 md:py-28">
        <div className="lg:flex lg:gap-16">
          {/* Left: Sticky heading */}
          <div className="mb-12 lg:sticky lg:top-24 lg:mb-0 lg:h-fit lg:w-1/3">
            <MotionSection as="div">
              <MotionItem>
                <div
                  className="mb-8 h-1 w-12 rounded-full"
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
            </MotionSection>
          </div>

          {/* Right: Beats */}
          <div className="lg:w-2/3">
            <div className="space-y-10">
              {insightSection.beats.map((beat, i) => (
                <InsightBeat key={beat.label} label={beat.label} text={beat.text} index={i} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
