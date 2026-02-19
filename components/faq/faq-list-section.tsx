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
  const allItems = faqContent.flatMap((category) => category.items);

  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-4xl">
        <MotionSection
          as="div"
          className="bg-[var(--pv-bg)]/90 dark:bg-[var(--pv-surface)]/85 rounded-pv border border-[var(--pv-border)] shadow-pv"
        >
          <Accordion type="single" collapsible className="divide-y divide-[var(--pv-border)]">
            {allItems.map((faq, index) => (
              <MotionItem key={faq.question} delay={index * 0.04} triggerOnViewport={false}>
                <AccordionItem value={`faq-${index + 1}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              </MotionItem>
            ))}
          </Accordion>
        </MotionSection>
      </Container>
    </section>
  );
}
