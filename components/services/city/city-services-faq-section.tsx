import { CityServicePageDefinition } from '@/data/services-city-pages';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { SectionHeader } from '@/components/ui/section-header';

interface CityServicesFaqSectionProps {
  city: string;
  faq: CityServicePageDefinition['faq'];
}

export function CityServicesFaqSection({ city, faq }: CityServicesFaqSectionProps) {
  if (!faq.length) {
    return null;
  }

  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-10">
        <MotionItem>
          <SectionHeader
            align="center"
            eyebrow={`${city} FAQs`}
            title={`Questions ${city} teams ask before we launch`}
            description="Transparent answers on process, localization, and analytics so you know how the engagement runs before we ever share a proposal."
            className="mx-auto max-w-3xl"
          />
        </MotionItem>
        <MotionSection as="div" delay={0.08}>
          <Accordion
            type="single"
            collapsible
            className="divide-y divide-[var(--pv-border)] rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)]/95 dark:bg-[var(--pv-surface)]/90"
          >
            {faq.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index + 1}`}>
                <AccordionTrigger className="px-6 py-5 text-left text-base font-semibold text-[var(--pv-text)]">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-sm leading-7 text-[var(--pv-text-muted)]">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </MotionSection>
      </Container>
    </section>
  );
}
