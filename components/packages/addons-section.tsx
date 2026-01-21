'use client';

import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { addonCategories, type Addon } from '@/data/addons';

function AddonCard({ addon, index }: { addon: Addon; index: number }) {
  return (
    <MotionItem
      key={addon.id}
      delay={index * 0.06}
      triggerOnViewport={false}
      className="h-full"
    >
      <Card className="bg-[var(--pv-surface)]/80 dark:bg-[var(--pv-bg)]/80 group flex h-full flex-col border border-[var(--pv-border)] shadow-pv transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)]">
        <CardHeader className="space-y-2 border-b border-[var(--pv-border)] pb-4">
          <CardTitle className="text-lg font-semibold text-[var(--pv-text)]">
            {addon.title}
          </CardTitle>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--pv-text-muted)]">
            {addon.price}
          </p>
        </CardHeader>
        <CardContent className="flex-1 pt-4 text-sm leading-6 text-[var(--pv-text-muted)]">
          <p>{addon.description}</p>
        </CardContent>
      </Card>
    </MotionItem>
  );
}

export function AddonsSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-12">
        {/* Section Header */}
        <MotionSection as="div" className="space-y-3 text-center">
          <MotionItem>
            <h2 className="text-3xl font-semibold md:text-4xl">Add-Ons &amp; Extras</h2>
          </MotionItem>
          <MotionItem delay={0.08}>
            <p className="mx-auto max-w-2xl text-lg text-[var(--pv-text-muted)]">
              Extend your build with tailored enhancements. Mix and match to fit your goals.
            </p>
          </MotionItem>
        </MotionSection>

        {/* Category Groups */}
        {addonCategories.map((category, categoryIndex) => (
          <MotionSection
            key={category.id}
            as="div"
            className="space-y-6"
            delay={0.12 + categoryIndex * 0.2}
          >
            {/* Category Header */}
            <MotionItem triggerOnViewport={false}>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
                  {category.label}
                </span>
                <span className="text-sm text-[var(--pv-text-muted)]">
                  {category.addons.length} {category.addons.length === 1 ? 'add-on' : 'add-ons'}
                </span>
              </div>
            </MotionItem>

            {/* Add-ons Grid */}
            <div
              className={`grid gap-5 ${
                category.addons.length <= 3
                  ? 'md:grid-cols-3'
                  : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}
            >
              {category.addons.map((addon, index) => (
                <AddonCard key={addon.id} addon={addon} index={index} />
              ))}
            </div>
          </MotionSection>
        ))}
      </Container>
    </section>
  );
}
