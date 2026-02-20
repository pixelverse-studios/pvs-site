import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building2, MapPin } from 'lucide-react';

import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { caseStudies } from '@/data/case-studies';

const panelGradients = [
  'bg-[radial-gradient(circle_at_top_left,var(--pv-primary)/0.18,transparent_60%)]',
  'bg-[radial-gradient(circle_at_top_right,var(--pv-primary-2)/0.18,transparent_60%)]',
  'bg-[radial-gradient(circle_at_bottom_left,var(--pv-primary)/0.15,transparent_55%)]',
];

export function ProjectShowcaseSection() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="divide-y divide-[var(--pv-border)]">
          {caseStudies.map((study, index) => {
            const isEven = index % 2 === 0;

            return (
              <MotionSection
                key={study.slug}
                as="div"
                className={`flex flex-col gap-10 py-16 md:py-20 lg:items-center lg:gap-16 ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Image */}
                <MotionItem className="lg:w-[45%]">
                  <div
                    className={`group relative overflow-hidden rounded-2xl border border-[var(--pv-border)] shadow-sm ${panelGradients[index % panelGradients.length]}`}
                  >
                    <div className="relative aspect-[16/11] w-full bg-[var(--pv-surface)]">
                      <Image
                        src={study.img}
                        alt={`${study.name} website`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 45vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                </MotionItem>

                {/* Content */}
                <MotionSection as="div" className="flex flex-col gap-6 lg:w-[55%]" delay={0.08}>
                  {/* Tags */}
                  <MotionItem>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-3 py-1 text-xs font-medium text-[var(--pv-text-muted)]">
                        <Building2 className="h-3 w-3 shrink-0" aria-hidden />
                        {study.industry}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-3 py-1 text-xs font-medium text-[var(--pv-text-muted)]">
                        <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                        {study.location}
                      </span>
                    </div>
                  </MotionItem>

                  {/* Title */}
                  <MotionItem delay={0.05}>
                    <h2 className="font-heading text-2xl font-semibold leading-snug text-[var(--pv-text)] md:text-[1.85rem] md:leading-tight">
                      {study.title}
                    </h2>
                  </MotionItem>

                  {/* Problem teaser */}
                  <MotionItem delay={0.1}>
                    <p className="line-clamp-4 text-lg leading-relaxed text-[var(--pv-text-muted)]">
                      {study.problem}
                    </p>
                  </MotionItem>

                  {/* Outcome metric */}
                  <MotionItem delay={0.14}>
                    <div className="rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--pv-primary)]">
                        Result
                      </p>
                      <p className="mt-1 text-xl font-semibold leading-snug text-[var(--pv-text)]">
                        {study.outcome.metric}
                      </p>
                    </div>
                  </MotionItem>

                  {/* CTAs */}
                  <MotionItem delay={0.18}>
                    <div className="flex flex-wrap items-center gap-5">
                      <Link
                        href={`/portfolio/${study.slug}`}
                        className="inline-flex items-center gap-2 font-medium text-[var(--pv-primary)] transition-colors hover:text-[var(--pv-primary-2)]"
                      >
                        Read case study
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <span className="text-[var(--pv-border)]" aria-hidden>
                        |
                      </span>
                      <a
                        href={study.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]"
                      >
                        View live site
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </MotionItem>
                </MotionSection>
              </MotionSection>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
