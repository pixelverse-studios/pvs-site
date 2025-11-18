import { Container } from '@/components/ui/container';
import { SectionHeader } from '@/components/ui/section-header';

const steps = [
  {
    title: 'Submit your website',
    description:
      'Fill out the form with your site URL, goals, and any specifics you want us to inspect.',
  },
  {
    title: 'We review your site',
    description:
      'Our team analyzes design, UX, SEO, and performance through the same lens we use for client launches.',
  },
  {
    title: 'Receive a clear report',
    description:
      'Get a personalized summary with key findings, points of friction, their impact, and how it affects your site visitors’ experience.',
  },
] as const;

export function AuditProcessSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-12">
        <SectionHeader
          align="center"
          eyebrow="How It Works"
          title="Three steps to real insight"
          description="A simple process. You send it over, we review it fully, and we share a clear set of opportunities for your site."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex h-full flex-col gap-4 rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-bg)] p-6 shadow-pv"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--pv-gradient)] text-xl font-semibold text-white shadow-[0_20px_50px_-30px_var(--pv-primary)]">
                {index + 1}
              </span>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-[var(--pv-text)]">{step.title}</h3>
                <p className="text-[var(--pv-text-muted)]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
