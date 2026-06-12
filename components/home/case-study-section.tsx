'use client';

import { useRef, useState } from 'react';

import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Box, Building2, Heart, Wrench } from 'lucide-react';

import { caseStudies } from '@/data/homepage';

import { CaseStudyContent } from './case-study-content';
import { Container } from './container';

const industryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Home Services': Wrench,
  'Home Healthcare': Heart,
  'Productivity SaaS': Box,
};

export function CaseStudySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isHeaderCompactRef = useRef(false);
  const study = caseStudies[activeIndex];
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 128px', 'start 48px'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const shouldCompact = latest > 0.45;
    if (isHeaderCompactRef.current !== shouldCompact) {
      isHeaderCompactRef.current = shouldCompact;
      setIsHeaderCompact(shouldCompact);
    }
  });

  if (!study) return null;

  return (
    <section
      ref={sectionRef}
      className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)]"
      aria-labelledby="case-study-heading"
    >
      <Container className="py-16 md:py-24">
        <div className="space-y-12">
          {/* Eyebrow */}
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 85, damping: 22 }}
            className={`top-44 z-20 flex flex-col gap-4 bg-[var(--pv-surface)]/95 py-3 backdrop-blur-sm sm:items-start xl:sticky ${
              isHeaderCompact ? 'xl:w-72 xl:gap-3' : 'xl:w-full xl:flex-row xl:items-center'
            }`}
          >
            <motion.p
              layout
              className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]"
            >
              Case Study
            </motion.p>
            <motion.div
              layout
              aria-hidden="true"
              className={`hidden h-px origin-left bg-[var(--pv-border)] sm:block ${
                isHeaderCompact ? 'xl:w-14 xl:flex-none' : 'xl:flex-1'
              }`}
              transition={{ type: 'spring', stiffness: 90, damping: 24 }}
            />
            <Link
              href="/portfolio"
              className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-surface)]"
            >
              View full portfolio
              <ArrowRight
                className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </motion.div>

          {/* Sidebar selector + content */}
          <div className="flex flex-col items-start gap-8 xl:flex-row xl:gap-12">
            {/* Left: Vertical card selector */}
            {caseStudies.length > 1 && (
              <div
                className="flex w-full gap-3 overflow-x-auto xl:sticky xl:top-72 xl:w-72 xl:shrink-0 xl:flex-col xl:gap-2 xl:self-start xl:overflow-visible"
                role="tablist"
                aria-label="Case studies"
              >
                {caseStudies.map((cs, index) => {
                  const isActive = activeIndex === index;
                  const IndustryIcon = industryIconMap[cs.industry] || Building2;

                  return (
                    <button
                      key={cs.name}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls="case-study-panel"
                      onClick={() => setActiveIndex(index)}
                      className={`relative flex shrink-0 items-center gap-4 rounded-xl p-4 text-left transition-all duration-300 ${
                        isActive
                          ? 'bg-[var(--pv-bg)] shadow-md'
                          : 'bg-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      {/* Sliding gradient left border */}
                      {isActive && (
                        <motion.div
                          layoutId="caseStudySidebarBorder"
                          className="absolute bottom-3 left-0 top-3 w-[3px] rounded-full bg-[image:var(--pv-gradient)]"
                          transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                        />
                      )}

                      {/* Industry icon */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                          isActive
                            ? 'bg-[image:var(--pv-gradient)] text-white shadow-[0_4px_12px_-4px_rgba(63,0,233,0.4)]'
                            : 'border border-[var(--pv-border)] text-[var(--pv-text-muted)]'
                        }`}
                      >
                        <IndustryIcon className="h-4.5 w-4.5" aria-hidden />
                      </div>

                      {/* Client info */}
                      <div className="min-w-0 pl-1">
                        <p
                          className={`text-sm font-semibold transition-colors duration-200 ${
                            isActive ? 'text-[var(--pv-text)]' : 'text-[var(--pv-text-muted)]'
                          }`}
                        >
                          {cs.name}
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--pv-text-muted)]">
                          {cs.industry} &middot; {cs.location}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Right: Content panel */}
            <div
              id="case-study-panel"
              role="tabpanel"
              className="min-w-0 flex-1"
              key={activeIndex}
            >
              <CaseStudyContent study={study} animationKey={activeIndex} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
