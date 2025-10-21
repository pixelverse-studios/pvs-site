import { CityServicePageDefinition } from '@/data/services-city-pages';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { SectionHeader } from '@/components/ui/section-header';

interface CityServicesHighlightsProps {
  city: string;
  highlights: CityServicePageDefinition['serviceHighlights'];
}

export function CityServicesHighlights({ city, highlights }: CityServicesHighlightsProps) {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-12">
        <MotionItem>
          <SectionHeader
            align="center"
            eyebrow={`${city} service alignment`}
            title={`How our core services translate in ${city}`}
            description="Each capability from our services page earns its place in your local go-to-market. Here’s how it connects directly to the demand you’re chasing."
            className="mx-auto max-w-4xl"
          />
        </MotionItem>
        <MotionSection as="div" className="grid gap-6 md:grid-cols-2">
          {highlights.map(({ serviceTitle, summary, localAngle }, index) => (
            <MotionItem key={serviceTitle} delay={index * 0.08} className="h-full">
              <Card className="flex h-full flex-col border border-[var(--pv-primary)]/30 bg-[var(--pv-bg)]/95 shadow-[0_24px_50px_-40px_rgba(63,0,233,0.45)] transition-transform duration-300 hover:-translate-y-1 dark:bg-[var(--pv-surface)]/90">
                <CardHeader className="space-y-3 border-b border-[var(--pv-border)] pb-6">
                  <CardTitle className="text-lg font-semibold text-[var(--pv-text)]">
                    {serviceTitle}
                  </CardTitle>
                  <CardDescription className="text-sm leading-6 text-[var(--pv-text-muted)]">
                    {summary}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 text-sm leading-6 text-[var(--pv-text-muted)]">
                  {localAngle}
                </CardContent>
              </Card>
            </MotionItem>
          ))}
        </MotionSection>
      </Container>
    </section>
  );
}
