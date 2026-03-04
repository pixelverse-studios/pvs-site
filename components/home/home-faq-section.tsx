import Link from 'next/link';

import { ArrowRight, MoveRight } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { homepageFaq } from '@/data/homepage-faq';

export function HomeFaqSection() {
  return (
    <section className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)]/40">
      <Container className="py-16 md:py-24">
        <MotionSection as="div" className="mx-auto max-w-4xl space-y-10">
          <MotionItem>
            <div className="mx-auto max-w-2xl space-y-4 text-center">
              <span className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-1 text-xs uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
                Common Questions
              </span>
              <h2
                id="home-faq-heading"
                className="text-balance font-heading text-[2.25rem] leading-[2.75rem] tracking-tight md:text-[2.5rem] md:leading-[3rem]"
              >
                Questions we get asked most
              </h2>
              <p className="text-lg text-[var(--pv-text-muted)]">
                If you&apos;re evaluating whether PixelVerse is the right fit, these usually cover it.
              </p>
            </div>
          </MotionItem>

          <MotionItem delay={0.1}>
            <div className="rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)]/90 shadow-pv dark:bg-[var(--pv-surface)]/85">
              <Accordion type="single" collapsible>
                {homepageFaq.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`home-faq-${index}`}>
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
          </MotionItem>

          <MotionItem delay={0.16}>
            <div className="text-center">
              <Link
                href="/faq"
                className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--pv-text-muted)] transition-colors duration-200 hover:text-[var(--pv-primary)]"
              >
                See all frequently asked questions
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
