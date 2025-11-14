import Link from 'next/link';
import { ArrowDownRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

const heroHighlights = [
  { label: 'Turnaround', value: '2–3 business days' },
  { label: 'Scope', value: 'UX • SEO • Performance • CRO' },
  { label: 'Format', value: 'Action plan + Loom walkthrough' },
];

export function AuditHeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--pv-border)] bg-[var(--pv-bg)] pt-hero pb-16 md:pb-20">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,var(--pv-primary)/0.18,transparent_55%)] dark:bg-[radial-gradient(circle_at_top,var(--pv-primary)/0.35,transparent_60%)]"
        aria-hidden
      />
      <Container className="max-w-5xl">
        <MotionSection as="div" className="space-y-8 text-center">
          <MotionItem>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-1 text-xs uppercase tracking-[0.3em] text-[var(--pv-text-muted)]">
              Free Website Audit
            </span>
          </MotionItem>
          <MotionItem delay={0.08} className="space-y-5">
            <h1 className="font-heading text-4xl font-semibold leading-tight text-[var(--pv-text)] md:text-5xl">
              See How Your Website&apos;s Really Performing
            </h1>
            <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
              Our free website audit takes a close look at how well your site is designed, built, and
              helping your business, covering usability, SEO, design, and performance.
            </p>
          </MotionItem>
          <MotionItem delay={0.15}>
            <Button asChild size="lg" variant="cta">
              <Link href="#audit-form" aria-label="Skip to the free audit form">
                <span className="inline-flex items-center gap-2">
                  Get My Free Audit
                  <ArrowDownRight className="h-5 w-5" aria-hidden />
                </span>
              </Link>
            </Button>
            <p className="mt-3 text-sm text-[var(--pv-text-muted)]">
              No commitment. We respond within two business days.
            </p>
          </MotionItem>
          <MotionItem delay={0.2}>
            <div className="grid gap-6 rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)]/80 p-6 text-center shadow-pv backdrop-blur-sm dark:bg-[var(--pv-surface)]/40 sm:grid-cols-3 sm:text-left">
              {heroHighlights.map((highlight) => (
                <div key={highlight.label} className="space-y-2 text-sm">
                  <p className="uppercase tracking-[0.3em] text-[var(--pv-text-muted)]">{highlight.label}</p>
                  <p className="text-xl font-semibold text-[var(--pv-text)]">{highlight.value}</p>
                </div>
              ))}
            </div>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
