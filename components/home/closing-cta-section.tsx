import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { SocialLinks } from '@/components/ui/social-links';

import { Container } from './container';

export function ClosingCtaSection() {
  return (
    <section id="contact" className="bg-[var(--pv-bg)] py-16 md:py-24">
      <Container>
        <MotionSection
          as="div"
          className="mx-auto max-w-3xl space-y-6 rounded-pv border border-[var(--pv-border)] bg-[var(--pv-surface)] px-6 py-16 text-center shadow-pv"
        >
          <MotionItem>
            <h2 className="font-heading text-[2.5rem] leading-[3.125rem] text-[var(--pv-text)]">
              Let’s create more than just a website. Let’s build your digital future.
            </h2>
          </MotionItem>
          <MotionItem delay={0.1}>
            <Button asChild size="lg" variant="cta" className="w-full md:w-auto">
              <Link href="/contact">Contact Us to Start Your Project</Link>
            </Button>
          </MotionItem>
          <MotionItem delay={0.15}>
            <div className="space-y-3">
              <p className="text-sm text-[var(--pv-text-muted)]">
                Prefer social? Follow along for weekly UX-first drops, project breakdowns, and
                behind-the-scenes builds.
              </p>
              <SocialLinks className="flex-wrap justify-center" iconClassName="bg-[var(--pv-bg)]" />
            </div>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
