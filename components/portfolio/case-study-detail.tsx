'use client';

import { useState } from 'react';
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

// ── Layout picker widget ───────────────────────────────────────────────────

type NarrativeLayout = 'beside' | 'spread' | 'layered';

const LAYOUTS: { id: NarrativeLayout; label: string; icon: React.ReactNode }[] = [
  {
    id: 'beside',
    label: 'Beside',
    icon: (
      // two vertical columns
      <svg width="20" height="16" viewBox="0 0 20 16" fill="currentColor" aria-hidden="true">
        <rect x="0" y="0" width="9" height="16" rx="1.5" opacity="0.9" />
        <rect x="11" y="0" width="9" height="16" rx="1.5" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'spread',
    label: 'Spread',
    icon: (
      // wide bar top, two columns below
      <svg width="20" height="16" viewBox="0 0 20 16" fill="currentColor" aria-hidden="true">
        <rect x="0" y="0" width="20" height="7" rx="1.5" opacity="0.9" />
        <rect x="0" y="9" width="9" height="7" rx="1.5" opacity="0.5" />
        <rect x="11" y="9" width="9" height="7" rx="1.5" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'layered',
    label: 'Layered',
    icon: (
      // text, image, text stacked
      <svg width="20" height="16" viewBox="0 0 20 16" fill="currentColor" aria-hidden="true">
        <rect x="0" y="0" width="20" height="3.5" rx="1" opacity="0.5" />
        <rect x="0" y="5.5" width="20" height="5" rx="1.5" opacity="0.9" />
        <rect x="0" y="12.5" width="20" height="3.5" rx="1" opacity="0.5" />
      </svg>
    ),
  },
];

function LayoutPicker({
  active,
  onSelect,
}: {
  active: NarrativeLayout;
  onSelect: (l: NarrativeLayout) => void;
}) {
  return (
    <div className="fixed bottom-24 right-6 z-50 select-none">
      <div
        className="rounded-2xl border p-3"
        style={{
          background: 'rgba(18, 18, 28, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          boxShadow: '0 24px 48px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        <p
          className="mb-3 text-center text-[0.625rem] font-semibold uppercase tracking-[0.2em]"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          Layout
        </p>
        <div className="flex gap-2">
          {LAYOUTS.map((layout) => {
            const isActive = active === layout.id;
            return (
              <button
                key={layout.id}
                onClick={() => onSelect(layout.id)}
                aria-pressed={isActive}
                aria-label={`Layout: ${layout.label}`}
                className="flex flex-col items-center gap-1.5 rounded-xl px-3 py-2.5 transition-all duration-200"
                style={{
                  background: isActive ? 'rgba(124,77,255,0.2)' : 'transparent',
                  border: isActive ? '1px solid rgba(124,77,255,0.5)' : '1px solid transparent',
                  color: isActive ? '#7c4dff' : 'rgba(255,255,255,0.35)',
                  transform: isActive ? 'scale(1.04)' : 'scale(1)',
                }}
              >
                {layout.icon}
                <span className="text-[0.6rem] font-medium uppercase tracking-[0.08em]">
                  {layout.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Shared image + caption block ───────────────────────────────────────────

function StudyImage({
  study,
  sizes,
  className = '',
}: {
  study: CaseStudy;
  sizes: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="overflow-hidden rounded-2xl border border-[var(--pv-border)] shadow-sm">
        <div className="relative aspect-[16/10] w-full bg-[var(--pv-surface)]">
          <Image
            src={study.img}
            alt={`${study.name} website screenshot`}
            fill
            priority
            sizes={sizes}
            className="object-cover object-top"
          />
        </div>
      </div>
      <a
        href={study.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${study.name} live site (opens in new tab)`}
        className="mt-3 inline-flex items-center gap-1.5 text-xs text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-primary)]"
      >
        <ExternalLink className="h-3 w-3" aria-hidden="true" />
        {study.name} — live site
      </a>
    </div>
  );
}

// ── Narrative section layouts ──────────────────────────────────────────────

function NarrativeBeside({ study }: { study: CaseStudy }) {
  return (
    <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
      {/* Sticky wrapper — non-animated so position:sticky isn't broken by transforms */}
      <div className="lg:w-[46%] lg:sticky lg:top-24 lg:shrink-0">
        <MotionItem>
          <StudyImage
            study={study}
            sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 46vw, 640px"
          />
        </MotionItem>
      </div>

      {/* Numbered narrative */}
      <div className="flex flex-col gap-14 lg:flex-1">
        <MotionItem className="space-y-6">
          <div className="flex items-center gap-5">
            <span
              className="select-none font-heading text-5xl font-semibold leading-none text-[var(--pv-border)]"
              aria-hidden="true"
            >
              01
            </span>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
              The Challenge
            </h2>
          </div>
          <p className="text-xl leading-[1.8] text-[var(--pv-text-muted)]">{study.problem}</p>
        </MotionItem>

        <div className="h-px bg-[var(--pv-border)]" aria-hidden="true" />

        <MotionItem delay={0.08} className="space-y-6">
          <div className="flex items-center gap-5">
            <span
              className="select-none font-heading text-5xl font-semibold leading-none text-[var(--pv-border)]"
              aria-hidden="true"
            >
              02
            </span>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
              Our Approach
            </h2>
          </div>
          <p className="text-xl leading-[1.8] text-[var(--pv-text-muted)]">{study.solution}</p>
        </MotionItem>
      </div>
    </div>
  );
}

function NarrativeSpread({ study }: { study: CaseStudy }) {
  return (
    <div className="space-y-14">
      {/* Full-width image banner */}
      <MotionItem>
        <StudyImage study={study} sizes="(max-width: 640px) 100vw, calc(100vw - 4rem), 1280px" />
      </MotionItem>

      {/* Two-column text below */}
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <MotionItem className="space-y-6">
          <div className="flex items-center gap-4">
            <span
              className="select-none font-heading text-4xl font-semibold leading-none text-[var(--pv-border)]"
              aria-hidden="true"
            >
              01
            </span>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
              The Challenge
            </h2>
          </div>
          <p className="text-lg leading-[1.8] text-[var(--pv-text-muted)]">{study.problem}</p>
        </MotionItem>

        <MotionItem delay={0.08} className="space-y-6">
          <div className="flex items-center gap-4">
            <span
              className="select-none font-heading text-4xl font-semibold leading-none text-[var(--pv-border)]"
              aria-hidden="true"
            >
              02
            </span>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
              Our Approach
            </h2>
          </div>
          <p className="text-lg leading-[1.8] text-[var(--pv-text-muted)]">{study.solution}</p>
        </MotionItem>
      </div>
    </div>
  );
}

function NarrativeLayered({ study }: { study: CaseStudy }) {
  return (
    <div className="mx-auto max-w-3xl space-y-14">
      {/* 01 — Challenge */}
      <MotionItem className="space-y-6">
        <div className="flex items-center gap-5">
          <span
            className="select-none font-heading text-5xl font-semibold leading-none text-[var(--pv-border)]"
            aria-hidden="true"
          >
            01
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
            The Challenge
          </p>
        </div>
        <p className="text-xl leading-[1.8] text-[var(--pv-text-muted)]">{study.problem}</p>
      </MotionItem>

      {/* Image as evidence — sits between challenge and approach */}
      <MotionItem delay={0.06}>
        <StudyImage
          study={study}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) calc(100vw - 6rem), 768px"
          className="mx-auto max-w-2xl"
        />
      </MotionItem>

      {/* 02 — Approach */}
      <MotionItem delay={0.1} className="space-y-6">
        <div className="flex items-center gap-5">
          <span
            className="select-none font-heading text-5xl font-semibold leading-none text-[var(--pv-border)]"
            aria-hidden="true"
          >
            02
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
            Our Approach
          </p>
        </div>
        <p className="text-xl leading-[1.8] text-[var(--pv-text-muted)]">{study.solution}</p>
      </MotionItem>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

interface CaseStudyDetailProps {
  study: CaseStudy;
  nextStudy: CaseStudy | null;
}

export function CaseStudyDetail({ study, nextStudy }: CaseStudyDetailProps) {
  const [layout, setLayout] = useState<NarrativeLayout>('beside');

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-[var(--pv-surface)] pb-0 pt-hero">
        <Container className="max-w-4xl">
          <MotionSection as="div" className="space-y-8 pb-16">
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
                  <li>
                    <span className="text-[var(--pv-text)]" aria-current="page">
                      {study.name}
                    </span>
                  </li>
                </ol>
              </nav>
            </MotionItem>

            {/* Pill */}
            <MotionItem delay={0.04}>
              <span className="inline-flex items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] px-4 py-1 text-xs uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
                Case Study
              </span>
            </MotionItem>

            {/* Title */}
            <MotionItem delay={0.08}>
              <h1 className="font-heading text-4xl font-semibold leading-tight text-[var(--pv-text)] md:text-5xl lg:text-[3.25rem]">
                {study.title}
              </h1>
            </MotionItem>

            {/* Outcome — inline left-border accent */}
            <MotionItem delay={0.12}>
              <div className="border-l-2 border-[var(--pv-primary)] pl-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
                  The Result
                </p>
                <p className="mt-1.5 text-xl font-semibold leading-snug text-[var(--pv-text)]">
                  {study.outcome.metric}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--pv-text-muted)]">
                  {study.outcome.description}
                </p>
              </div>
            </MotionItem>

            {/* Metadata */}
            <MotionItem delay={0.16}>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--pv-text-muted)]">
                <span className="inline-flex items-center gap-2">
                  <Building2
                    className="h-3.5 w-3.5 text-[var(--pv-primary)]"
                    aria-hidden="true"
                  />
                  <span className="font-medium text-[var(--pv-text)]">{study.name}</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <Wrench className="h-3.5 w-3.5 text-[var(--pv-primary)]" aria-hidden="true" />
                  {study.industry}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[var(--pv-primary)]" aria-hidden="true" />
                  {study.location}
                </span>
              </div>
            </MotionItem>
          </MotionSection>
        </Container>
      </section>

      {/* ── Narrative: image + Challenge + Approach ───────────── */}
      <section className="border-t border-[var(--pv-border)] py-20 md:py-28">
        <Container className="max-w-6xl">
          {layout === 'beside' && <NarrativeBeside study={study} />}
          {layout === 'spread' && <NarrativeSpread study={study} />}
          {layout === 'layered' && <NarrativeLayered study={study} />}
        </Container>
      </section>

      {/* ── What We Addressed — editorial rows ───────────────── */}
      <section className="border-t border-[var(--pv-border)] bg-[var(--pv-surface)] py-20 md:py-28">
        <Container className="max-w-5xl">
          <MotionSection as="div" className="space-y-12">
            <MotionItem>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
                What We Addressed
              </h2>
            </MotionItem>

            <div className="divide-y divide-[var(--pv-border)]">
              {study.issues.map((item, index) => {
                const IconComponent = iconMap[item.icon ?? ''];
                if (!IconComponent && process.env.NODE_ENV === 'development') {
                  console.warn(`Missing icon mapping for "${item.icon}". Add to iconMap.`);
                }
                const Icon = IconComponent || AlertCircle;

                return (
                  <MotionItem key={item.issue}>
                    <div className="grid gap-6 py-10 md:grid-cols-[1fr_1.5fr] md:gap-16">
                      {/* Left: icon + issue */}
                      <div className="flex items-start gap-4">
                        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] text-[var(--pv-primary)] shadow-sm">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <h3 className="text-base font-medium leading-snug text-[var(--pv-text)]">
                          {item.issue}
                        </h3>
                      </div>

                      {/* Right: resolution */}
                      <div className="space-y-2">
                        <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--pv-primary)]">
                          What we did
                        </span>
                        <p className="leading-relaxed text-[var(--pv-text-muted)]">
                          {item.resolution}
                        </p>
                      </div>
                    </div>
                  </MotionItem>
                );
              })}
            </div>
          </MotionSection>
        </Container>
      </section>

      {/* ── Testimonial ──────────────────────────────────────── */}
      {study.testimonial && (
        <section className="border-t border-[var(--pv-border)] py-20 md:py-28">
          <Container className="max-w-3xl">
            <MotionItem>
              <figure className="space-y-8">
                <Quote
                  className="h-10 w-10 text-[var(--pv-primary)] opacity-50"
                  aria-hidden="true"
                />
                <blockquote className="text-2xl leading-relaxed text-[var(--pv-text)] md:text-3xl md:leading-relaxed">
                  &ldquo;{study.testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-4 text-sm text-[var(--pv-text-muted)]">
                  <div className="h-px w-10 bg-[var(--pv-border)]" aria-hidden="true" />
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
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--pv-primary)] transition-colors hover:opacity-80"
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
      <section className="py-20 md:py-28">
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

      {/* ── Layout picker ─────────────────────────────────────── */}
      <LayoutPicker active={layout} onSelect={setLayout} />
    </main>
  );
}
