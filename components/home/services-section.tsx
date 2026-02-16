import Link from 'next/link';
import { ArrowRight, Code, LifeBuoy, Palette, Search, type LucideIcon } from 'lucide-react';

import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { services } from '@/data/homepage';

import { Container } from './container';

const iconMap: Record<string, LucideIcon> = {
  code: Code,
  palette: Palette,
  search: Search,
  lifebuoy: LifeBuoy,
};

export function ServicesSection() {
  return (
    <section className="border-b border-[var(--pv-border)] bg-[var(--pv-bg)]">
      <Container className="py-20 md:py-28">
        <MotionSection as="div" className="space-y-14">
          {/* Header */}
          <MotionItem className="mx-auto max-w-2xl text-center">
            <div
              className="mx-auto mb-6 h-1 w-12 rounded-full"
              style={{ background: 'var(--pv-gradient)' }}
              aria-hidden
            />
            <h2 className="font-heading text-[2rem] leading-[2.5rem] tracking-[-0.02em] text-[var(--pv-text)] md:text-[2.5rem] md:leading-[3rem]">
              What We Work On
            </h2>
          </MotionItem>

          {/* Service cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon];
              if (!IconComponent && process.env.NODE_ENV === 'development') {
                console.warn(`Missing icon mapping for "${service.icon}". Add to iconMap.`);
              }
              const Icon = IconComponent || Code;

              return (
                <MotionItem key={service.title} delay={index * 0.08}>
                  <Link
                    href={service.href}
                    className="group block h-full"
                    aria-label={`Learn more about ${service.title}`}
                  >
                    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-8">
                      {/* Gradient top accent */}
                      <div
                        className="absolute left-0 right-0 top-0 h-[2px]"
                        style={{ background: 'var(--pv-gradient)' }}
                        aria-hidden
                      />

                      {/* Icon */}
                      <div
                        className="mb-5 flex h-10 w-10 items-center justify-center rounded-full text-white"
                        style={{ background: 'var(--pv-gradient)' }}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>

                      {/* Title */}
                      <h3 className="mb-3 text-lg font-semibold text-[var(--pv-text)]">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="flex-1 text-[0.9375rem] leading-[1.75] text-[var(--pv-text-muted)]">
                        {service.summary}
                      </p>

                      {/* Link indicator */}
                      <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-[var(--pv-primary)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <span>Learn more</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                </MotionItem>
              );
            })}
          </div>

          {/* Closing line */}
          <MotionItem delay={0.3}>
            <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-[var(--pv-text-muted)] md:text-lg">
              Each engagement begins with understanding the situation first, not assuming the
              solution.
            </p>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
