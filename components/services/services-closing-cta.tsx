import Link from 'next/link';

import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';

export function ServicesClosingCtaSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="flex flex-col items-center gap-8 text-center">
        <div className="space-y-5">
          <h2 className="text-3xl font-semibold md:text-4xl">
            Your business deserves a site built for more. Let&apos;s make it happen.
          </h2>
          <p className="max-w-2xl text-lg text-[var(--pv-text-muted)]">
            Partner with a team that designs every touchpoint intentionally and codes every feature
            for performance.
          </p>
        </div>
        <Button asChild size="lg" variant="cta">
          <Link href="/contact">Contact Us to Start Your Project</Link>
        </Button>
      </Container>
    </section>
  );
}
