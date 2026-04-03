import Link from 'next/link';

import { Container } from '@/components/ui/container';
import {
  getValidCountySlugs,
  getCountyContent,
  getCitiesForCounty,
} from '@/data/area-pages-content';

export function ServiceAreaLinks() {
  const countySlugs = getValidCountySlugs();

  return (
    <section className="py-10 md:py-14">
      <Container>
        <div className="flex flex-col gap-3 text-sm text-[var(--pv-text-muted)]">
          {countySlugs.map((countySlug) => {
            const county = getCountyContent(countySlug);
            if (!county) return null;
            const cities = getCitiesForCounty(countySlug);

            return (
              <p key={countySlug}>
                <span>Serving </span>
                <Link
                  href={`/areas/${countySlug}`}
                  className="font-medium text-[var(--pv-text)] underline decoration-[var(--pv-border)] underline-offset-2 transition-colors hover:text-[var(--pv-primary)] hover:decoration-[var(--pv-primary)]"
                >
                  {county.name}
                </Link>
                <span>: </span>
                {cities.map((city, i) => (
                  <span key={city.slug}>
                    <Link
                      href={`/areas/${countySlug}/${city.slug}`}
                      className="underline decoration-[var(--pv-border)] underline-offset-2 transition-colors hover:text-[var(--pv-primary)] hover:decoration-[var(--pv-primary)]"
                    >
                      {city.city}
                    </Link>
                    {i < cities.length - 1 && <span> · </span>}
                  </span>
                ))}
              </p>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
