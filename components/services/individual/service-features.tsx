import type { LucideIcon } from 'lucide-react';

import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { cn } from '@/lib/utils';

export interface ServiceFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ServiceFeaturesProps {
  /** Optional eyebrow label above the heading */
  eyebrow?: string;
  /** Main section heading */
  heading: string;
  /** Optional description below the heading */
  description?: string;
  /** Array of feature items to display */
  features: ServiceFeature[];
  /** Number of columns in the grid (default: 3) */
  columns?: 2 | 3 | 4;
}

const columnClasses = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
};

export function ServiceFeatures({
  eyebrow,
  heading,
  description,
  features,
  columns = 3,
}: ServiceFeaturesProps) {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-12">
        <MotionSection className="space-y-12" as="div">
          <MotionItem>
            <SectionHeader
              align="center"
              eyebrow={eyebrow}
              title={heading}
              description={description}
              className="mx-auto max-w-3xl"
            />
          </MotionItem>
          <MotionSection as="div" className={cn('grid gap-6', columnClasses[columns])} delay={0.12}>
            {features.map(({ icon: Icon, title, description: featureDesc }, index) => (
              <MotionItem
                key={title}
                delay={index * 0.08}
                triggerOnViewport={false}
                className="h-full"
              >
                <Card className="border-[var(--pv-border)]/80 bg-[var(--pv-bg)]/90 dark:bg-[var(--pv-surface)]/90 group flex h-full flex-col overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)] hover:shadow-[0_24px_50px_-36px_rgba(63,0,233,0.75)]">
                  <CardHeader className="flex flex-row items-start gap-4 pb-4">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_18px_38px_-28px_rgba(63,0,233,0.9)] transition-transform duration-300 group-hover:-translate-y-1">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <div className="flex-1 space-y-2">
                      <CardTitle className="text-xl font-semibold text-[var(--pv-text)]">
                        {title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-base leading-7 text-[var(--pv-text-muted)]">
                      {featureDesc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </MotionItem>
            ))}
          </MotionSection>
        </MotionSection>
      </Container>
    </section>
  );
}
