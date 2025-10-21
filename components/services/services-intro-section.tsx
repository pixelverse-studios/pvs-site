import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

type HeadingLevel = 'h1' | 'h2' | 'h3';

interface ServicesIntroSectionProps {
  headingLevel?: HeadingLevel;
}

export function ServicesIntroSection({ headingLevel = 'h1' }: ServicesIntroSectionProps) {
  const HeadingTag = headingLevel;

  return (
    <section className="bg-[var(--pv-surface)] pt-hero pb-16 md:pt-hero md:pb-24">
      <Container className="max-w-3xl text-center">
        <MotionSection as="div" className="space-y-6">
          <MotionItem>
            <HeadingTag className="font-heading text-4xl font-semibold leading-[3rem] md:text-5xl md:leading-[3.5rem]">
              Services tailored to strategy, performance, and real outcomes
            </HeadingTag>
          </MotionItem>
          <MotionItem delay={0.08}>
            <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
              Your website is only as strong as the strategy behind it. That’s why our services focus
              on design, usability, and performance — making sure your online presence isn’t just
              seen, but remembered.
            </p>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
