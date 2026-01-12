import { Container } from '@/components/ui/container';
import { SectionHeader } from '@/components/ui/section-header';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import type { LocalServicePageDefinition } from '@/data/local-service-pages';

interface LocalServiceIntroProps {
  intro: LocalServicePageDefinition['content']['intro'];
  city: string;
}

export function LocalServiceIntro({ intro, city }: LocalServiceIntroProps) {
  return (
    <section className="bg-[var(--pv-surface)] py-16 md:py-24">
      <Container className="max-w-4xl">
        <MotionSection as="div" className="space-y-8 text-center">
          <MotionItem>
            <SectionHeader
              align="center"
              eyebrow={city}
              title={intro.heading}
              className="mx-auto max-w-3xl"
            />
          </MotionItem>
          <MotionItem delay={0.08}>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-[var(--pv-text-muted)]">
              {intro.body}
            </p>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
