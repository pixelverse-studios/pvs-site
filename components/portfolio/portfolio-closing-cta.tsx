import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export function PortfolioClosingCtaSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="flex flex-col items-center gap-8 text-center">
        <div className="space-y-5">
          <h2 className="text-3xl font-semibold md:text-4xl">
            Seen enough? Let&apos;s talk about what we can create together.
          </h2>
          <p className="max-w-2xl text-lg text-[var(--pv-text-muted)] md:text-xl">
            We&apos;ll walk through your goals, identify the most impactful opportunities, and build
            a roadmap that aligns every deliverable to measurable outcomes.
          </p>
        </div>
        <Button asChild size="lg" variant="cta">
          <Link href="/contact">Contact Us to Start Your Project</Link>
        </Button>
      </Container>
    </section>
  );
}
