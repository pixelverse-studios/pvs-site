import { Code2, GaugeCircle, Sparkles } from 'lucide-react';

import { Container } from '@/components/ui/container';
import { InfoCard } from '@/components/ui/info-card';
import { SectionHeader } from '@/components/ui/section-header';

const keyPoints = [
  {
    icon: Code2,
    title: 'Custom Code = Control',
    description: <> — Faster load times, cleaner builds, and no reliance on bloated templates.</>
  },
  {
    icon: GaugeCircle,
    title: 'UX Design = Growth',
    description: <> — A website that feels effortless for users keeps them engaged and builds trust.</>
  },
  {
    icon: Sparkles,
    title: 'Combined = Results',
    description: <> — Sites that not only look great but actually perform for your business.</>
  }
];

export function WhyCustomSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-12">
        <SectionHeader
          eyebrow="Why Custom Code & UX First"
          title="The difference between checking the box and building a growth engine"
          description={
            <>
              <p className="text-lg text-[var(--pv-text-muted)]">
                Website builders and templates can get you online fast, but they often come with
                hidden problems — slow speeds, limited flexibility, and a poor user experience.
              </p>
              <p className="text-lg text-[var(--pv-text-muted)]">
                We solve that by building every site from scratch. Our UX-first approach ensures
                your website isn’t just pretty — it’s practical, intuitive, and conversion-ready.
              </p>
            </>
          }
          className="max-w-3xl space-y-6"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {keyPoints.map((point) => (
            <InfoCard
              key={point.title}
              icon={point.icon}
              title={point.title}
              description={point.description}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
