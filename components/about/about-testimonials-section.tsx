import { Quote } from 'lucide-react';

import type { Testimonial } from '@/data/about';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

interface AboutTestimonialsSectionProps {
  title: string;
  testimonials: Testimonial[];
  background?: 'surface' | 'default';
}

export function AboutTestimonialsSection({
  title,
  testimonials,
  background = 'default',
}: AboutTestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section
      className={cn(
        'py-16 md:py-24',
        background === 'surface' && 'bg-[var(--pv-surface)]',
      )}
    >
      <Container className="space-y-10">
        <MotionSection as="div" className="space-y-10">
          <MotionItem>
            <h2 className="text-center font-heading text-3xl tracking-tight md:text-4xl">
              {title}
            </h2>
          </MotionItem>

          <MotionItem delay={0.1}>
            <div
              className={cn(
                'grid gap-6',
                testimonials.length === 2 && 'md:grid-cols-2',
                testimonials.length >= 3 && 'md:grid-cols-2 lg:grid-cols-3',
              )}
            >
              {testimonials.map((testimonial, i) => (
                <Card
                  key={i}
                  className="flex h-full flex-col justify-between gap-6 p-6 transition-shadow duration-300 hover:shadow-[0_30px_60px_-40px_rgba(63,0,233,0.4)]"
                >
                  <CardContent className="flex flex-col gap-4 p-0">
                    <Quote
                      className="h-6 w-6 text-[var(--pv-primary)] opacity-40"
                      aria-hidden="true"
                    />
                    <p className="text-base italic leading-7 text-[var(--pv-text)]">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                  </CardContent>
                  <div className="border-t border-[var(--pv-border)] pt-4">
                    <p className="text-sm font-semibold text-[var(--pv-text)]">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-[var(--pv-text-muted)]">
                      {testimonial.authorTitle && `${testimonial.authorTitle}, `}
                      {testimonial.business}
                      {testimonial.location && ` — ${testimonial.location}`}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
