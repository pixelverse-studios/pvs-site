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
      initial={{ opacity: 0, x: -8 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative flex gap-5"
    >
      {/* Node dot — aligned to the label baseline */}
      <div className="relative flex shrink-0 flex-col items-center pt-[3px]">
        <motion.div
          className="h-2.5 w-2.5 rounded-full shadow-[0_0_0_3px_var(--pv-bg),0_0_0_4px_var(--pv-border)]"
          style={{
            background: `color-mix(in srgb, var(--pv-primary) ${(1 - gradientProgress) * 100}%, var(--pv-primary-2))`,
          }}
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.15 }}
        />
      </div>

      {/* Content */}
      <div className={isLast ? '' : 'pb-0'}>
        <p
          className="mb-1.5 text-xs font-semibold uppercase tracking-[0.15em]"
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
    </motion.div>
  );
}

export function InsightSection() {
  const beatsRef = useRef<HTMLDivElement>(null);
  const beatsInView = useInView(beatsRef, { once: true, amount: 0.1 });

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

          {/* Right: Beats with continuous vertical line */}
          <div className="lg:w-2/3" ref={beatsRef}>
            <div className="relative space-y-8">
              {/* Single continuous gradient line behind all beats */}
              <motion.div
                className="absolute left-[4.5px] top-[3px] bottom-[3px] w-px"
                style={{ background: 'var(--pv-gradient)' }}
                initial={{ scaleY: 0 }}
                animate={beatsInView ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                aria-hidden
              />

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
