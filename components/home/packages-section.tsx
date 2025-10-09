import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Container } from './container';

const packages = [
  {
    title: 'Core Lite',
    description: 'Get online quickly and affordably.'
  },
  {
    title: 'Core Starter',
    description: 'Build a solid professional presence.'
  },
  {
    title: 'Core Growth',
    description: 'Scale with advanced features.'
  },
  {
    title: 'Core Premium',
    description: 'Unlock custom solutions.'
  }
];

export function PackagesSection() {
  return (
    <section className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)]">
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-[2.5rem] leading-[3.125rem] text-[var(--pv-text)]">
            Packages snapshot
          </h2>
          <p className="mt-4 text-lg text-[var(--pv-text-muted)]">
            Choose the engagement level that matches your goals. Every package is rooted in strategy, performance, and polish.
          </p>
        </div>
        <div className="mt-12 -mx-6 overflow-x-auto pb-4 md:mx-0 md:overflow-visible md:pb-0">
          <div className="flex gap-6 px-6 md:grid md:grid-cols-4 md:px-0">
            {packages.map((pkg) => (
              <Card
                key={pkg.title}
                className="flex min-w-[260px] flex-col border border-[var(--pv-border)] bg-[var(--pv-bg)] transition duration-200 hover:border-[var(--pv-primary)] hover:shadow-pv"
              >
                <CardHeader>
                  <CardTitle>{pkg.title}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-[var(--pv-text-muted)]">
                  <p>
                    Benefit-led deliverables, transparent timelines, and measurable outcomes focused on momentum after launch.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="px-0">
                    Learn more
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
