'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { testimonials } from '@/data/homepage';

// Animation timing constants
const CARD_STAGGER_INCREMENT = 0.12;

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Hide navigation for single testimonial
  const showNavigation = testimonials.length > 1;

  // Scroll to specific testimonial
  const scrollToIndex = useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('[data-testimonial-card]');
    const targetCard = cards[index] as HTMLElement;

    if (targetCard) {
      targetCard.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
      setCurrentIndex(index);
    }
  }, []); // No dependencies - uses ref and setState

  // Keyboard navigation
  useEffect(() => {
    if (!showNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const newIndex = currentIndex > 0 ? currentIndex - 1 : testimonials.length - 1;
        scrollToIndex(newIndex);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const newIndex = currentIndex < testimonials.length - 1 ? currentIndex + 1 : 0;
        scrollToIndex(newIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, showNavigation, scrollToIndex]);

  // Sync currentIndex with scroll position using Intersection Observer
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !showNavigation) return;

    const options = {
      root: container,
      threshold: 0.6, // Card is considered "active" when 60% visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-index'));
          // Add bounds checking for type safety
          if (!isNaN(index) && index >= 0 && index < testimonials.length) {
            setCurrentIndex(index);
          }
        }
      });
    }, options);

    const cards = container.querySelectorAll('[data-testimonial-card]');
    cards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect(); // Better cleanup than manual unobserve
    };
  }, [showNavigation]);

  // Don't render if there are no testimonials
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section
      className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)]"
      aria-label="Client testimonials"
    >
      <Container className="py-16 md:py-24">
        <MotionSection as="div" className="space-y-12">
          {/* Header */}
          <MotionItem className="mx-auto max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--pv-primary)]">
              Client Testimonials
            </p>
            <h2 className="font-heading text-[2.5rem] leading-[3.125rem] text-[var(--pv-text)]">
              What our clients say
            </h2>
            <p className="mt-4 text-lg text-[var(--pv-text-muted)]">
              Real feedback from businesses we&apos;ve helped grow.
            </p>
          </MotionItem>

          {/* Carousel */}
          <MotionItem delay={CARD_STAGGER_INCREMENT}>
            <div
              ref={scrollContainerRef}
              className="scrollbar-hide -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 md:-mx-8 md:px-8"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={`${testimonial.name}-${index}`}
                  data-testimonial-card
                  data-index={index}
                  className="w-full flex-shrink-0 snap-center md:w-4/5"
                >
                  <blockquote className="bg-[var(--pv-surface)]/80 dark:bg-[var(--pv-surface)]/90 space-y-6 rounded-pv border border-[var(--pv-border)] p-8 shadow-[0_24px_60px_-40px_rgba(63,0,233,0.4)]">
                    <p className="text-lg leading-8 text-[var(--pv-text-muted)] md:text-xl md:leading-9">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <footer className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-[var(--pv-border)]" />
                      <div className="text-right">
                        <p className="font-semibold text-[var(--pv-text)]">{testimonial.name}</p>
                        <p className="text-sm text-[var(--pv-text-muted)]">
                          {testimonial.role && testimonial.company
                            ? `${testimonial.role} at ${testimonial.company}`
                            : testimonial.role || testimonial.company}
                        </p>
                      </div>
                    </footer>
                  </blockquote>
                </div>
              ))}
            </div>

            {/* Navigation Dots */}
            {showNavigation && (
              <div className="mt-8 flex items-center justify-center gap-3" role="tablist">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    role="tab"
                    aria-selected={currentIndex === index}
                    aria-current={currentIndex === index ? 'true' : undefined}
                    aria-label={`Go to testimonial ${index + 1}`}
                    onClick={() => scrollToIndex(index)}
                    className={`h-2 rounded-full transition-[width,background-color] duration-300 ${
                      currentIndex === index
                        ? 'w-8 bg-[linear-gradient(90deg,var(--pv-primary),var(--pv-primary-2))]'
                        : 'w-2 bg-[var(--pv-border)] hover:bg-[var(--pv-text-muted)]'
                    }`}
                  />
                ))}
              </div>
            )}
          </MotionItem>
        </MotionSection>
      </Container>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
