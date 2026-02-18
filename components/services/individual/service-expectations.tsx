import type { LucideIcon } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { SectionHeader } from '@/components/ui/section-header';

export interface ServiceExpectationItem {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export interface ServiceExpectationsProps {
  eyebrow: string;
  title: string;
  description?: string;
  expectations: ServiceExpectationItem[];
}

export function ServiceExpectations({
  eyebrow,
  title,
  description,
  expectations,
}: ServiceExpectationsProps) {
  if (!expectations.length) return null;

  return (
    <section className="bg-[var(--pv-surface)] py-16 md:py-24">
      <Container className="space-y-12">
        <MotionSection as="div">
          <MotionItem>
            <SectionHeader
              align="center"
              eyebrow={eyebrow}
              title={title}
              description={description}
              className="mx-auto max-w-2xl"
            />
          </MotionItem>
        </MotionSection>

        <MotionSection as="div" className="grid grid-cols-1 gap-6 sm:grid-cols-2" delay={0.12}>
          {expectations.map(({ title: cardTitle, description: cardDesc, icon: Icon }, index) => (
            <MotionItem
              key={cardTitle}
              delay={index * 0.08}
              triggerOnViewport={false}
              className="h-full"
            >
              <Card className="group flex h-full flex-col gap-4 overflow-hidden bg-[var(--pv-bg)]/90 p-6 transition-all duration-300 dark:bg-[var(--pv-surface)]/90 hover:-translate-y-1 hover:border-[var(--pv-primary)]/50 hover:shadow-[0_8px_24px_-12px_rgba(63,0,233,0.25)]">
                {Icon && (
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_12px_28px_-18px_rgba(63,0,233,0.8)] transition-transform duration-300 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                )}
                <div className="space-y-2">
                  <h3 className="font-semibold text-[var(--pv-text)]">{cardTitle}</h3>
                  <p className="text-sm leading-6 text-[var(--pv-text-muted)]">{cardDesc}</p>
                </div>
              </Card>
            </MotionItem>
          ))}
        </MotionSection>
      </Container>
    </section>
  );
}
