'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Code2, GaugeCircle, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { SectionHeader } from '@/components/ui/section-header';

interface KeyPoint {
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
  outcome: string;
}

const keyPoints: KeyPoint[] = [
  {
    icon: Code2,
    badge: 'Performance',
    title: 'Custom Code = Control',
    description:
      'Every component is built specifically for your stack—no plugin bloat, no license surprises, just lean builds that stay stable.',
    outcome: 'Launch with Lighthouse performance comfortably in the mid-90s.',
  },
  {
    icon: GaugeCircle,
    badge: 'Conversion',
    title: 'UX Design = Growth',
    description:
      'We map every flow to buyer intent so the experience feels effortless and keeps prospects moving toward the next step.',
    outcome: 'Remove friction points and turn more visits into qualified leads.',
  },
  {
    icon: Sparkles,
    badge: 'Momentum',
    title: 'Combined = Results',
    description:
      'Design and engineering stay in lockstep, so strategy decisions turn into production code without lag or handoff churn.',
    outcome: 'Ship updates in days instead of weeks and keep post-launch momentum.',
  },
];

const cardVariants: Variants = {
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

interface WhyCustomCardProps extends KeyPoint {
  index: number;
}

function WhyCustomCard({
  icon: Icon,
  badge,
  title,
  description,
  outcome,
  index,
}: WhyCustomCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-15% 0px' });

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      whileHover="hover"
      className="bg-[var(--pv-bg)]/92 dark:bg-[var(--pv-surface)]/92 group relative isolate flex h-full flex-col justify-between gap-6 overflow-hidden rounded-[1.75rem] border border-[var(--pv-border)] p-8 shadow-[0_35px_60px_-45px_rgba(63,0,233,0.65)] transition-[border-color,transform,box-shadow] duration-500 hover:border-[var(--pv-primary)] hover:shadow-[0_45px_80px_-50px_rgba(63,0,233,0.8)] md:p-10"
    >
      <span className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--pv-primary)/0.2,transparent_65%)]" />
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,var(--pv-primary-2)/0.18,transparent_70%)]" />
      </span>
      <div className="flex items-start justify-between gap-4">
        <span className="bg-[var(--pv-bg)]/90 inline-flex items-center rounded-full border border-[var(--pv-border)] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[var(--pv-text-muted)]">
          {badge}
        </span>
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--pv-gradient)] text-white shadow-[0_18px_35px_-25px_rgba(63,0,233,0.75)] transition-transform duration-500 group-hover:-translate-y-1">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      </div>
      <div className="space-y-3 text-left">
        <h3 className="text-xl font-semibold tracking-tight text-[var(--pv-text)]">{title}</h3>
        <p className="text-sm leading-6 text-[var(--pv-text-muted)]">{description}</p>
      </div>
      <div className="space-y-2 border-t border-[var(--pv-border)] pt-4">
        <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--pv-text)]">
          Outcome
        </h4>
        <p className="text-sm font-medium leading-6 text-[var(--pv-text-muted)]">{outcome}</p>
      </div>
    </motion.div>
  );
}

export function WhyCustomSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-12 text-center">
        <MotionSection as="div" className="space-y-12">
          <MotionItem>
            <SectionHeader
              eyebrow="Why Custom Code & UX First"
              title="The difference between checking the box and building a growth engine"
              description={
                <>
                  <p className="text-lg text-[var(--pv-text-muted)]">
                    Website builders and templates can get you online fast, but they often come with
                    hidden problems — slow speeds, limited flexibility, and a poor user experience.
                  </p>
                  <p className="text-lg text-[var(--pv-text-muted)]">
                    We solve that by building every site from scratch. Our UX-first approach ensures
                    your website isn’t just pretty — it’s practical, intuitive, and
                    conversion-ready.
                  </p>
                </>
              }
              align="center"
              className="mx-auto max-w-3xl space-y-6"
            />
          </MotionItem>
          <MotionItem>
            <div className="grid gap-6 text-left md:grid-cols-3">
              {keyPoints.map((card, index) => (
                <WhyCustomCard key={card.title} index={index} {...card} />
              ))}
            </div>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
