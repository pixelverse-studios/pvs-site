import { Container } from '@/components/ui/container';

export function ContactHeroSection() {
  return (
    <section className="pt-hero pb-12 md:pb-16">
      <Container className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl font-semibold leading-[3rem] md:text-5xl md:leading-[3.5rem]">
          Let&apos;s Start Your Project
        </h1>
        <div className="mx-auto h-1 w-24 rounded-full bg-[var(--pv-gradient)]" aria-hidden />
      </Container>
    </section>
  );
}
