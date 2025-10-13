import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export function PackagesClosingCtaSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-3xl space-y-8 text-center">
        <div className="space-y-5">
          <h2 className="text-3xl font-semibold md:text-4xl">
            Every business deserves a site that works. Let&apos;s find the package that fits your
            future.
          </h2>
          <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
            Tell us about your goals and we’ll recommend the plan, timeline, and add-ons that get you
            there without the guesswork.
          </p>
        </div>
        <div className="flex justify-center">
          <Button asChild size="lg" variant="cta">
            <Link href="/contact">Contact Us to Start Your Project</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
