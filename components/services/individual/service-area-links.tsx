import Link from 'next/link';

import { Container } from '@/components/ui/container';
import {
  getValidCountySlugs,
  getCountyContent,
  getCitiesForCounty,
} from '@/data/area-pages-content';

const linkBaseClass =
  'inline-flex items-center rounded-md px-1.5 py-1 underline decoration-[var(--pv-border)] underline-offset-4 transition-colors hover:text-[var(--pv-primary)] hover:decoration-[var(--pv-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-surface)]';

export function ServiceAreaLinks() {
  const countySlugs = getValidCountySlugs();

  return (
    <section
      aria-label="Service areas"
      className="border-y border-[var(--pv-border)] bg-[var(--pv-surface)] py-12 md:py-16"
    >
      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--pv-text-muted)]">
            Service areas
          </p>
          <div className="flex flex-col gap-8">
            {countySlugs.map((countySlug) => {
              const county = getCountyContent(countySlug);
              if (!county) return null;
              const cities = getCitiesForCounty(countySlug);

              return (
                <div key={countySlug} className="flex flex-col items-center gap-4">
                  <p className="text-base leading-relaxed text-[var(--pv-text)] md:text-lg">
                    Serving{' '}
                    <Link
                      href={`/areas/${countySlug}`}
                      className={`font-semibold text-[var(--pv-text)] ${linkBaseClass}`}
                    >
                      {county.name}
                    </Link>
                  </p>
                  {cities.length > 0 && (
                    <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm md:text-base">
                      {cities.map((city, i) => (
                        <li key={city.slug} className="flex items-center gap-x-1">
                          <Link
                            href={`/areas/${countySlug}/${city.slug}`}
                            className={`text-[var(--pv-text-muted)] ${linkBaseClass}`}
                          >
                            {city.city}
                          </Link>
                          {i < cities.length - 1 && (
                            <span aria-hidden="true" className="text-[var(--pv-text-muted)]">
                              ·
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
