import Link from 'next/link';
import { ArrowRight, BarChart3, MonitorSmartphone, Search, Wrench } from 'lucide-react';

import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

const primaryServices = [
  {
    icon: MonitorSmartphone,
    title: 'Custom Web Development',
    description: 'Fully coded, zero templates.',
    body: 'Every build starts with a bespoke component system aligned to your brand, so design intent travels smoothly from Figma to production without compromises.',
    tags: ['Strategy + Build', 'Performance'],
    href: '/services/web-development',
  },
  {
    icon: Search,
    title: 'SEO Services',
    description: 'Structured for visibility and organic growth.',
    body: 'Semantic markup, structured data, and fast render speeds are engineered from the start so organic visibility grows without retrofits.',
    tags: ['Technical SEO', 'Local SEO'],
    href: '/services/seo',
  },
];

const secondaryServices = [
  {
    icon: BarChart3,
    title: 'Performance & Analytics',
    description: 'Track performance with detailed reporting.',
    body: 'From GA4 to custom dashboards, we wire up the data you need to tie campaign performance to real revenue.',
  },
  {
    icon: Wrench,
    title: 'Ongoing Support & Updates',
    description: 'Maintenance and scalability over time.',
    body: 'Experiment with new ideas, launch updates quickly, and keep the roadmap moving with a build partner that already knows your stack.',
  },
];

export function ServicesCoreSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-16">
        {/* Primary Services */}
        <MotionSection className="space-y-12" as="div">
          <MotionItem>
            <SectionHeader
              align="center"
              eyebrow="Core Services"
              title="Services That Power Your Growth"
              description="Strategic capabilities that move beyond surface-level design to deliver measurable, scalable results."
              className="mx-auto max-w-3xl"
            />
          </MotionItem>
          <MotionSection as="div" className="grid gap-6 lg:grid-cols-3" delay={0.12}>
            {primaryServices.map(({ icon: Icon, title, description, body, tags, href }, index) => (
              <MotionItem
                key={title}
                delay={index * 0.08}
                triggerOnViewport={false}
                className="h-full"
              >
                <Link href={href} className="block h-full">
                  <Card className="border-[var(--pv-border)]/80 bg-[var(--pv-bg)]/90 dark:bg-[var(--pv-surface)]/90 group flex h-full flex-col overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)] hover:shadow-[0_24px_50px_-36px_rgba(63,0,233,0.75)]">
                    <CardHeader className="flex flex-row items-start gap-4 border-b border-[var(--pv-border)] pb-6">
                      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_18px_38px_-28px_rgba(63,0,233,0.9)] transition-transform duration-300 group-hover:-translate-y-1">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <div className="flex-1 space-y-2">
                        <CardTitle className="text-xl font-semibold text-[var(--pv-text)]">
                          {title}
                        </CardTitle>
                        <CardDescription className="text-sm leading-6 text-[var(--pv-text-muted)]">
                          {description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-4 pt-6">
                      <p className="flex-1 text-sm leading-6 text-[var(--pv-text-muted)]">{body}</p>
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
                      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-[var(--pv-primary)] transition-colors group-hover:text-[var(--pv-primary-2)]">
                        <span>Learn More</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </MotionItem>
            ))}
          </MotionSection>
        </MotionSection>

        {/* Secondary Services */}
        <MotionSection className="space-y-8" as="div" delay={0.2}>
          <MotionItem>
            <div className="text-center">
              <span className="inline-block rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
                Included With Every Project
              </span>
            </div>
          </MotionItem>
          <MotionSection as="div" className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2" delay={0.24}>
            {secondaryServices.map(({ icon: Icon, title, description, body }, index) => (
              <MotionItem
                key={title}
                delay={index * 0.08}
                triggerOnViewport={false}
                className="h-full"
              >
                <Card className="border-[var(--pv-border)]/60 bg-[var(--pv-surface)]/50 h-full border">
                  <CardHeader className="flex flex-row items-start gap-4 pb-4">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] text-[var(--pv-text-muted)]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="flex-1 space-y-1">
                      <CardTitle className="text-lg font-semibold text-[var(--pv-text)]">
                        {title}
                      </CardTitle>
                      <CardDescription className="text-sm text-[var(--pv-text-muted)]">
                        {description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm leading-6 text-[var(--pv-text-muted)]">{body}</p>
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
