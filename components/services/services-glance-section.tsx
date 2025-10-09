import { Code2, GaugeCircle, LineChart, Radar, Repeat } from 'lucide-react';

import { Container } from '@/components/ui/container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const glanceServices = [
  {
    icon: Code2,
    title: 'Custom Development',
    description: 'Fully coded websites with zero templates.'
  },
  {
    icon: GaugeCircle,
    title: 'UX & UI Design',
    description: 'Intuitive layouts that keep users engaged.'
  },
  {
    icon: LineChart,
    title: 'SEO-Ready Builds',
    description: 'Fast, structured, and optimized from day one.'
  },
  {
    icon: Radar,
    title: 'Analytics & Reporting',
    description: 'Clear insights to track performance.'
  },
  {
    icon: Repeat,
    title: 'Ongoing Support',
    description: 'Flexible plans to keep your site growing.'
  }
];

export function ServicesGlanceSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-10">
        <div className="text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">Services at a Glance</h2>
          <p className="mt-3 text-lg text-[var(--pv-text-muted)]">
            Every engagement includes the strategy, execution, and follow-through needed to sustain
            growth.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {glanceServices.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="group flex h-full flex-col justify-between overflow-hidden border border-[var(--pv-border)] bg-[var(--pv-surface)]/80 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)] hover:shadow-[0_28px_55px_-40px_rgba(63,0,233,0.8)] dark:bg-[var(--pv-bg)]/70"
            >
              <CardHeader className="flex flex-col gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_22px_42px_-32px_rgba(63,0,233,0.85)]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="mt-auto flex flex-col gap-4 text-sm text-[var(--pv-text-muted)]">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--pv-primary)]/40 to-transparent" />
                <p>
                  Backed by our UX-first approach, we align every deliverable to measurable business
                  outcomes so you know what works and why.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
