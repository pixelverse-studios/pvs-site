import Link from 'next/link';

import { Container } from '@/components/ui/container';
import { SectionHeader } from '@/components/ui/section-header';

const priorityCities = [
  {
    name: 'Fort Lee',
    slug: 'fort-lee',
    description: 'GW Bridge corridor — restaurants, law firms, medical practices, and a thriving Korean business community.',
  },
  {
    name: 'Englewood',
    slug: 'englewood',
    description: 'Palisade Avenue commercial district — healthcare, boutique retail, and professional services.',
  },
  {
    name: 'Hackensack',
    slug: 'hackensack',
    description: 'Bergen County seat — HUMC healthcare ecosystem, courthouse legal market, and Route 17 retail.',
  },
  {
    name: 'Paramus',
    slug: 'paramus',
    description: 'NJ\'s retail capital — Garden State Plaza, Route 4 and Route 17 commercial corridors.',
  },
  {
    name: 'Ridgewood',
    slug: 'ridgewood',
    description: 'The Village downtown — independent boutiques, farm-to-table restaurants, and premium professional services.',
  },
];

export function AreasWeServeSection() {
  return (
    <section className="bg-[var(--pv-surface)] py-16 md:py-24">
      <Container>
        <SectionHeader
          align="center"
          eyebrow="Areas We Serve"
          title="Bergen County Web Design & SEO"
          description="We work with businesses across Bergen County, NJ. Based in Cliffside Park, we bring local market knowledge to every project."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {priorityCities.map((city) => (
            <Link
              key={city.slug}
              href={`/areas/bergen-county/${city.slug}`}
              className="group rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <h3 className="font-heading text-lg font-semibold group-hover:text-[var(--pv-primary)]">
                {city.name}, NJ
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--pv-text-muted)]">
                {city.description}
              </p>
            </Link>
          ))}
          <Link
            href="/areas/bergen-county"
            className="group flex items-center justify-center rounded-pv border border-dashed border-[var(--pv-border)] p-5 transition-all hover:border-[var(--pv-primary)] hover:bg-[var(--pv-bg)]"
          >
            <span className="text-sm font-semibold text-[var(--pv-primary)] group-hover:underline">
              View all Bergen County areas &rarr;
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
