import Image from 'next/image';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  ExternalLink,
  Eye,
  FileText,
  LayoutGrid,
  MapPin,
  Quote,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import type { CaseStudy } from '@/data/case-studies';

const iconMap: Record<string, LucideIcon> = {
  alertCircle: AlertCircle,
  eye: Eye,
  fileText: FileText,
  layoutGrid: LayoutGrid,
  zap: Zap,
};

interface CaseStudyDetailProps {
  study: CaseStudy;
  nextStudy: CaseStudy | null;
}

export function CaseStudyDetail({ study, nextStudy }: CaseStudyDetailProps) {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-[var(--pv-surface)] pb-0 pt-hero">
        <Container className="max-w-4xl space-y-8 pb-12">
          <MotionSection as="div" className="space-y-8">
            {/* Breadcrumb */}
            <MotionItem>
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-sm text-[var(--pv-text-muted)]">
                  <li>
                    <Link href="/" className="transition-colors hover:text-[var(--pv-text)]">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link
                      href="/portfolio"
                      className="transition-colors hover:text-[var(--pv-text)]"
                    >
                      Portfolio
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="text-[var(--pv-text)]" aria-current="page">
                    {study.name}
                  </li>
                </ol>
              </nav>
            </MotionItem>

            {/* Eyebrow */}
            <MotionItem delay={0.04}>
              <span className="inline-flex items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] px-4 py-1 text-xs uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
                Case Study
              </span>
            </MotionItem>

            {/* Title */}
            <MotionItem delay={0.08}>
              <h1 className="font-heading text-3xl font-semibold leading-tight text-[var(--pv-text)] md:text-4xl lg:text-5xl">
                {study.title}
              </h1>
            </MotionItem>

            {/* Client info tags */}
            <MotionItem delay={0.12}>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] shadow-sm">
                    <Building2 className="h-3.5 w-3.5 text-[var(--pv-primary)]" aria-hidden="true" />
                  </span>
                  <span className="font-medium text-[var(--pv-text)]">{study.name}</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] shadow-sm">
                    <Wrench className="h-3.5 w-3.5 text-[var(--pv-primary)]" aria-hidden="true" />
                  </span>
                  <span className="text-[var(--pv-text-muted)]">{study.industry}</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] shadow-sm">
                    <MapPin className="h-3.5 w-3.5 text-[var(--pv-primary)]" aria-hidden="true" />
                  </span>
                  <span className="text-[var(--pv-text-muted)]">{study.location}</span>
                </span>
              </div>
            </MotionItem>

            {/* Outcome metric callout */}
            <MotionItem delay={0.16}>
              <div className="flex flex-col gap-4 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-bg)] p-5 sm:flex-row sm:items-center sm:gap-6">
                <div className="shrink-0 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--pv-primary)]">
                    Result
                  </p>
                  <p className="font-heading text-2xl font-semibold leading-snug text-[var(--pv-text)]">
                    {study.outcome.metric}
                  </p>
                </div>
                <div className="hidden h-10 w-px bg-[var(--pv-border)] sm:block" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-[var(--pv-text-muted)]">
                  {study.outcome.description}
                </p>
              </div>
            </MotionItem>

            {/* Live site link */}
            <MotionItem delay={0.2}>
              <a
                href={study.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${study.name} live site (opens in new tab)`}
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--pv-primary)] transition-colors hover:text-pv-primary2"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                View live site
              </a>
            </MotionItem>
          </MotionSection>
        </Container>

        {/* Screenshot — full-bleed inside hero bg */}
        <div className="border-t border-[var(--pv-border)]">
          <Container className="px-0 sm:px-6 md:px-8">
            <div className="relative aspect-[16/9] w-full overflow-hidden sm:rounded-t-2xl border-x-0 sm:border-x border-[var(--pv-border)]">
              <Image
                src={study.img}
                alt={`${study.name} website screenshot`}
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) calc(100vw - 3rem), 1280px"
                className="object-cover object-top"
              />
            </div>
          </Container>
        </div>
      </section>

      {/* ── Problem & Solution ───────────────────────────────── */}
      <section className="py-16 md:py-24">
        <Container className="max-w-3xl">
          <MotionSection as="div" className="space-y-12">
            <MotionItem className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
                The Challenge
              </p>
              <p className="text-lg leading-relaxed text-[var(--pv-text-muted)]">{study.problem}</p>
            </MotionItem>

            <MotionItem delay={0.08} className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
                Our Approach
              </p>
              <p className="text-lg leading-relaxed text-[var(--pv-text-muted)]">{study.solution}</p>
            </MotionItem>
          </MotionSection>
        </Container>
      </section>

      {/* ── Issues Grid ──────────────────────────────────────── */}
      <section className="border-t border-[var(--pv-border)] bg-[var(--pv-surface)] py-16 md:py-24">
        <Container className="space-y-10">
          <MotionItem>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
              What We Addressed
            </p>
          </MotionItem>
          <MotionSection as="div" className="grid gap-6 md:grid-cols-3" delay={0.08}>
            {study.issues.map((item, index) => {
              const IconComponent = iconMap[item.icon ?? ''];
              if (!IconComponent && process.env.NODE_ENV === 'development') {
                console.warn(`Missing icon mapping for "${item.icon}". Add to iconMap.`);
              }
              const Icon = IconComponent || AlertCircle;

              return (
                <MotionItem key={item.issue} delay={index * 0.08}>
                  <Card className="group flex h-full flex-col border-[var(--pv-border)] bg-[var(--pv-bg)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-pv">
                    <CardHeader className="flex flex-col gap-4 pb-4">
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-primary)] shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <CardTitle className="text-base text-[var(--pv-text)]">
                          {item.issue}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-3 pt-0">
                      <span
                        className="text-xs font-semibold uppercase tracking-wider text-[var(--pv-primary)]"
                        aria-hidden="true"
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
        </Container>
      </section>

      {/* ── Testimonial ──────────────────────────────────────── */}
      {study.testimonial && (
        <section className="border-t border-[var(--pv-border)] py-16 md:py-24">
          <Container className="max-w-3xl">
            <MotionItem>
              <figure className="space-y-6">
                <Quote
                  className="h-8 w-8 text-[var(--pv-primary)] opacity-60"
                  aria-hidden="true"
                />
                <blockquote className="text-xl leading-relaxed text-[var(--pv-text)] md:text-2xl md:leading-relaxed">
                  &ldquo;{study.testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3 text-sm text-[var(--pv-text-muted)]">
                  <div className="h-px w-8 bg-[var(--pv-border)]" aria-hidden="true" />
                  <span>
                    <span className="font-medium text-[var(--pv-text)]">
                      {study.testimonial.name}
                    </span>
                    {study.testimonial.role && `, ${study.testimonial.role}`}
                    {` — ${study.name}`}
                  </span>
                </figcaption>
              </figure>
            </MotionItem>
          </Container>
        </section>
      )}

      {/* ── Navigation ───────────────────────────────────────── */}
      <section className="border-t border-[var(--pv-border)] bg-[var(--pv-surface)] py-12">
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to portfolio
            </Link>

            {nextStudy && (
              <Link
                href={`/portfolio/${nextStudy.slug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--pv-primary)] transition-colors hover:text-pv-primary2"
                aria-label={`Next case study: ${nextStudy.name}`}
              >
                Next: {nextStudy.name}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </Container>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <Container className="max-w-2xl text-center">
          <MotionSection as="div" className="space-y-6">
            <MotionItem className="space-y-4">
              <h2 className="text-3xl font-semibold text-[var(--pv-text)] md:text-4xl">
                See something that resonates?
              </h2>
              <p className="text-lg text-[var(--pv-text-muted)]">
                If you&apos;re wondering whether a similar approach could work for your business,
                the next step is a conversation — not a proposal.
              </p>
            </MotionItem>
            <MotionItem delay={0.08}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[image:var(--pv-gradient)] px-8 py-3 font-medium text-white shadow-[0_8px_24px_-8px_rgba(63,0,233,0.5)] transition-opacity hover:opacity-90"
              >
                Start the Conversation
              </Link>
            </MotionItem>
          </MotionSection>
        </Container>
      </section>
    </main>
  );
}
