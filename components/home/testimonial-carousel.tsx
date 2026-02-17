'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { testimonials } from '@/data/homepage';

import { Container } from './container';

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[number] }) {
  return (
    <blockquote className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-bg)] p-7 shadow-[0_4px_6px_rgba(63,0,233,0.04),0_16px_40px_-12px_rgba(63,0,233,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_6px_rgba(63,0,233,0.06),0_24px_48px_-12px_rgba(63,0,233,0.14)] md:p-8">
      {/* Gradient top accent */}
      <div
        className="absolute left-0 right-0 top-0 h-[2px]"
        style={{ background: 'var(--pv-gradient)' }}
        aria-hidden
      />

      {/* Quote icon */}
      <div className="mb-5">
        <Quote size={24} className="text-[var(--pv-primary)] opacity-25" strokeWidth={1.5} />
      </div>

      {/* Quote text */}
      <p className="flex-1 text-[0.9375rem] font-medium leading-[1.75] tracking-[-0.01em] text-[var(--pv-text)] md:text-base md:leading-[1.8]">
        {testimonial.quote}
      </p>

      {/* Attribution */}
      <footer className="mt-6 border-t border-[var(--pv-border)] pt-5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: 'var(--pv-gradient)' }}
          >
            {testimonial.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--pv-text)]">{testimonial.name}</p>
            <p className="text-xs text-[var(--pv-text-muted)]">
              {testimonial.role && testimonial.company
                ? `${testimonial.role} at ${testimonial.company}`
                : testimonial.role || testimonial.company}
            </p>
          </div>
        </div>
      </footer>
    </blockquote>
  );
}

export function TestimonialCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 4);
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 4);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    updateScrollState();
    container.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      container.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Scroll by roughly one card width + gap
    const cardWidth = container.querySelector('[data-testimonial-card]')?.clientWidth ?? 320;
    const distance = cardWidth + 20; // card + gap

    container.scrollBy({
      left: direction === 'right' ? distance : -distance,
      behavior: 'smooth',
    });
  }, []);

  if (testimonials.length === 0) return null;

  const showNavigation = testimonials.length > 3;

  return (
    <section
      className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)]"
      aria-label="Client testimonials"
    >
      <Container className="py-20 md:py-28">
        <MotionSection as="div" className="space-y-14">
          {/* Header */}
          <MotionItem>
            <div className="flex items-end justify-between">
              <div className="max-w-2xl">
                <div
                  className="mb-6 h-1 w-12 rounded-full"
                  style={{ background: 'var(--pv-gradient)' }}
                  aria-hidden
                />
                <h2 className="font-heading text-[2rem] leading-[2.5rem] tracking-[-0.02em] text-[var(--pv-text)] md:text-[2.5rem] md:leading-[3rem]">
                  What our clients say
                </h2>
                <p className="mt-4 text-base text-[var(--pv-text-muted)] md:text-lg">
                  Real feedback from businesses we&apos;ve helped grow.
                </p>
              </div>

              {/* Desktop arrows (top-right) */}
              {showNavigation && (
                <div className="hidden gap-2 sm:flex">
                  <button
                    onClick={() => scroll('left')}
                    disabled={!canScrollLeft}
                    aria-label="Previous testimonials"
                    className="hover:border-[var(--pv-primary)]/40 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] text-[var(--pv-text-muted)] transition-all duration-200 hover:text-[var(--pv-primary)] disabled:opacity-30 disabled:hover:border-[var(--pv-border)] disabled:hover:text-[var(--pv-text-muted)]"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => scroll('right')}
                    disabled={!canScrollRight}
                    aria-label="Next testimonials"
                    className="hover:border-[var(--pv-primary)]/40 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] text-[var(--pv-text-muted)] transition-all duration-200 hover:text-[var(--pv-primary)] disabled:opacity-30 disabled:hover:border-[var(--pv-border)] disabled:hover:text-[var(--pv-text-muted)]"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </MotionItem>

          {/* Carousel */}
          <MotionItem delay={0.1}>
            <div
              ref={scrollContainerRef}
              className="-mx-6 flex gap-5 overflow-x-auto scroll-smooth px-6 md:-mx-8 md:px-8"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={`${testimonial.name}-${testimonial.company}-${index}`}
                  data-testimonial-card
                  className="w-[85%] flex-shrink-0 sm:w-[46%] lg:w-[calc(33.333%-14px)]"
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>

            {/* Mobile arrows (below carousel) */}
            {showNavigation && (
              <div className="mt-8 flex items-center justify-center gap-3 sm:hidden">
                <button
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  aria-label="Previous testimonials"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] text-[var(--pv-text-muted)] transition-all duration-200 hover:text-[var(--pv-primary)] disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  aria-label="Next testimonials"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] text-[var(--pv-text-muted)] transition-all duration-200 hover:text-[var(--pv-primary)] disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </MotionItem>
        </MotionSection>
      </Container>

      <style jsx>{`
        div[style*='scrollbar-width']::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
