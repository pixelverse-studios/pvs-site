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
  const paragraphs = (description || '')
    .split('\n\n')
    .filter(Boolean);

  return (
    <section
      className="bg-[var(--pv-surface)] pb-16 pt-hero md:pb-24 md:pt-hero"
      aria-labelledby={headingId}
    >
      <Container className="max-w-2xl text-center">
        <MotionSection as="div" className="space-y-6">
          <MotionItem>
            <h1
              id={headingId}
              className="font-heading text-4xl font-semibold leading-[3rem] md:text-5xl md:leading-[3.5rem]"
            >
              {title}
            </h1>
          </MotionItem>

          {paragraphs.map((paragraph, idx) => (
            <MotionItem key={`paragraph-${idx}`} delay={0.08 + idx * 0.06}>
              <p className="text-pretty text-lg text-[var(--pv-text-muted)] md:text-xl">
                {paragraph}
              </p>
            </MotionItem>
          ))}
        </MotionSection>
      </Container>
    </section>
  );
}
