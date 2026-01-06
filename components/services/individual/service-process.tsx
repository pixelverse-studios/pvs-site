'use client';

import * as React from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

const processCardVariants: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.9, rotateX: -10 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.8,
      delay: index * 0.12,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  hover: {
    y: -12,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.8, 0.25, 1],
    },
  },
};

export interface ProcessStep {
  /** Step number (displayed as badge) */
  number: number;
  /** Step title */
  title: string;
  /** Step description */
  description: string;
}

export interface ServiceProcessProps {
  /** Optional eyebrow text above the heading */
  eyebrow?: string;
  /** Main section heading */
  heading: string;
  /** Array of process steps */
  steps: ProcessStep[];
}

interface ProcessCardProps {
  step: ProcessStep;
  index: number;
}

function ProcessCard({ step, index }: ProcessCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-15% 0px' });

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      variants={processCardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      whileHover="hover"
      className="bg-[var(--pv-surface)]/70 dark:bg-[var(--pv-bg)]/60 group cursor-default rounded-pv border border-[var(--pv-primary)] p-6 text-center shadow-[0_18px_40px_-36px_rgba(63,0,233,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(63,0,233,0.75)]"
    >
      <span className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-sm font-semibold text-white shadow-[0_12px_24px_-12px_rgba(63,0,233,0.8)]">
        {step.number}
      </span>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{step.title}</h3>
        <p className="text-sm text-[var(--pv-text-muted)]">{step.description}</p>
      </div>
    </motion.div>
  );
}

export function ServiceProcess({ eyebrow, heading, steps }: ServiceProcessProps) {
  // Generate step labels like "1 → 2 → 3 → 4"
  const stepLabels = steps.map((s) => s.number).join(' → ');

  return (
    <section className="py-16 md:py-24">
      <Container>
        <MotionSection
          as="div"
          className="relative overflow-hidden rounded-pv-lg border border-[var(--pv-border)] bg-[linear-gradient(135deg,rgba(63,0,233,0.08),rgba(201,71,255,0.06))] p-[1px]"
        >
          <MotionItem
            triggerOnViewport={false}
            className="bg-[var(--pv-bg)]/90 dark:bg-[var(--pv-surface)]/90 rounded-[inherit] p-8 shadow-[0_40px_90px_-60px_rgba(63,0,233,0.65)] backdrop-blur-sm"
          >
            <MotionSection as="div" className="flex flex-col items-center gap-4 text-center">
              <MotionItem triggerOnViewport={false}>
                <span className="text-sm uppercase tracking-[0.3em] text-[var(--pv-text-muted)]">
                  {eyebrow ?? stepLabels}
                </span>
              </MotionItem>
              <MotionItem triggerOnViewport={false} delay={0.08}>
                <h2 className="max-w-2xl text-3xl font-semibold md:text-4xl">{heading}</h2>
              </MotionItem>
            </MotionSection>
            <MotionSection
              as="div"
              className={`mt-10 grid gap-6 ${steps.length === 4 ? 'md:grid-cols-4' : steps.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}
              delay={0.12}
            >
              {steps.map((step, index) => (
                <ProcessCard key={step.title} step={step} index={index} />
              ))}
            </MotionSection>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
