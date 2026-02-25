import Link from 'next/link';
import { MoveRight } from 'lucide-react';

import { Container } from '@/components/ui/container';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import type { FaqItem } from '@/data/faq-types';

export interface FaqSection {
  heading: string;
  items: FaqItem[];
}

interface FaqListSectionProps {
  sections: FaqSection[];
}

export function FaqListSection({ sections }: FaqListSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-4xl">
        <MotionSection as="div" className="space-y-10">
          {sections.map((section, sectionIndex) => (
            <MotionItem key={section.heading} delay={sectionIndex * 0.08}>
              <div className="space-y-4">
                {/* Section heading */}
                <div className="flex items-center gap-4">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
                    {section.heading}
                  </h2>
                  <div className="h-px flex-1 bg-[var(--pv-border)]" />
                </div>

                {/* Section accordion */}
                <div className="rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)]/90 shadow-pv dark:bg-[var(--pv-surface)]/85">
                  <Accordion type="single" collapsible>
                    {section.items.map((faq, itemIndex) => (
                      <AccordionItem
                        key={faq.question}
                        value={`faq-${sectionIndex}-${itemIndex}`}
                      >
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>
                          <p>{faq.answer}</p>
                          {faq.link && (
                            <Link
                              href={faq.link.href}
                              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--pv-primary)] hover:underline"
                            >
                              {faq.link.label}
                              <MoveRight className="h-3.5 w-3.5" />
                            </Link>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </MotionItem>
          ))}
        </MotionSection>
      </Container>
    </section>
  );
}
