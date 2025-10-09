import { BarChart3, LineChart, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';

const seoPackages = [
  {
    icon: Search,
    title: 'SEO Starter',
    description: 'Build your search presence.'
  },
  {
    icon: LineChart,
    title: 'SEO Growth',
    description: 'Expand rankings and visibility.'
  },
  {
    icon: BarChart3,
    title: 'SEO Premium',
    description: 'Dominate your market.'
  }
];

export function SeoPackagesSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-10">
        <SectionHeader
          align="center"
          eyebrow="SEO Expansion"
          title="SEO Expansion Packages"
          description="Pair strategic content and technical optimization to expand your footprint and turn organic traffic into leads."
          className="mx-auto max-w-3xl"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {seoPackages.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="group flex flex-col border border-[var(--pv-border)] bg-[var(--pv-bg)]/95 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)] hover:shadow-[0_26px_60px_-40px_rgba(63,0,233,0.75)] dark:bg-[var(--pv-surface)]/95"
            >
              <CardHeader className="flex flex-row items-start gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_22px_46px_-34px_rgba(63,0,233,0.85)]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 text-sm text-[var(--pv-text-muted)]">
                Align technical foundations with on-page strategy, schema, and reporting to capture
                demand and climb search rankings sustainably.
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm" className="w-full">
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
