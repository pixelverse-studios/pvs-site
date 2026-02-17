import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { aboutContent } from '@/data/about';

export function AboutHeroSection() {
  const { eyebrow, title, description } = aboutContent.hero;
  const paragraphs = description.split('\n\n');

  return (
    <section className="bg-[var(--pv-surface)] pb-16 pt-hero md:pb-24 md:pt-hero">
      <Container className="flex max-w-3xl flex-col items-center gap-8 text-center">
        <MotionSection as="div" className="flex w-full flex-col items-center gap-8 text-center">
          <MotionItem>
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
              {eyebrow}
            </span>
          </MotionItem>

          <MotionItem delay={0.1} className="space-y-6">
            <h1 className="font-heading text-4xl font-semibold leading-[3rem] md:text-5xl md:leading-[3.5rem]">
              {title}
            </h1>
            <div className="space-y-4">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-[1.0625rem] leading-[1.7] text-[var(--pv-text-muted)] md:text-lg md:leading-[1.8]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
