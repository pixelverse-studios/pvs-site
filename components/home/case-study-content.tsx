'use client';

import {
  AlertCircle,
  ChevronDown,
  Building2,
  FileText,
  MapPin,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import type { CaseStudy } from '@/data/homepage';

const iconMap: Record<string, LucideIcon> = {
  alertCircle: AlertCircle,
  zap: Zap,
  fileText: FileText,
};

const ITEM_STAGGER_INCREMENT = 0.08;

interface CaseStudyContentProps {
  study: CaseStudy;
  animationKey: number;
}

export function CaseStudyContent({ study, animationKey }: CaseStudyContentProps) {
  return (
    <MotionSection as="div" className="space-y-12" key={animationKey}>
      {/* Title + Client details + Problem */}
      <MotionItem className="space-y-6">
        <h2
          id="case-study-heading"
          className="max-w-3xl font-heading text-[2.5rem] leading-[3.125rem] text-[var(--pv-text)]"
        >
          {study.title}
        </h2>

        {/* Client details — floating tags with icon bubbles */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] shadow-sm">
              <Building2 className="h-3.5 w-3.5 text-[var(--pv-primary)]" aria-hidden />
            </span>
            <span className="font-medium text-[var(--pv-text)]">{study.client.name}</span>
          </span>

          <span className="inline-flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] shadow-sm">
              <Wrench className="h-3.5 w-3.5 text-[var(--pv-primary)]" aria-hidden />
            </span>
            <span className="text-[var(--pv-text-muted)]">{study.client.industry}</span>
          </span>

          <span className="inline-flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] shadow-sm">
              <MapPin className="h-3.5 w-3.5 text-[var(--pv-primary)]" aria-hidden />
            </span>
            <span className="text-[var(--pv-text-muted)]">{study.client.location}</span>
          </span>
        </div>

        <p className="max-w-3xl text-lg leading-relaxed text-[var(--pv-text-muted)]">
          {study.problem}
        </p>
      </MotionItem>

      {/* Issues grid */}
      <MotionSection as="div" className="grid gap-6 md:grid-cols-3" delay={0.1}>
        {study.issues.map((item, index) => {
          const IconComponent = iconMap[item.icon ?? ''];
          if (!IconComponent && process.env.NODE_ENV === 'development') {
            console.warn(`Missing icon mapping for "${item.icon}". Add to iconMap.`);
          }
          const Icon = IconComponent || AlertCircle;

          return (
            <MotionItem
              key={`${study.client.name}-${item.issue}`}
              delay={index * ITEM_STAGGER_INCREMENT}
            >
              <Card className="group flex h-full flex-col border-[var(--pv-border)] bg-[var(--pv-bg)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-pv">
                <CardHeader className="flex flex-col gap-4 pb-4">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-primary)] shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <CardTitle className="text-lg text-[var(--pv-text)]">{item.issue}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-3 pt-0">
                  <div
                    className="flex flex-col items-start gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--pv-primary)]"
                    aria-hidden
                  >
                    <span>What we did</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </div>
                  <CardDescription className="leading-relaxed text-[var(--pv-text-muted)]">
                    {item.resolution}
                  </CardDescription>
                </CardContent>
              </Card>
            </MotionItem>
          );
        })}
      </MotionSection>

      {/* Outcome */}
      <MotionItem delay={0.3}>
        <div className="rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-8 shadow-sm md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
            <div className="shrink-0 space-y-2 md:max-w-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
                Result
              </p>
              <p className="font-heading text-2xl font-semibold leading-tight text-[var(--pv-text)] md:text-3xl">
                {study.outcome.metric}
              </p>
            </div>

            <div className="hidden h-16 w-px bg-[var(--pv-border)] md:block" aria-hidden />
            <div className="h-px w-full bg-[var(--pv-border)] md:hidden" aria-hidden />

            <p className="text-lg leading-relaxed text-[var(--pv-text-muted)]">
              {study.outcome.description}
            </p>
          </div>
        </div>
      </MotionItem>
    </MotionSection>
  );
}
