import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export function ContactHero() {
  return (
    <section
      className="bg-[var(--pv-surface)] pb-16 pt-hero md:pb-24 md:pt-hero"
      aria-labelledby="contact-hero-title"
    >
      <Container className="text-center">
        <MotionSection as="div" className="mx-auto max-w-3xl space-y-6">
          <MotionItem>
            <h1
              id="contact-hero-title"
              className="font-heading text-4xl font-semibold leading-[3rem] md:text-5xl md:leading-[3.5rem]"
            >
              Let&rsquo;s Talk Through Your Situation
            </h1>
          </MotionItem>
          <MotionItem delay={0.08}>
            <p className="mx-auto max-w-2xl text-pretty text-lg text-[var(--pv-text-muted)] md:text-xl">
              Whether you&rsquo;re starting from scratch or improving an existing site, we begin by
              understanding your goals and identifying what will make the biggest difference.
            </p>
          </MotionItem>
          <MotionItem delay={0.16}>
            <p className="text-sm text-[var(--pv-text-muted)]">
              Based in Bergen County, NJ &mdash; serving businesses across New Jersey.
            </p>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
