import Link from 'next/link';

import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const services = [
  {
    title: 'Custom Web Design',
    description:
      'Our signature custom builds—strategy, UX, and engineering—crafted for Bergen County audiences.',
    bullets: [
      'Discovery and UX workshops focused on Bergen buyer personas',
      'Next.js 14 frontends tuned for performance and accessibility',
      'Reusable component system matched to your brand and sales goals'
    ],
    href: '/services'
  },
  {
    title: 'Local SEO & Content',
    description:
      'Full-funnel SEO programs that keep PixelVerse sites ranking across Bergen towns.',
    bullets: [
      'Site architecture + copy mapped to town-level keyword intent',
      'Structured data, internal linking, and technical upkeep baked in',
      'Editorial calendars, FAQs, and lead magnets to fuel ongoing growth'
    ],
    href: '/packages#seo'
  },
  {
    title: 'Ongoing Support & CRO',
    description:
      'Hands-on optimization retainers that keep conversions climbing after launch.',
    bullets: [
      'Campaign landing page spins for retail, healthcare, and nonprofit pushes',
      'Accessibility, UX, and testing sprints guided by analytics',
      'SiteBehaviour dashboards, reporting, and executive-ready insights'
    ],
    href: '/packages#support'
  }
];

export function BergenServicesSection() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <MotionSection className="space-y-12">
          <MotionItem>
            <SectionHeader
              align="center"
              eyebrow="What we deliver"
              title="The PixelVerse service stack—simply tuned for Bergen County"
              description="Clients choose PixelVerse for custom engineering, measurable SEO, and conversion strategy. This is the same playbook, localized for Bergen County buyers and search demand."
            />
          </MotionItem>
          <MotionItem className="grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <Card key={service.title} className="flex h-full flex-col bg-[var(--pv-surface)]">
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-6">
                  <ul className="space-y-3 text-sm text-[var(--pv-text)] [&>li]:flex [&>li]:items-start [&>li]:gap-3">
                    {service.bullets.map((bullet) => (
                      <li key={bullet}>
                        <span
                          aria-hidden
                          className="mt-1 block h-2 w-2 flex-none rounded-full bg-[var(--pv-primary)]"
                        />
                        <span className="text-[var(--pv-text-muted)]">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    className="text-sm font-semibold text-[var(--pv-primary)] underline-offset-4 hover:underline"
                    href={service.href}
                  >
                    View details
                  </Link>
                </CardContent>
              </Card>
            ))}
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
