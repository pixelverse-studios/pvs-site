import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { websitePackages as websitePackageData } from '@/data/packages';

import { Container } from './container';

const packages = websitePackageData.map((pkg) => ({
  id: pkg.id,
  title: pkg.name,
  summary: pkg.summary,
  price: pkg.price,
  ideal: pkg.ideal,
  support: pkg.support,
  highlights: pkg.includes.slice(0, 3)
}));

export function PackagesSection() {
  return (
    <section className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)]">
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-[2.5rem] leading-[3.125rem] text-[var(--pv-text)]">
            Packages snapshot
          </h2>
          <p className="mt-4 text-lg text-[var(--pv-text-muted)]">
            Choose the engagement level that matches your goals. Every package is rooted in strategy, performance, and impact.
          </p>
        </div>
        <div className="mt-12 -mx-6 overflow-x-auto pb-4 md:mx-0 md:overflow-visible md:pb-0">
          <div className="flex gap-6 px-6 md:grid md:grid-cols-2 md:px-0 xl:grid-cols-4">
            {packages.map((pkg) => {
              const [primaryTitle, secondaryTitle] = pkg.title.split(' – ');

              return (
                <Card
                  key={pkg.id}
                  className="grid min-w-[280px] grid-rows-[auto,1fr,auto] border border-[var(--pv-border)] bg-[var(--pv-bg)]/95 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--pv-primary)] hover:shadow-pv md:min-w-0"
                >
                  <CardHeader className="grid gap-4 border-b border-[var(--pv-border)] pb-6">
                    <div className="space-y-2 min-h-[92px]">
                      <CardTitle className="text-xl leading-7 text-[var(--pv-text)]">
                        <span className="block">{primaryTitle}</span>
                        {secondaryTitle && (
                          <span className="block text-base font-medium text-[var(--pv-text-muted)]">
                            {secondaryTitle}
                          </span>
                        )}
                      </CardTitle>
                      <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--pv-text-muted)]">
                        {pkg.price}
                      </p>
                    </div>
                    <CardDescription className="min-h-[88px] text-sm leading-6">
                      {pkg.summary}
                    </CardDescription>
                    <p className="flex min-h-[64px] items-end text-xs uppercase tracking-[0.18em] text-[var(--pv-text-muted)]">
                      <span>Best for: {pkg.ideal}</span>
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 py-6 text-sm leading-6 text-[var(--pv-text-muted)]">
                    <ul className="flex flex-1 flex-col gap-3">
                      {pkg.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-3">
                          <span className="mt-1 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--pv-primary)]" aria-hidden />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="rounded-pv-sm border border-[var(--pv-border)]/80 bg-[var(--pv-surface)]/80 px-3 py-2 text-xs uppercase tracking-[0.18em] text-[var(--pv-text-muted)]">
                      Support cadence: {pkg.support.cadence}
                    </p>
                  </CardContent>
                  <CardFooter className="border-t border-[var(--pv-border)] pt-4">
                    <Button asChild variant="link" className="px-0 text-sm font-semibold">
                      <Link href={`/packages#${pkg.id}`}>Learn more</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
