import { BarChart3, Layers, MonitorSmartphone, Search, Wrench } from 'lucide-react';

import { Container } from '@/components/ui/container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';

const services = [
  {
    icon: MonitorSmartphone,
    title: 'Custom Web Design & Development',
    description: 'Fully coded, zero templates.'
  },
  {
    icon: Layers,
    title: 'UX & UI Design',
    description: 'Intuitive, user-friendly experiences that keep visitors engaged.'
  },
  {
    icon: Search,
    title: 'SEO-Ready Foundations',
    description: 'Structured for visibility and fast load times.'
  },
  {
    icon: BarChart3,
    title: 'Performance & Analytics',
    description: 'Track performance with detailed reporting.'
  },
  {
    icon: Wrench,
    title: 'Ongoing Support & Updates',
    description: 'Maintenance and scalability over time.'
  }
];

export function ServicesCoreSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-12">
        <SectionHeader
          align="center"
          eyebrow="Core Services"
          title="Services That Power Your Growth"
          description="Strategic capabilities that move beyond surface-level design to deliver measurable, scalable results."
          className="mx-auto max-w-3xl"
        />
        <div className="grid gap-6 md:grid-cols-2">
          {services.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="group flex h-full flex-col overflow-hidden border border-[var(--pv-border)]/80 bg-[var(--pv-bg)]/90 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)] hover:shadow-[0_24px_50px_-36px_rgba(63,0,233,0.75)] dark:bg-[var(--pv-surface)]/90"
            >
              <CardHeader className="flex flex-row items-start gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_18px_38px_-28px_rgba(63,0,233,0.9)] transition-transform duration-300 group-hover:-translate-y-1">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-[var(--pv-text-muted)]">
                Bring together thoughtful strategy and custom build quality so every release ships
                faster, performs better, and adapts as you grow.
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
