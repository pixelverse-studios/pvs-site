import { AlertCircle, FileText, Zap, type LucideIcon } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { caseStudy } from '@/data/homepage';

import { Container } from './container';

// Map icon string names to Lucide components
// Defined outside component to prevent recreation on every render
const iconMap: Record<string, LucideIcon> = {
  alertCircle: AlertCircle,
  zap: Zap,
  fileText: FileText,
};

// Animation timing constants
const GRID_STAGGER_DELAY = 0.1;
const ITEM_STAGGER_INCREMENT = 0.08;

export function CaseStudySection() {
  return (
    <section
      className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)]"
      aria-labelledby="case-study-heading"
    >
      <Container className="py-16 md:py-24">
        <MotionSection as="div" className="space-y-12">
          {/* Header: Client badge + Problem statement */}
          <MotionItem className="space-y-6">
            {/* Client badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] px-4 py-2 text-sm font-medium text-[var(--pv-text-muted)]">
              <span>{caseStudy.client.name}</span>
              <span className="text-[var(--pv-border)]">•</span>
              <span>{caseStudy.client.industry}</span>
            </div>

            {/* Problem statement */}
            <h2
              id="case-study-heading"
              className="max-w-4xl font-heading text-[2.5rem] leading-[3.125rem] text-[var(--pv-text)]"
            >
              {caseStudy.problem}
            </h2>
          </MotionItem>

          {/* Issues grid */}
          <MotionSection as="div" className="grid gap-6 md:grid-cols-3" delay={GRID_STAGGER_DELAY}>
            {caseStudy.issues.map((item, index) => {
              // Map icon string to Lucide component
              const IconComponent = iconMap[item.icon ?? ''];
              if (!IconComponent && process.env.NODE_ENV === 'development') {
                console.warn(`Missing icon mapping for "${item.icon}". Add to iconMap.`);
              }
              const Icon = IconComponent || AlertCircle;

              return (
                <MotionItem key={item.issue} delay={index * ITEM_STAGGER_INCREMENT}>
                  <Card className="group flex h-full flex-col border-[var(--pv-border)] bg-[var(--pv-bg)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-pv">
                    <CardHeader className="flex flex-col gap-4 pb-6">
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-primary)] shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <CardTitle className="text-xl text-[var(--pv-text)]">
                          {item.issue}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 pt-0">
                      <CardDescription className="leading-relaxed text-[var(--pv-text-muted)]">
                        {item.resolution}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </MotionItem>
              );
            })}
          </MotionSection>
        </MotionSection>
      </Container>
    </section>
  );
}
