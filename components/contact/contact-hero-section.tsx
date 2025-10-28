import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export interface ContactHeroSectionProps {
  heading?: string;
  subtitle?: string;
}

export function ContactHeroSection({
  heading,
  subtitle,
}: ContactHeroSectionProps = {}) {
  const effectiveHeading = heading ?? "Let's Start Your Project";
  const effectiveSubtitle =
    subtitle ??
    'Tell us where you want to take the brand next and we will follow up within one business day.';

  return (
    <section className="pt-hero pb-12 md:pb-16">
      <Container className="max-w-3xl space-y-6 text-center">
        <MotionSection as="div" className="space-y-6">
          <MotionItem>
            <h1 className="text-4xl font-semibold leading-[3rem] md:text-5xl md:leading-[3.5rem]">
              {effectiveHeading}
            </h1>
          </MotionItem>
          <MotionItem delay={0.08}>
            <div className="mx-auto h-1 w-24 rounded-full bg-[var(--pv-gradient)]" aria-hidden />
          </MotionItem>
          {effectiveSubtitle && (
            <MotionItem delay={0.15}>
              <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">{effectiveSubtitle}</p>
            </MotionItem>
          )}
        </MotionSection>
      </Container>
    </section>
  );
}
