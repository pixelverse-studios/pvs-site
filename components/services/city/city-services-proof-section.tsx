import { CityServicePageDefinition } from '@/data/services-city-pages';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

interface CityServicesProofSectionProps {
  proof: CityServicePageDefinition['proof'];
  city: string;
}

export function CityServicesProofSection({ proof, city }: CityServicesProofSectionProps) {
  const hasTestimonial = Boolean(proof.testimonial);

  const statCard = (
    <MotionItem
      delay={0.16}
      className="border-[var(--pv-primary)]/40 flex items-baseline gap-4 rounded-pv border bg-[linear-gradient(135deg,rgba(63,0,233,0.08),rgba(201,71,255,0.05))] px-6 py-5 shadow-[0_24px_60px_-40px_rgba(63,0,233,0.45)]"
    >
      <span className="font-heading text-5xl font-semibold text-[var(--pv-primary)]">
        {proof.stat.value}
      </span>
      <span className="text-sm uppercase tracking-[0.24em] text-[var(--pv-text-muted)]">
        {proof.stat.label}
      </span>
    </MotionItem>
  );

  const textColumn = (includeStatInline: boolean) => (
    <MotionSection as="div" className="space-y-6">
      <MotionItem>
        <span className="text-sm uppercase tracking-[0.3em] text-[var(--pv-text-muted)]">
          Proof in {city}
        </span>
      </MotionItem>
      <MotionItem delay={0.08}>
        <h2 className="font-heading text-3xl font-semibold md:text-4xl">{proof.headline}</h2>
      </MotionItem>
      <MotionItem delay={0.12}>
        <p className="text-lg leading-8 text-[var(--pv-text-muted)]">{proof.body}</p>
      </MotionItem>
      {includeStatInline ? statCard : null}
    </MotionSection>
  );

  if (hasTestimonial) {
    return (
      <section className="py-16 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr),minmax(0,1fr)] lg:items-center">
          {textColumn(true)}
          <MotionItem delay={0.2}>
            <blockquote className="bg-[var(--pv-surface)]/80 dark:bg-[var(--pv-surface)]/90 space-y-4 rounded-pv border border-[var(--pv-border)] p-6 text-[var(--pv-text-muted)] shadow-[0_24px_60px_-40px_rgba(63,0,233,0.4)]">
              <p className="text-lg leading-8">&ldquo;{proof.testimonial?.quote}&rdquo;</p>
              <footer className="text-[var(--pv-text-muted)]/80 text-sm uppercase tracking-[0.18em]">
                {proof.testimonial?.name} &mdash; {proof.testimonial?.role}
              </footer>
            </blockquote>
          </MotionItem>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <Container className="gap-12 lg:grid lg:max-w-5xl lg:grid-cols-2 lg:items-center">
        {textColumn(false)}
        <MotionItem delay={0.18} className="flex justify-center lg:justify-end">
          <div className="border-[var(--pv-primary)]/40 w-full max-w-sm rounded-pv border bg-[linear-gradient(135deg,rgba(63,0,233,0.08),rgba(201,71,255,0.05))] px-6 py-5 text-left shadow-[0_24px_60px_-40px_rgba(63,0,233,0.45)]">
            <span className="font-heading text-5xl font-semibold text-[var(--pv-primary)]">
              {proof.stat.value}
            </span>
            <div className="mt-3 text-sm uppercase tracking-[0.24em] text-[var(--pv-text-muted)]">
              {proof.stat.label}
            </div>
          </div>
        </MotionItem>
      </Container>
    </section>
  );
}
