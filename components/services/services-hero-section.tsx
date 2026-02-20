import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

interface ServicesHeroSectionProps {
  title: string;
  description: string;
}

export function ServicesHeroSection({
  title,
  description,
}: ServicesHeroSectionProps) {
  const headingId = 'services-hero-title';

  return (
    <section
      className="bg-[var(--pv-surface)] pb-16 pt-hero md:pb-24 md:pt-hero"
      aria-labelledby={headingId}
    >
      <Container className="text-center">
        <MotionSection as="div" className="mx-auto max-w-3xl space-y-6">
          <MotionItem>
            <h1
              id={headingId}
              className="font-heading text-4xl font-semibold leading-[3rem] md:text-5xl md:leading-[3.5rem]"
            >
              {title}
            </h1>
          </MotionItem>
          <MotionItem delay={0.08}>
            <p className="mx-auto max-w-2xl text-pretty text-lg text-[var(--pv-text-muted)] md:text-xl">
              {description}
            </p>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
