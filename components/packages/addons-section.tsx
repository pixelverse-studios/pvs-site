import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

const addons = [
  {
    title: 'Extra Pages',
    price: 'Starting at $150',
    description:
      'Add focused landing pages or campaign hubs that plug into your component system without derailing timelines.',
  },
  {
    title: 'Local SEO Boosts',
    price: '$200–$250',
    description:
      'Strengthen map pack visibility with localized schema, review prompts, and service area tuning.',
  },
  {
    title: 'Content Refresh & Audits',
    price: 'From $400',
    description:
      'Refresh high-value pages with updated copy, UX tweaks, and the latest keyword insights.',
  },
];

export function AddonsSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-8">
        <MotionSection as="div" className="space-y-3 text-center">
          <MotionItem>
            <h2 className="text-3xl font-semibold md:text-4xl">Add-Ons &amp; Extras</h2>
          </MotionItem>
          <MotionItem delay={0.08}>
            <p className="text-lg text-[var(--pv-text-muted)]">
              Extend your build with tailored enhancements that keep momentum going post-launch.
            </p>
          </MotionItem>
        </MotionSection>
        <MotionSection as="div" className="grid gap-6 md:grid-cols-3" delay={0.12}>
          {addons.map((addon, index) => (
            <MotionItem
              key={addon.title}
              delay={index * 0.08}
              triggerOnViewport={false}
              className="h-full"
            >
              <Card className="bg-[var(--pv-surface)]/80 dark:bg-[var(--pv-bg)]/80 group flex h-full flex-col border border-[var(--pv-border)] shadow-pv transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)]">
                <CardHeader className="space-y-3 border-b border-[var(--pv-border)] pb-5">
                  <CardTitle className="text-xl font-semibold text-[var(--pv-text)]">
                    {addon.title}
                  </CardTitle>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--pv-text-muted)]">
                    {addon.price}
                  </p>
                </CardHeader>
                <CardContent className="flex-1 space-y-4 pt-5 text-sm leading-6 text-[var(--pv-text-muted)]">
                  <p>{addon.description}</p>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-text)]">
                      Turnaround
                    </p>
                    <p className="text-sm font-medium text-[var(--pv-text-muted)]">1–2 weeks</p>
                  </div>
                </CardContent>
              </Card>
            </MotionItem>
          ))}
        </MotionSection>
      </Container>
    </section>
  );
}
