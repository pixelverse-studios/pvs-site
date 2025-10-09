import { LifeBuoy, Palette, Search, Sparkles } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Container } from './container';

const services = [
  {
    title: 'Custom Web Design & Development',
    description: 'Tailored, fully coded websites with zero templates.',
    icon: Palette
  },
  {
    title: 'UX & UI Design + Copywriting',
    description: 'We don’t just design websites; we shape the entire experience.',
    icon: Sparkles
  },
  {
    title: 'SEO-Ready Foundations',
    description: 'Built to be found, with clear structures and fast load speeds.',
    icon: Search
  },
  {
    title: 'Ongoing Support',
    description: 'Flexible monthly plans to keep your site performing and growing.',
    icon: LifeBuoy
  }
];

export function ServicesSection() {
  return (
    <section className="border-b border-[var(--pv-border)] bg-[var(--pv-bg)]">
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-[2.5rem] leading-[3.125rem] text-[var(--pv-text)]">
            Services snapshot
          </h2>
          <p className="mt-4 text-lg text-[var(--pv-text-muted)]">
            End-to-end support to design, launch, and scale a digital presence that mirrors the strength of your brand.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <Card
              key={service.title}
              className="group h-full border-[var(--pv-border)] bg-[var(--pv-surface)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-pv"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] text-[var(--pv-primary)] shadow-sm">
                    <service.icon className="h-5 w-5" />
                  </span>
                  <CardTitle>{service.title}</CardTitle>
                </div>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
