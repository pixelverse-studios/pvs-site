import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export function FaqClosingCtaSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="flex flex-col items-center gap-8 text-center">
        <div className="space-y-5">
          <h2 className="text-3xl font-semibold md:text-4xl">
            Your questions deserve answers.
            <br />
            Your business deserves a website that works.
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--pv-text-muted)] md:text-xl">
            When you&apos;re ready, we&apos;re here with a UX-first, custom-coded approach that
            aligns every detail to your goals.
          </p>
        </div>
        <Button asChild size="lg" variant="cta">
          <Link href="/contact">Let&apos;s Connect</Link>
        </Button>
      </Container>
    </section>
  );
}
