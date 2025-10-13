import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const addons = [
  {
    title: 'Extra Pages',
    price: 'Starting at $150',
    description: 'Add focused landing pages or campaign hubs that plug into your component system without derailing timelines.'
  },
  {
    title: 'Local SEO Boosts',
    price: '$200–$250',
    description: 'Strengthen map pack visibility with localized schema, review prompts, and service area tuning.'
  },
  {
    title: 'Content Refresh & Audits',
    price: 'From $400',
    description: 'Refresh high-value pages with updated copy, UX tweaks, and the latest keyword insights.'
  }
];

export function AddonsSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-8">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">Add-Ons &amp; Extras</h2>
          <p className="text-lg text-[var(--pv-text-muted)]">
            Extend your build with tailored enhancements that keep momentum going post-launch.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {addons.map((addon) => (
            <Card
              key={addon.title}
              className="group flex flex-col border border-[var(--pv-border)] bg-[var(--pv-surface)]/80 shadow-pv transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)] dark:bg-[var(--pv-bg)]/80"
            >
              <CardHeader className="space-y-3 border-b border-[var(--pv-border)] pb-5">
                <CardTitle className="text-xl font-semibold text-[var(--pv-text)]">
                  {addon.title}
                </CardTitle>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--pv-text-muted)]">
                  {addon.price}
                </p>
              </CardHeader>
              <CardContent className="flex-1 space-y-3 pt-5 text-sm leading-6 text-[var(--pv-text-muted)]">
                <p>{addon.description}</p>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--pv-text-muted)]">
                  Turnaround: 1–2 weeks
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
