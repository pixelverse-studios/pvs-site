import { Container } from '@/components/ui/container';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { faqContent } from '@/data/faq-content';

export function FaqListSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-4xl">
        <MotionSection as="div" className="space-y-10">
          {faqContent.map((category, categoryIndex) => (
            <MotionItem key={category.category} delay={categoryIndex * 0.08}>
              <div className="space-y-4">
                {/* Category heading */}
                <div className="flex items-center gap-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
                    {category.category}
                  </p>
                  <div className="h-px flex-1 bg-[var(--pv-border)]" />
                </div>

                {/* Category accordion */}
                <div className="rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)]/90 shadow-pv dark:bg-[var(--pv-surface)]/85">
                  <Accordion type="single" collapsible>
                    {category.items.map((faq, itemIndex) => (
                      <AccordionItem
                        key={faq.question}
                        value={`${categoryIndex}-${itemIndex}`}
                      >
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
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
