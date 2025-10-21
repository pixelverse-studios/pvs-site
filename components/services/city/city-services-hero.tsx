import { CityServicePageDefinition } from '@/data/services-city-pages';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

interface CityServicesHeroProps {
  hero: CityServicePageDefinition['hero'];
}

export function CityServicesHero({ hero }: CityServicesHeroProps) {
  return (
    <section className="bg-[var(--pv-bg)] pb-12 pt-hero md:pb-16">
      <Container className="mx-auto max-w-5xl">
        <MotionSection as="div" className="grid gap-10 md:grid-cols-[minmax(0,1.35fr),minmax(0,1fr)] md:items-center">
          <div className="space-y-6">
            <MotionItem>
              <span className="text-sm uppercase tracking-[0.3em] text-[var(--pv-text-muted)]">
                {hero.eyebrow}
              </span>
            </MotionItem>
            <MotionItem delay={0.08}>
              <h1 className="font-heading text-4xl font-semibold leading-[3rem] md:text-5xl md:leading-[3.5rem]">
                {hero.heading}
              </h1>
            </MotionItem>
            <MotionItem delay={0.12}>
              <p className="text-lg leading-8 text-[var(--pv-text-muted)] md:text-xl md:leading-9">
                {hero.description}
              </p>
            </MotionItem>
            <MotionItem delay={0.16}>
              <ul className="space-y-3 text-base leading-7 text-[var(--pv-text-muted)]">
                {hero.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-3">
                    <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-[var(--pv-primary)]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </MotionItem>
          </div>
          <MotionItem delay={0.18}>
            <div className="space-y-6 rounded-pv border border-[var(--pv-border)] bg-[var(--pv-surface)]/70 p-6 shadow-[0_24px_60px_-40px_rgba(63,0,233,0.35)] dark:bg-[var(--pv-surface)]/80">
              <div className="flex flex-col gap-3">
                <span className="text-sm uppercase tracking-[0.24em] text-[var(--pv-text-muted)]">
                  {hero.stat.heading}
                </span>
                <span className="font-heading text-5xl font-semibold leading-none text-[var(--pv-primary)]">
                  {hero.stat.value}
                </span>
                <span className="text-sm leading-6 text-[var(--pv-text-muted)]">{hero.stat.label}</span>
              </div>
              <p className="text-sm leading-7 text-[var(--pv-text-muted)]">{hero.neighborhoods}</p>
            </div>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
