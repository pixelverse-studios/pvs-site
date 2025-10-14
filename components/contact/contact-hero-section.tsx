import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function ContactHeroSection() {
  return (
    <section className="pt-hero pb-12 md:pb-16">
      <Container className="max-w-3xl space-y-6 text-center">
        <MotionSection as="div" className="space-y-6">
          <MotionItem>
            <h1 className="text-4xl font-semibold leading-[3rem] md:text-5xl md:leading-[3.5rem]">
              Let&apos;s Start Your Project
            </h1>
          </MotionItem>
          <MotionItem delay={0.08}>
            <div className="mx-auto h-1 w-24 rounded-full bg-[var(--pv-gradient)]" aria-hidden />
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
