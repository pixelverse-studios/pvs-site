import Link from 'next/link';

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
  href = '/audit',
}: RequestReviewCtaProps) {
  return (
    <Button asChild variant={variant} className={cn(className)}>
      <Link href={href}>Request a Website Review</Link>
    </Button>
  );
}
