import Link from 'next/link';

import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { SectionHeader } from '@/components/ui/section-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const towns = [
  {
    name: 'Hackensack',
    segment: 'Healthcare & Professional Services',
    summary:
      'Hospitals, medical groups, and law firms needing compliant experiences, appointment funnels, and legal keyword dominance.',
    highlights: ['HIPAA-ready forms & intake flows', 'Service-area schema & location landing pages'],
    href: '/bergen-county/hackensack-web-design'
  },
  {
    name: 'Fort Lee',
    segment: 'Hospitality & Luxury Services',
    summary:
      'Upscale hospitality, dining, and cross-border services looking for premium visual storytelling and bilingual UX.',
    highlights: ['High-impact visuals & animation polish', 'Multilingual content workflows + SEO'],
    href: '/bergen-county/fort-lee-web-design'
  },
  {
    name: 'Paramus',
    segment: 'Retail & Ecommerce',
    summary:
      'Retail flagships, malls, and dealerships that need conversion-ready promo pages and inventory updates at speed.',
    highlights: ['Promo page system with rapid publishing', 'POS/inventory integrations & CRO testing'],
    href: '/bergen-county/paramus-web-design'
  },
  {
    name: 'Ridgewood',
    segment: 'Boutique Retail & Dining',
    summary:
      'Boutique retailers and restaurants seeking immersive storytelling, community event coverage, and reservations.',
    highlights: ['CMS storytelling modules + event calendar', 'Accessibility & brand consistency audits'],
    href: '/bergen-county/ridgewood-web-design'
  },
  {
    name: 'Englewood',
    segment: 'Healthcare, Arts & SMB',
    summary:
      'Clinics, arts venues, and local businesses that require secure forms, ticketing, and CRM alignment.',
    highlights: ['Secure booking & ticketing integrations', 'Analytics dashboards for campaign ROI'],
    href: '/bergen-county/englewood-web-design'
  },
  {
    name: 'Teaneck',
    segment: 'Nonprofit & Education',
    summary:
      'Nonprofits, schools, and community orgs focused on accessibility, donation funnels, and staff-friendly CMS.',
    highlights: ['Donation funnels & CRM automation', 'Onboarding, documentation, and support retainers'],
    href: '/bergen-county/teaneck-web-design'
  }
];

export function BergenTownsSection() {
  return (
    <section className="bg-[var(--pv-surface)] py-16 md:py-24" id="bergen-towns">
      <Container>
        <MotionSection className="space-y-12">
          <MotionItem>
            <SectionHeader
              align="center"
              eyebrow="Town Coverage"
              title="Local depth without sacrificing the PixelVerse playbook"
              description="Each town campaign mirrors our core services—custom builds, SEO, CRO—while speaking directly to the industries and search terms that matter in that municipality."
            />
          </MotionItem>
          <MotionItem
            as="ul"
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {towns.map((town) => (
              <li key={town.name}>
                <Card className="group relative h-full overflow-hidden border-transparent bg-gradient-to-br from-white/80 to-white/20 p-[1px] shadow-[0_22px_44px_-28px_rgba(63,0,233,0.5)] transition-transform duration-300 hover:-translate-y-1 dark:from-[rgba(34,36,108,0.55)] dark:to-[rgba(34,36,108,0.2)]">
                  <div className="relative h-full rounded-pv bg-[var(--pv-surface)] p-6">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-pv bg-[radial-gradient(circle_at_top,var(--pv-primary)/18%,transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <CardHeader className="relative space-y-3 p-0">
                      <span className="inline-flex w-fit items-center rounded-full border border-[var(--pv-border)] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--pv-text-muted)] dark:bg-[color:var(--pv-overlay-soft)]">
                        {town.segment}
                      </span>
                      <CardTitle className="flex items-center justify-between gap-3 text-2xl">
                        <span>{town.name}</span>
                        <span className="text-sm font-medium text-[var(--pv-text-muted)]">New Jersey</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative mt-4 flex flex-col gap-6 p-0">
                      <p className="text-sm text-[var(--pv-text-muted)]">{town.summary}</p>
                      <ul className="space-y-2 text-sm text-[var(--pv-text)]">
                        {town.highlights.map((highlight) => (
                          <li key={highlight} className="flex gap-2">
                            <span
                              aria-hidden
                              className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-[var(--pv-primary)]"
                            />
                            <span className="text-[var(--pv-text-muted)]">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--pv-primary)] underline-offset-4 hover:underline"
                        href={town.href}
                      >
                        Explore {town.name} plan
                        <span aria-hidden className="text-base">→</span>
                      </Link>
                    </CardContent>
                  </div>
                </Card>
              </li>
            ))}
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
