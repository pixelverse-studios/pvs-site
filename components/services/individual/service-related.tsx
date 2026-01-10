import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

import { Container } from '@/components/ui/container';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { cn } from '@/lib/utils';

export interface RelatedService {
  /** Service title */
  title: string;
  /** Brief description */
  description: string;
  /** Link to the service page */
  href: string;
  /** Optional icon */
  icon?: LucideIcon;
}

export interface ServiceRelatedProps {
  /** Optional section heading (default: "Related Services") */
  heading?: string;
  /** Optional description below the heading */
  description?: string;
  /** Array of related services */
  services: RelatedService[];
  /** Number of columns (default: based on service count) */
  columns?: 2 | 3 | 4;
}

export function ServiceRelated({
  heading = 'Related Services',
  description,
  services,
  columns,
}: ServiceRelatedProps) {
  if (services.length === 0) {
    return null;
  }

  // Default columns based on service count
  const gridCols = columns ?? (services.length <= 2 ? 2 : services.length === 3 ? 3 : 3);

  const columnClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className="bg-[var(--pv-surface)] py-16 md:py-24">
      <Container className="space-y-10">
        <MotionSection as="div" className="space-y-10">
          <MotionItem>
            <SectionHeader
              align="center"
              title={heading}
              description={description}
              className="mx-auto max-w-2xl"
            />
          </MotionItem>
          <MotionSection
            as="div"
            className={cn('grid gap-6', columnClasses[gridCols])}
            delay={0.08}
          >
            {services.map(({ icon: Icon, title, description: serviceDesc, href }, index) => (
              <MotionItem key={title} delay={index * 0.08} triggerOnViewport={false}>
                <Link href={href} className="block h-full">
                  <Card className="border-[var(--pv-border)]/80 group flex h-full flex-col overflow-hidden border bg-[var(--pv-bg)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)] hover:shadow-[0_24px_50px_-36px_rgba(63,0,233,0.6)]">
                    <CardHeader className="flex flex-row items-start gap-4 pb-2">
                      {Icon && (
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-primary)] transition-all duration-300 group-hover:border-[var(--pv-primary)] group-hover:bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] group-hover:text-white">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                      <CardTitle className="text-lg font-semibold text-[var(--pv-text)] transition-colors duration-300 group-hover:text-[var(--pv-primary)]">
                        {title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm leading-6 text-[var(--pv-text-muted)]">
                        {serviceDesc}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </MotionItem>
            ))}
          </MotionSection>
        </MotionSection>
      </Container>
    </section>
  );
}
