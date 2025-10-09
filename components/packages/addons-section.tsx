import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const addons = [
  {
    title: 'Extra Pages',
    description: 'Starting at $150'
  },
  {
    title: 'Local SEO Boosts',
    description: '$200–$250'
  },
  {
    title: 'Content Refresh & Audits',
    description: 'From $400'
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
              className="border border-[var(--pv-border)] bg-[var(--pv-surface)]/80 shadow-pv transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)] dark:bg-[var(--pv-bg)]/80"
            >
              <CardHeader>
                <CardTitle>{addon.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-[var(--pv-text-muted)]">
                {addon.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
