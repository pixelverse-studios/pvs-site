import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export interface Testimonial {
  /** The testimonial quote */
  quote: string;
  /** Name of the person giving the testimonial */
  name: string;
  /** Role or title of the person */
  role: string;
  /** Optional company name */
  company?: string;
}

export interface ServiceTestimonialProps {
  /** Optional eyebrow text above the heading */
  eyebrow?: string;
  /** Optional section heading */
  heading?: string;
  /** The testimonial content */
  testimonial: Testimonial;
  /** Optional stat to display alongside */
  stat?: {
    value: string;
    label: string;
  };
}

export function ServiceTestimonial({
  eyebrow,
  heading,
  testimonial,
  stat,
}: ServiceTestimonialProps) {
  const hasHeading = eyebrow || heading;

  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-5xl">
        <MotionSection as="div" className="space-y-10">
          {hasHeading && (
            <MotionItem className="space-y-4 text-center">
              {eyebrow && (
                <span className="text-sm uppercase tracking-[0.3em] text-[var(--pv-text-muted)]">
                  {eyebrow}
                </span>
              )}
              {heading && (
                <h2 className="font-heading text-3xl font-semibold md:text-4xl">{heading}</h2>
              )}
            </MotionItem>
          )}
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] lg:items-center">
            <MotionItem delay={0.08}>
              <blockquote className="bg-[var(--pv-surface)]/80 dark:bg-[var(--pv-surface)]/90 space-y-6 rounded-pv border border-[var(--pv-border)] p-8 shadow-[0_24px_60px_-40px_rgba(63,0,233,0.4)]">
                <p className="text-lg leading-8 text-[var(--pv-text-muted)] md:text-xl md:leading-9">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <footer className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-[var(--pv-border)]" />
                  <div className="text-right">
                    <p className="font-semibold text-[var(--pv-text)]">{testimonial.name}</p>
                    <p className="text-sm text-[var(--pv-text-muted)]">
                      {testimonial.role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </p>
                  </div>
                </footer>
              </blockquote>
            </MotionItem>
            {stat && (
              <MotionItem delay={0.16}>
                <div className="border-[var(--pv-primary)]/40 flex flex-col items-center justify-center rounded-pv border bg-[linear-gradient(135deg,rgba(63,0,233,0.08),rgba(201,71,255,0.05))] px-8 py-10 text-center shadow-[0_24px_60px_-40px_rgba(63,0,233,0.45)]">
                  <span className="font-heading text-5xl font-semibold text-[var(--pv-primary)] md:text-6xl">
                    {stat.value}
                  </span>
                  <span className="mt-3 text-sm uppercase tracking-[0.24em] text-[var(--pv-text-muted)]">
                    {stat.label}
                  </span>
                </div>
              </MotionItem>
            )}
          </div>
        </MotionSection>
      </Container>
    </section>
  );
}
