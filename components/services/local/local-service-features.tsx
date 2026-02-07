import { Container } from '@/components/ui/container';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import type { LocalServicePageDefinition } from '@/data/local-service-pages';

interface LocalServiceFeaturesProps {
  features: LocalServicePageDefinition['content']['features'];
  serviceName: string;
  city: string;
}

export function LocalServiceFeatures({ features, serviceName, city }: LocalServiceFeaturesProps) {
  return (
    <section className="bg-[var(--pv-bg)] py-16 md:py-24">
      <Container className="space-y-12">
        <MotionSection as="div" className="space-y-12">
          <MotionItem>
            <SectionHeader
              align="center"
              eyebrow="What We Deliver"
              title={`${serviceName} for ${city} Businesses`}
              description={`Tailored ${(serviceName || 'digital marketing').toLowerCase()} services designed for the unique needs of ${city} businesses and their target audiences.`}
              className="mx-auto max-w-3xl"
            />
          </MotionItem>
          <MotionSection as="div" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" delay={0.12}>
            {features.map((feature, index) => (
              <MotionItem key={feature.title} delay={index * 0.08} triggerOnViewport={false}>
                <Card className="group h-full border-[var(--pv-border)]/80 bg-[var(--pv-surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)] hover:shadow-[0_24px_50px_-36px_rgba(63,0,233,0.6)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <p className="text-sm leading-6 text-[var(--pv-text-muted)]">
                      {feature.description}
                    </p>
                    <div className="rounded-md border-l-2 border-[var(--pv-primary)]/40 bg-[var(--pv-primary)]/5 py-2 pl-3 pr-2">
                      <p className="text-xs leading-5 text-[var(--pv-text-muted)]">
                        <span className="font-medium text-[var(--pv-primary)]">{city}:</span>{' '}
                        {feature.localAngle}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </MotionItem>
            ))}
          </MotionSection>
        </MotionSection>
      </Container>
    </section>
  );
}
