import { LifeBuoy, Palette, Search, Sparkles } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

import { Container } from './container';

const services = [
  {
    title: 'Custom Web Design & Development',
    summary: 'Tailored, fully coded websites with zero templates.',
    icon: Palette,
    highlights: [
      'Component libraries built for future campaigns.',
      'Launch-day QA across devices, browsers, and connection speeds.'
    ]
  },
  {
    title: 'UX & UI Design + Copywriting',
    summary: 'Every flow is mapped to user intent with narrative-led interface decisions.',
    icon: Sparkles,
    highlights: [
      'Message hierarchy that leads with outcomes, not features.',
      'Prototype reviews to align stakeholders before we ship a line of code.'
    ]
  },
  {
    title: 'SEO-Ready Foundations',
    summary: 'Structured for visibility with schema, speed, and clean markup from day one.',
    icon: Search,
    highlights: [
      'Technical health baked into every build, no bolt-on fixes later.',
      'Content models tuned for search intent and easy publishing.'
    ]
  },
  {
    title: 'Ongoing Support',
    summary: 'Flexible monthly partnerships to keep the site iterating with your business.',
    icon: LifeBuoy,
    highlights: [
      'Performance reviews with prioritized action items every cycle.',
      'Rapid experiments and updates handled by the team that built it.'
    ]
  }
];

export function ServicesSection() {
  return (
    <section className="border-b border-[var(--pv-border)] bg-[var(--pv-bg)]">
      <Container className="py-16 md:py-24">
        <MotionSection as="div" className="space-y-12">
          <MotionItem className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-[2.5rem] leading-[3.125rem] text-[var(--pv-text)]">
              Services snapshot
            </h2>
            <p className="mt-4 text-lg text-[var(--pv-text-muted)]">
              End-to-end support to design, launch, and scale a digital presence that mirrors the strength of your brand.
            </p>
          </MotionItem>
          <MotionSection as="div" className="grid gap-6 md:grid-cols-2" delay={0.1}>
            {services.map((service, index) => (
              <MotionItem key={service.title} delay={index * 0.08}>
                <Card
                  className="group flex h-full flex-col border-[var(--pv-border)] bg-[var(--pv-surface)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-pv"
                >
                  <CardHeader className="flex flex-col gap-4 border-b border-[var(--pv-border)] pb-6">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] text-[var(--pv-primary)] shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5">
                        <service.icon className="h-5 w-5" />
                      </span>
                      <CardTitle className="text-xl text-[var(--pv-text)]">{service.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm leading-6 text-[var(--pv-text-muted)]">
                      {service.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4 pt-6 text-sm leading-6 text-[var(--pv-text-muted)]">
                    <ul className="space-y-3">
                      {service.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-3">
                          <span className="inline-flex h-1.5 w-1.5 shrink-0 self-center rounded-full bg-[var(--pv-primary)]" aria-hidden />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="h-px w-full bg-[linear-gradient(90deg,transparent,var(--pv-primary)/40,transparent)]" aria-hidden />
                  </CardContent>
                </Card>
              </MotionItem>
            ))}
          </MotionSection>
        </MotionSection>
      </Container>
    </section>
  );
}
