'use client';

import { Container } from '@/components/ui/container';
import { SectionHeader } from '@/components/ui/section-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { StructuredData } from '@/components/ui/structured-data';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ServiceFAQProps {
  /** Optional section heading (default: "Frequently Asked Questions") */
  heading?: string;
  /** Optional description below the heading */
  description?: string;
  /** Array of FAQ items */
  faqs: FAQItem[];
  /** Whether to generate FAQPage JSON-LD schema (default: true) */
  generateSchema?: boolean;
  /** Optional ID for the schema script element */
  schemaId?: string;
}

export function ServiceFAQ({
  heading = 'Frequently Asked Questions',
  description,
  faqs,
  generateSchema = true,
  schemaId,
}: ServiceFAQProps) {
  if (faqs.length === 0) {
    return null;
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-16 md:py-24">
      {generateSchema && <StructuredData id={schemaId ?? 'service-faq-schema'} data={faqSchema} />}
      <Container className="max-w-4xl space-y-10">
        <MotionSection as="div" className="space-y-10">
          <MotionItem>
            <SectionHeader
              align="center"
              title={heading}
              description={description}
              className="mx-auto max-w-2xl"
            />
          </MotionItem>
          <MotionItem delay={0.08}>
            <div className="bg-[var(--pv-bg)]/90 dark:bg-[var(--pv-surface)]/85 rounded-pv border border-[var(--pv-border)] shadow-pv">
              <Accordion type="single" collapsible className="divide-y divide-[var(--pv-border)]">
                {faqs.map((faq, index) => (
                  <MotionItem key={faq.question} delay={index * 0.04} triggerOnViewport={false}>
                    <AccordionItem value={`faq-${index + 1}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  </MotionItem>
                ))}
              </Accordion>
            </div>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
