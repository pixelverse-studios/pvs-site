import { ExternalLink, Star } from 'lucide-react';

import type { GoogleReviews } from '@/data/about';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

interface AboutGoogleReviewsSectionProps {
  title: string;
  description?: string;
  reviews: GoogleReviews;
  background?: 'surface' | 'default';
}

export function AboutGoogleReviewsSection({
  title,
  description,
  reviews,
  background = 'default',
}: AboutGoogleReviewsSectionProps) {
  if (reviews.reviewCount === 0) return null;

  const fullStars = Math.floor(reviews.rating);
  const hasHalfStar = reviews.rating % 1 >= 0.5;

  return (
    <section
      className={cn(
        'py-16 md:py-24',
        background === 'surface' && 'bg-[var(--pv-surface)]',
      )}
    >
      <Container>
        <MotionSection as="div" className="flex flex-col items-center gap-6 text-center">
          <MotionItem>
            <h2 className="font-heading text-3xl tracking-tight md:text-4xl">{title}</h2>
          </MotionItem>

          {description && (
            <MotionItem delay={0.05}>
              <p className="max-w-2xl text-lg text-[var(--pv-text-muted)]">{description}</p>
            </MotionItem>
          )}

          <MotionItem delay={0.1}>
            <div className="flex items-center gap-1" aria-label={`${reviews.rating} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-6 w-6',
                    i < fullStars
                      ? 'fill-amber-400 text-amber-400'
                      : i === fullStars && hasHalfStar
                        ? 'fill-amber-400/50 text-amber-400'
                        : 'text-[var(--pv-border)]',
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
          </MotionItem>

          <MotionItem delay={0.15}>
            <p className="text-sm text-[var(--pv-text-muted)]">
              {reviews.rating.toFixed(1)} stars based on {reviews.reviewCount} review
              {reviews.reviewCount !== 1 ? 's' : ''}
            </p>
          </MotionItem>

          <MotionItem delay={0.2}>
            <Button asChild variant="outline" size="lg">
              <a href={reviews.gbpUrl} target="_blank" rel="noopener noreferrer">
                View All Reviews on Google
                <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
