import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function BlogCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--pv-gradient)] text-white">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.22),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.16),transparent_50%)]"
      />
      <Container className="relative py-16 md:py-24">
        <MotionSection
          as="div"
          className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
          triggerOnViewport={false}
        >
          <MotionItem className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em]">
            Work with PixelVerse
          </MotionItem>
          <MotionItem className="space-y-4">
            <h2 className="font-heading text-[2.5rem] leading-[3rem]">
              Let&apos;s plug these playbooks into your next launch
            </h2>
            <p className="text-lg text-white/85">
              Whether you need a SEO-ready redesign or a fresh analytics cadence, our team ships
              custom, conversion-focused experiences on time.
            </p>
          </MotionItem>
          <MotionItem className="flex flex-col items-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="cta" className="bg-white text-[var(--pv-primary)] hover:text-[var(--pv-primary)]">
              <Link href="/contact">Book a strategy call</Link>
            </Button>
            <Button asChild variant="ghost" className="border-white/30 text-white hover:bg-white/10">
              <Link href="/portfolio">See recent launches</Link>
            </Button>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
