import { TrackedLink } from '@/components/analytics/tracked-link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RequestReviewCtaProps {
  variant?: 'cta' | 'ctaGhost';
  className?: string;
  href?: string;
}

export function RequestReviewCta({
  variant = 'cta',
  className,
  href = '/contact/review',
}: RequestReviewCtaProps) {
  return (
    <Button asChild variant={variant} className={cn(className)}>
      <TrackedLink href={href} trackingKind="cta" trackingLabel="Request review CTA">
        Request a Website Review
      </TrackedLink>
    </Button>
  );
}
