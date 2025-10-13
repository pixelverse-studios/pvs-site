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
    description: 'Fully coded, zero templates.',
    body: 'Every build starts with a bespoke component system aligned to your brand, so design intent travels smoothly from Figma to production without compromises.',
    tags: ['Strategy + Build', 'Performance Budgeting']
  },
  {
    icon: Layers,
    title: 'UX & UI Design',
    description: 'Intuitive, user-friendly experiences that keep visitors engaged.',
    body: 'We map flows against user goals, layer in conversion-focused copy, and validate the journey with prototypes before a line of code ships.',
    tags: ['Journey Mapping', 'Conversion Copy']
  },
  {
    icon: Search,
    title: 'SEO-Ready Foundations',
    description: 'Structured for visibility and fast load times.',
    body: 'Semantic markup, structured data, and fast render speeds are engineered from the start so organic visibility grows without retrofits.',
    tags: ['Technical SEO', 'Schema Ready']
  },
  {
    icon: BarChart3,
    title: 'Performance & Analytics',
    description: 'Track performance with detailed reporting.',
    body: 'From GA4 to custom dashboards, we wire up the data you need to tie campaign performance to real revenue.',
    tags: ['Instrumentation', 'Insight Ready']
  },
  {
    icon: Wrench,
    title: 'Ongoing Support & Updates',
    description: 'Maintenance and scalability over time.',
    body: 'Experiment with new ideas, launch updates quickly, and keep the roadmap moving with a build partner that already knows your stack.',
    tags: ['Growth Sprints', 'Dedicated Partner']
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
          {services.map(({ icon: Icon, title, description, body, tags }) => (
            <Card
              key={title}
              className="group flex h-full flex-col overflow-hidden border border-[var(--pv-border)]/80 bg-[var(--pv-bg)]/90 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)] hover:shadow-[0_24px_50px_-36px_rgba(63,0,233,0.75)] dark:bg-[var(--pv-surface)]/90"
            >
              <CardHeader className="flex flex-row items-start gap-4 border-b border-[var(--pv-border)] pb-6">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_18px_38px_-28px_rgba(63,0,233,0.9)] transition-transform duration-300 group-hover:-translate-y-1">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="flex-1 space-y-3">
                  <CardTitle className="text-xl font-semibold text-[var(--pv-text)]">{title}</CardTitle>
                  <CardDescription className="text-sm leading-6 text-[var(--pv-text-muted)]">
                    {description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pt-6 text-sm leading-6 text-[var(--pv-text-muted)]">
                <p>{body}</p>
                <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-[var(--pv-text-muted)]">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--pv-border)] px-3 py-1 opacity-90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
