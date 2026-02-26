import type { LucideIcon } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { SectionHeader } from '@/components/ui/section-header';

export interface ServiceExpectationItem {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export interface ServiceExpectationsProps {
  eyebrow?: string;
  heading: string;
  description?: string;
  expectations: ServiceExpectationItem[];
}

export function ServiceExpectations({
  eyebrow,
  heading,
  description,
  expectations,
}: ServiceExpectationsProps) {
  if (!expectations.length) return null;

  const headingId = eyebrow
    ? `expectations-${eyebrow.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    : 'expectations-heading';

  return (
    <section className="bg-[var(--pv-surface)] py-16 md:py-24" aria-labelledby={headingId}>
      <Container className="space-y-12">
        <MotionItem>
          <SectionHeader
            align="center"
            eyebrow={eyebrow}
            title={heading}
            description={description}
            className="mx-auto max-w-2xl"
          />
        </MotionItem>

        <MotionSection as="div" className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {expectations.map(({ title: cardTitle, description: cardDesc, icon: Icon }, index) => (
            <MotionItem
              key={cardTitle}
              delay={index * 0.08}
              triggerOnViewport={false}
              className="h-full"
            >
              <Card className="group flex h-full flex-col overflow-hidden bg-[var(--pv-bg)]/90 transition-all duration-300 dark:bg-[var(--pv-surface)]/90 hover:-translate-y-1 hover:border-[var(--pv-primary)]/50 hover:shadow-[0_8px_24px_-12px_rgba(63,0,233,0.25)]">
                <CardHeader>
                  {Icon && (
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_12px_28px_-18px_rgba(63,0,233,0.8)] transition-transform duration-300 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                  )}
                  <CardTitle className="text-[var(--pv-text)]">{cardTitle}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="leading-6">{cardDesc}</CardDescription>
                </CardContent>
              </Card>
            </MotionItem>
          ))}
        </MotionSection>
      </Container>
    </section>
  );
}
