import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { websitePackages as websitePackageData } from '@/data/packages';

import { Container } from './container';

const packages = websitePackageData.map((pkg) => ({
  id: pkg.id,
  level: pkg.level,
  name: pkg.name,
  summary: pkg.summary,
  price: pkg.price,
  ideal: pkg.ideal,
  support: pkg.support,
  highlights: pkg.includes.slice(0, 3),
}));

export function PackagesSection() {
  return (
    <section className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)]">
      <Container className="py-16 md:py-24">
        <MotionSection as="div" className="space-y-12">
          <MotionItem className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-[2.5rem] leading-[3.125rem] text-[var(--pv-text)]">
              Packages snapshot
            </h2>
            <p className="mt-4 text-lg text-[var(--pv-text-muted)]">
              Choose the engagement level that matches your goals. Every package is rooted in
              strategy, performance, and impact.
            </p>
          </MotionItem>
          <MotionItem className="md:mx-0">
            <MotionSection
              as="div"
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              delay={0.1}
            >
              {packages.map((pkg, index) => (
                <MotionItem key={pkg.id} delay={index * 0.08}>
                  <Card className="bg-[var(--pv-bg)]/95 flex h-full flex-col border border-[var(--pv-border)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--pv-primary)] hover:shadow-pv">
                    <CardHeader className="grid gap-4 border-b border-[var(--pv-border)] pb-6">
                      <div className="min-h-[92px] space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--pv-primary)] dark:text-[var(--pv-primary-2)]">
                          {pkg.level}
                        </p>
                        <CardTitle className="text-lg font-medium leading-7 text-[var(--pv-text)]">
                          {pkg.name}
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
                    <CardContent className="grid flex-1 grid-rows-[1fr_auto] gap-4 py-6 text-sm leading-6 text-[var(--pv-text-muted)]">
                      <ul className="space-y-3">
                        {pkg.highlights.map((highlight) => (
                          <li key={highlight} className="flex gap-3">
                            <span
                              className="inline-flex h-1.5 w-1.5 shrink-0 self-center rounded-full bg-[var(--pv-primary)]"
                              aria-hidden
                            />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="self-end">
                        <p className="border-[var(--pv-border)]/80 bg-[var(--pv-surface)]/80 rounded-pv-sm border px-3 py-2 text-xs uppercase tracking-[0.18em] text-[var(--pv-text-muted)]">
                          Support cadence: {pkg.support.cadence}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-[var(--pv-border)] pt-4">
                      <Button asChild variant="link" className="px-0 text-sm font-semibold">
                        <Link href={`/packages#${pkg.id}`}>Learn more</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </MotionItem>
              ))}
            </MotionSection>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
