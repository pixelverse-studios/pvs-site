import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, MapPin } from 'lucide-react';

import { Container } from '@/components/ui/container';
import { SectionHeader } from '@/components/ui/section-header';
import type { CaseStudy } from '@/data/case-studies';
import { cn } from '@/lib/utils';

interface RelatedCaseStudiesProps {
  caseStudies: CaseStudy[];
  title: string;
  eyebrow?: string;
  description?: string;
  background?: 'bg' | 'surface';
}

const tagClass =
  'inline-flex items-center gap-1.5 rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-3 py-1 text-xs font-medium text-[var(--pv-text-muted)]';

/**
 * Crawlable links to specific case studies. Rendered without scroll animation
 * so the links and copy are present in the server HTML for search engines.
 */
export function RelatedCaseStudies({
  caseStudies,
  title,
  eyebrow = 'Client Work',
  description,
  background = 'surface',
}: RelatedCaseStudiesProps) {
  if (caseStudies.length === 0) return null;

  return (
    <section
      className={cn(
        'py-16 md:py-24',
        background === 'surface' ? 'bg-[var(--pv-surface)]' : 'bg-[var(--pv-bg)]',
      )}
    >
      <Container>
        <SectionHeader
          align="center"
          eyebrow={eyebrow}
          title={title}
          description={description}
          className="mx-auto max-w-2xl"
        />
        <ul
          className={cn(
            'mt-12 grid gap-6',
            caseStudies.length === 1
              ? 'mx-auto max-w-xl'
              : caseStudies.length === 2
                ? 'md:grid-cols-2'
                : 'md:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {caseStudies.map((study) => (
            <li key={study.slug}>
              <Link
                href={`/portfolio/${study.slug}`}
                className="group flex h-full flex-col rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-6 transition-all hover:-translate-y-0.5 hover:border-[var(--pv-primary)] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-primary)] focus-visible:ring-offset-2"
              >
                <div className="flex flex-wrap gap-2">
                  <span className={tagClass}>
                    <Building2 className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {study.industry}
                  </span>
                  <span className={tagClass}>
                    <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {study.location}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-xl font-semibold text-[var(--pv-text)] group-hover:text-[var(--pv-primary)]">
                  {study.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--pv-text-muted)]">
                  {study.summary}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--pv-primary)]">
                  Read the {study.name} case study
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
