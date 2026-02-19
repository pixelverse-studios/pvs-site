import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

import { Container } from '@/components/ui/container';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent } from '@/components/ui/card';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import type { LocalServicePageDefinition, ServiceType } from '@/data/local-service-pages';
import { serviceDefinitions } from '@/data/local-service-pages';

interface LocalServiceRelatedProps {
  relatedCities?: LocalServicePageDefinition['relatedCities'];
  relatedServices?: LocalServicePageDefinition['relatedServices'];
  currentServiceSlug: ServiceType;
  currentCitySlug: string;
  currentCity: string;
}

export function LocalServiceRelated({
  relatedCities,
  relatedServices,
  currentServiceSlug,
  currentCitySlug,
  currentCity,
}: LocalServiceRelatedProps) {
  const hasRelatedCities = relatedCities && relatedCities.length > 0;
  const hasRelatedServices = relatedServices && relatedServices.length > 0;

  if (!hasRelatedCities && !hasRelatedServices) {
    return null;
  }

  return (
    <section className="bg-[var(--pv-surface)] py-16 md:py-24">
      <Container className="space-y-12">
        {/* Related cities for the same service */}
        {hasRelatedCities && (
          <MotionSection as="div" className="space-y-8">
            <MotionItem>
              <SectionHeader
                align="left"
                eyebrow="Nearby Cities"
                title={`${serviceDefinitions[currentServiceSlug].name} in Bergen County`}
                className="max-w-xl"
              />
            </MotionItem>
            <MotionSection as="div" className="grid gap-4 sm:grid-cols-2 md:grid-cols-3" delay={0.08}>
              {relatedCities.map((city, index) => (
                <MotionItem key={city.slug} delay={index * 0.06} triggerOnViewport={false}>
                  <Link href={`/services/${currentServiceSlug}/${city.slug}`}>
                    <Card className="group h-full border-[var(--pv-border)] bg-[var(--pv-bg)] transition-all duration-200 hover:border-[var(--pv-primary)] hover:shadow-md">
                      <CardContent className="flex items-center gap-3 p-4">
                        <MapPin className="h-4 w-4 shrink-0 text-[var(--pv-primary)]" />
                        <span className="font-medium text-[var(--pv-text)]">{city.city}</span>
                        <ArrowRight className="ml-auto h-4 w-4 text-[var(--pv-text-muted)] transition-transform group-hover:translate-x-1" />
                      </CardContent>
                    </Card>
                  </Link>
                </MotionItem>
              ))}
            </MotionSection>
          </MotionSection>
        )}

        {/* Related services in the same city */}
        {hasRelatedServices && (
          <MotionSection as="div" className="space-y-8">
            <MotionItem>
              <SectionHeader
                align="left"
                eyebrow="Other Services"
                title={`More Services in ${currentCity}`}
                className="max-w-xl"
              />
            </MotionItem>
            <MotionSection as="div" className={`grid gap-4 ${relatedServices.length > 1 ? 'sm:grid-cols-2' : ''}`} delay={0.08}>
              {relatedServices.map((serviceSlug, index) => {
                const service = serviceDefinitions[serviceSlug];
                return (
                  <MotionItem key={serviceSlug} delay={index * 0.06} triggerOnViewport={false}>
                    <Link href={`/services/${serviceSlug}/${currentCitySlug}`}>
                      <Card className="group h-full border-[var(--pv-border)] bg-[var(--pv-bg)] transition-all duration-200 hover:border-[var(--pv-primary)] hover:shadow-md">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <h3 className="font-medium text-[var(--pv-text)]">{service.name}</h3>
                              <p className="text-sm text-[var(--pv-text-muted)]">
                                {service.description}
                              </p>
                            </div>
                            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[var(--pv-text-muted)] transition-transform group-hover:translate-x-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </MotionItem>
                );
              })}
            </MotionSection>
          </MotionSection>
        )}
      </Container>
    </section>
  );
}
