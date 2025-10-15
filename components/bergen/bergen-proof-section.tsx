import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { SectionHeader } from '@/components/ui/section-header';

const testimonials = [
  {
    quote:
      'PixelVerse rebuilt our medical group site with HIPAA-compliant intake flows and schema that doubled appointment requests within three months.',
    author: 'Laura M., Practice Director, Hackensack'
  },
  {
    quote:
      'Our Paramus retail campaigns finally load fast on mobile. We can launch seasonal promos in hours instead of days, and organic traffic is climbing.',
    author: 'Marcus P., Head of Ecommerce, Paramus'
  }
];

const proofPoints = [
  {
    label: 'Custom engineering, no templates',
    detail:
      'PixelVerse ships fully bespoke Next.js systems—performance budgets, accessibility, and editorial flexibility baked in.'
  },
  {
    label: 'SEO + content operations handled',
    detail:
      'Keyword research, structured data, and content cadences executed for every Bergen town you target, not just site launch.'
  },
  {
    label: 'CRO + analytics on repeat',
    detail:
      'SiteBehaviour dashboards, testing roadmaps, and executive reporting so you can prove ROI continuously.'
  }
];

export function BergenProofSection() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <MotionSection className="space-y-12">
          <MotionItem>
            <SectionHeader
              align="center"
              eyebrow="Why PixelVerse works here"
              title="Our proven service mix, applied to Bergen County goals"
              description="Custom engineering, strategic SEO, and ongoing optimization—the pillars clients hire PixelVerse for—directed at the audiences and search demand in North Jersey."
            />
          </MotionItem>
          <MotionItem className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-6">
              {proofPoints.map((point) => (
                <div
                  key={point.label}
                  className="rounded-pv border border-[var(--pv-border)] bg-[var(--pv-surface)] p-6 shadow-pv"
                >
                  <h3 className="font-heading text-2xl">{point.label}</h3>
                  <p className="mt-3 text-base text-[var(--pv-text-muted)]">{point.detail}</p>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {testimonials.map((testimonial) => (
                <figure
                  key={testimonial.author}
                  className="rounded-pv-lg border border-[var(--pv-border)] bg-[var(--pv-surface)] p-8 shadow-pv"
                >
                  <blockquote className="text-lg text-[var(--pv-text)]">
                    “{testimonial.quote}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-[var(--pv-text-muted)]">
                    {testimonial.author}
                  </figcaption>
                </figure>
              ))}
            </div>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
