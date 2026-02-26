'use client';

import { useState } from 'react';

import { motion } from 'framer-motion';
import { Box, Building2, Heart, Wrench } from 'lucide-react';

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
  const study = caseStudies[activeIndex];

  if (!study) return null;

  return (
    <section
      className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)]"
      aria-labelledby="case-study-heading"
    >
      <Container className="py-16 md:py-24">
        <div className="space-y-12">
          {/* Eyebrow */}
          <div className="flex items-center gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
              Case Study
            </p>
            <div className="h-px flex-1 bg-[var(--pv-border)]" />
          </div>

          {/* Sidebar selector + content */}
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
            {/* Left: Vertical card selector */}
            {caseStudies.length > 1 && (
              <div
                className="flex gap-3 overflow-x-auto lg:w-72 lg:shrink-0 lg:flex-col lg:gap-2 lg:overflow-visible"
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
                          className="absolute bottom-3 left-0 top-3 w-[3px] rounded-full"
                          style={{ background: 'var(--pv-gradient)' }}
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
