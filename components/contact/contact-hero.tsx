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
          <MotionItem delay={0.12}>
            <p className="mx-auto max-w-2xl text-pretty text-lg text-[var(--pv-text-muted)] md:text-xl">
              There&rsquo;s no generic intake form here. Choose the path that fits where you are
              right now, whether you&rsquo;re ready to share project details, want to talk
              through your situation on a call, or just want an honest review of your current site
              before making any decisions.
            </p>
          </MotionItem>
          <MotionItem delay={0.16}>
            <p className="mx-auto max-w-2xl text-pretty text-[var(--pv-text-muted)]">
              Most inquiries receive a response within one business day. We&rsquo;ll review your
              situation and follow up with a clear recommendation. Not a sales pitch.
            </p>
          </MotionItem>
          <MotionItem delay={0.2}>
            <p className="text-sm text-[var(--pv-text-muted)]">
              Based in Bergen County, NJ, serving businesses across New Jersey.
            </p>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
