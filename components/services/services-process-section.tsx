import { Container } from '@/components/ui/container';

const steps = [
  {
    title: 'Plan',
    description: 'Align on goals, audience insights, and success metrics.',
  },
  {
    title: 'Design',
    description: 'Prototype experiences that balance story, usability, and conversion.',
  },
  {
    title: 'Build',
    description: 'Ship performant, fully coded systems ready for scale.',
  },
  {
    title: 'Grow',
    description: 'Measure, learn, and iterate with data-backed improvements.',
  },
];

export function ServicesProcessSection() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-pv-lg border border-[var(--pv-border)] bg-[linear-gradient(135deg,rgba(63,0,233,0.08),rgba(201,71,255,0.06))] p-[1px]">
          <div className="bg-[var(--pv-bg)]/90 dark:bg-[var(--pv-surface)]/90 rounded-[inherit] p-8 shadow-[0_40px_90px_-60px_rgba(63,0,233,0.65)] backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="text-sm uppercase tracking-[0.3em] text-[var(--pv-text-muted)]">
                Plan → Design → Build → Grow
              </span>
              <h2 className="max-w-2xl text-3xl font-semibold md:text-4xl">
                A streamlined process built for clarity, collaboration, and results.
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-4">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="bg-[var(--pv-surface)]/70 dark:bg-[var(--pv-bg)]/60 group cursor-default rounded-pv border border-[var(--pv-primary)] p-6 text-center shadow-[0_18px_40px_-36px_rgba(63,0,233,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(63,0,233,0.75)]"
                >
                  {/* <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--pv-gradient)] text-lg font-semibold text-white shadow-[0_25px_45px_-35px_rgba(63,0,233,0.85)]">
                    {index + 1}
                  </span> */}
                  <div className="mt-4 space-y-2">
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="text-sm text-[var(--pv-text-muted)]">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
