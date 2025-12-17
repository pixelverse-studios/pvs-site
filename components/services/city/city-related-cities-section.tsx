import Link from 'next/link';
import { MapPin } from 'lucide-react';

import { CityServicePageDefinition } from '@/data/services-city-pages';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

interface CityRelatedCitiesSectionProps {
  currentCity: string;
  relatedCities: CityServicePageDefinition['relatedCities'];
}

export function CityRelatedCitiesSection({
  currentCity,
  relatedCities
}: CityRelatedCitiesSectionProps) {
  if (!relatedCities?.length) {
    return null;
  }

  return (
    <section className="py-12 md:py-16">
      <Container>
        <MotionSection as="div" delay={0.08}>
          <MotionItem>
            <div className="rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)]/50 p-6 md:p-8">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                <MapPin className="h-4 w-4" aria-hidden />
                <span>Also serving nearby Bergen County communities</span>
              </div>
              <p className="mt-2 text-sm text-[var(--pv-text-muted)]">
                Looking for web design and SEO services outside {currentCity}? We work with
                businesses across Bergen County.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {relatedCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/services/${city.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] px-4 py-2 text-sm font-medium text-[var(--pv-text)] transition-colors hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)]"
                  >
                    {city.city} web design & SEO
                  </Link>
                ))}
              </div>
            </div>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
