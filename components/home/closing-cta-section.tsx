import { Button } from '@/components/ui/button';

import { Container } from './container';

export function ClosingCtaSection() {
  return (
    <section id="contact" className="bg-[var(--pv-bg)] py-16 md:py-24">
      <Container className="mx-auto max-w-3xl text-center space-y-6 rounded-pv border border-[var(--pv-border)] bg-[var(--pv-surface)] px-6 py-16 shadow-pv">
        <h2 className="font-heading text-[2.5rem] leading-[3.125rem] text-[var(--pv-text)]">
          Let’s create more than just a website — let’s build your digital future.
        </h2>
        <Button size="lg" variant="cta">
          Contact Us to Start Your Project
        </Button>
      </Container>
    </section>
  );
}
