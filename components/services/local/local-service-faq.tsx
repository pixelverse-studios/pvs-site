'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { Container } from '@/components/ui/container';
import { SectionHeader } from '@/components/ui/section-header';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { cn } from '@/lib/utils';
import type { LocalServicePageDefinition } from '@/data/local-service-pages';

interface LocalServiceFaqProps {
  faq: LocalServicePageDefinition['faq'];
  city: string;
  serviceName: string;
}

export function LocalServiceFaq({ faq, city, serviceName }: LocalServiceFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-[var(--pv-bg)] py-16 md:py-24">
      <Container className="max-w-3xl">
        <MotionSection as="div" className="space-y-10">
          <MotionItem>
            <SectionHeader
              align="center"
              eyebrow="FAQ"
              title={`${serviceName} in ${city}`}
              description={`Common questions about our ${(serviceName || 'digital marketing').toLowerCase()} services for ${city} businesses.`}
              className="mx-auto max-w-2xl"
            />
          </MotionItem>
          <MotionItem delay={0.08}>
            <div className="divide-y divide-[var(--pv-border)] rounded-pv border border-[var(--pv-border)]">
              {faq.map((item, index) => (
                <div key={item.question} className="overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[var(--pv-surface)]/50"
                    aria-expanded={openIndex === index}
                  >
                    <span className="font-medium text-[var(--pv-text)]">{item.question}</span>
                    <ChevronDown
                      className={cn(
                        'h-5 w-5 shrink-0 text-[var(--pv-text-muted)] transition-transform duration-200',
                        openIndex === index && 'rotate-180'
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'grid transition-[grid-template-rows] duration-200',
                      openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-[var(--pv-text-muted)]">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
