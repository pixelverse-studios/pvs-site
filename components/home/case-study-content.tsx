'use client';

import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Eye,
  ExternalLink,
  FileText,
  LayoutGrid,
  MapPin,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import type { CaseStudy } from '@/data/case-studies';

const iconMap: Record<string, LucideIcon> = {
  alertCircle: AlertCircle,
  eye: Eye,
  fileText: FileText,
  layoutGrid: LayoutGrid,
  zap: Zap,
};

const ITEM_STAGGER_INCREMENT = 0.08;

interface CaseStudyContentProps {
  study: CaseStudy;
  animationKey: number;
}

export function CaseStudyContent({ study, animationKey }: CaseStudyContentProps) {
  const siteHref = study.url || study.demoUrl;
  const siteLabel = study.demoUrl && !study.url ? 'View demo site' : 'Visit website';

  return (
    <MotionSection as="div" className="space-y-12" key={animationKey}>
      {/* Title + Client details + Problem */}
      <MotionItem className="space-y-6">
        <h2
          id="case-study-heading"
          className="max-w-3xl font-heading text-3xl leading-tight text-[var(--pv-text)] sm:text-4xl lg:text-[2.5rem] lg:leading-[3.125rem]"
        >
          {study.title}
        </h2>

        {/* Client details — floating tags with icon bubbles */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] shadow-sm">
              <Building2 className="h-3.5 w-3.5 text-[var(--pv-primary)]" aria-hidden />
            </span>
            <span className="font-medium text-[var(--pv-text)]">{study.name}</span>
          </span>

          <span className="inline-flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] shadow-sm">
              <Wrench className="h-3.5 w-3.5 text-[var(--pv-primary)]" aria-hidden />
            </span>
            <span className="text-[var(--pv-text-muted)]">{study.industry}</span>
          </span>

          <span className="inline-flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] shadow-sm">
              <MapPin className="h-3.5 w-3.5 text-[var(--pv-primary)]" aria-hidden />
            </span>
            <span className="text-[var(--pv-text-muted)]">{study.location}</span>
          </span>
        </div>

        <p className="max-w-3xl text-lg leading-relaxed text-[var(--pv-text-muted)]">
          {study.problem}
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link
            href={`/portfolio/${study.slug}`}
            aria-label={`Read ${study.name} case study`}
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-[var(--pv-primary)] transition-colors hover:text-pv-primary2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-surface)]"
          >
            Read case study
            <ArrowRight
              className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>

          {siteHref && (
            <a
              href={siteHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${siteLabel} for ${study.name} (opens in new tab)`}
              className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-surface)]"
            >
              {siteLabel}
              <ExternalLink
                className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          )}
        </div>
      </MotionItem>

      {/* Issues grid */}
      <MotionSection
        as="div"
        className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-5 xl:gap-6"
        delay={0.1}
      >
        {study.issues.map((item, index) => {
          const IconComponent = iconMap[item.icon ?? ''];
          if (!IconComponent && process.env.NODE_ENV === 'development') {
            console.warn(`Missing icon mapping for "${item.icon}". Add to iconMap.`);
          }
          const Icon = IconComponent || AlertCircle;

          return (
            <MotionItem
              key={`${study.name}-${item.issue}`}
              delay={index * ITEM_STAGGER_INCREMENT}
            >
              <Card className="group flex h-full flex-col border-[var(--pv-border)] bg-[var(--pv-bg)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-pv">
                <CardHeader className="flex flex-col gap-4 pb-4">
                  <div className="flex items-start gap-3 sm:flex-col xl:flex-row">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-primary)] shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <CardTitle className="text-lg leading-snug text-[var(--pv-text)]">
                      {item.issue}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-3 pt-0">
                  <span
                    className="text-xs font-semibold uppercase tracking-wider text-[var(--pv-primary)]"
                    aria-hidden
                  >
                    What we did
                  </span>
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
        <div className="rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:gap-10">
            <div className="space-y-2 xl:max-w-sm xl:shrink-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
                Result
              </p>
              <p className="font-heading text-2xl font-semibold leading-tight text-[var(--pv-text)] sm:text-3xl">
                {study.outcome.metric}
              </p>
            </div>

            <div className="hidden h-16 w-px bg-[var(--pv-border)] xl:block" aria-hidden />
            <div className="h-px w-full bg-[var(--pv-border)] xl:hidden" aria-hidden />

            <p className="max-w-3xl text-base leading-relaxed text-[var(--pv-text-muted)] sm:text-lg">
              {study.outcome.description}
            </p>
          </div>
        </div>
      </MotionItem>
    </MotionSection>
  );
}
