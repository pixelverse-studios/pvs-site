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
      'County seat organizations—health systems, legal teams, and professional firms—needing compliant UX, intake flows, and authority-driven content.',
    highlights: ['ADA & HIPAA-ready form workflows', 'Multi-location service schema + intake tracking'],
    href: '/services/hackensack'
  },
  {
    name: 'Fort Lee',
    segment: 'Professional & Hospitality Brands',
    summary:
      'Law, medical, hospitality, and high-touch service firms competing with Manhattan agencies while serving Hudson River clientele.',
    highlights: ['Premium brand system & Manhattan-grade visuals', 'Cross-Hudson SEO with conversion analytics'],
    href: '/services/fort-lee'
  },
  {
    name: 'Cliffside Park',
    segment: 'Storefront & Service Operators',
    summary:
      'Salons, wellness studios, contractors, and restaurants lining Anderson Avenue that need booking-ready landing clusters and review velocity.',
    highlights: ['Service landing clusters + booking flows', 'Review prompts & GBP optimization at scale'],
    href: '/services/cliffside-park'
  },
  {
    name: 'Paramus',
    segment: 'Retail & Performance Marketing',
    summary:
      'Route 4/17 retailers, showrooms, and performance studios requiring promo agility, ecommerce readiness, and attribution clarity.',
    highlights: ['Promo + product landing templates', 'Dashboards tying in-store and digital conversions'],
    href: '/services/paramus'
  },
  {
    name: 'River Vale',
    segment: 'Home & Professional Services',
    summary:
      'Home improvement, financial, and professional partners serving Pascack Valley homeowners who demand trust-building content and fast follow-up.',
    highlights: ['Service area pages with persona storytelling', 'GA4 segmentation by neighborhood + campaign'],
    href: '/services/river-vale'
  },
  {
    name: 'Teaneck',
    segment: 'Healthcare, Campus & Civic',
    summary:
      'Holy Name, FDU, and township initiatives that require multilingual UX, ADA compliance, and analytics that keep stakeholders aligned.',
    highlights: ['Multilingual-ready UX + ADA compliance baked in', 'Analytics tying community + campus referrals to leads'],
    href: '/services/teaneck'
  },
  {
    name: 'Fair Lawn',
    segment: 'Industrial & Service Operators',
    summary:
      'Manufacturers, logistics teams, and Route 208 service brands balancing industrial proof with residential demand.',
    highlights: ['Industrial + residential landing variants', 'CRM + dispatch-integrated intake automation'],
    href: '/services/fair-lawn'
  },
  {
    name: 'Englewood',
    segment: 'Premium Healthcare & Retail',
    summary:
      'Englewood Health service lines, Palisade Avenue boutiques, and Englewood Cliffs innovators needing luxury-grade UX with measurable conversion paths.',
    highlights: ['Editorial-grade UI with decisive CTAs', 'Local SEO + schema for hospital, retail, and HQ launches'],
    href: '/services/englewood'
  },
  {
    name: 'Bergenfield',
    segment: 'Neighborhood Clinics & Programs',
    summary:
      'Medical offices, contractors, and after-school programs serving multigenerational households that research on mobile first.',
    highlights: ['Bilingual trust frameworks + review loops', 'Hyperlocal analytics by neighborhood and channel'],
    href: '/services/bergenfield'
  },
  {
    name: 'Ridgewood',
    segment: 'Boutique Services & Hospitality',
    summary:
      'Professional firms, private healthcare, and downtown boutiques needing white-glove presentation with CRO discipline.',
    highlights: ['Boutique UX components + premium storytelling', 'Attribution tying Ridgewood Guild events to bookings'],
    href: '/services/ridgewood'
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
