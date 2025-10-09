import { Container } from '@/components/ui/container';

export function FaqIntroSection() {
  return (
    <section className="bg-[var(--pv-surface)] pt-hero pb-16 md:pb-24">
      <Container className="max-w-3xl text-center">
        <div className="space-y-6 animate-in fade-in duration-500">
          <span className="inline-flex items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] px-4 py-1 text-xs uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
            FAQ
          </span>
          <h1 className="text-4xl font-semibold leading-[3rem] md:text-5xl md:leading-[3.5rem]">
            Questions, answered
          </h1>
          <p className="text-lg text-[var(--pv-text-muted)] md:text-xl">
            Choosing the right partner for your website is a big decision. These FAQs explain why
            our custom approach makes all the difference.
          </p>
        </div>
      </Container>
    </section>
  );
}
