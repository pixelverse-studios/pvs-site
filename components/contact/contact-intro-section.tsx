import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function ContactIntroSection() {
  return (
    <section className="bg-[var(--pv-surface)] py-12 md:py-16">
      <Container className="max-w-2xl space-y-4 text-center">
        <MotionSection as="div" className="space-y-4">
          <MotionItem>
            <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
              Getting in touch is the first step toward a website that actually works. Share a few
              details below and we’ll get back to you quickly.
            </p>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
