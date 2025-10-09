import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const projectAccentGradients = [
  'bg-[radial-gradient(circle_at_top_left,var(--pv-primary)/0.35,transparent_65%)]',
  'bg-[radial-gradient(circle_at_top,var(--pv-primary-2)/0.35,transparent_70%)]',
  'bg-[radial-gradient(circle_at_bottom_right,var(--pv-primary)/0.3,transparent_60%)]'
];

const projects = [
  {
    name: 'Jones Pressure Washing',
    summary: 'Boosted visibility + conversions through a custom multi-page site.',
    href: '#'
  },
  {
    name: '360 Degree Care',
    summary: 'Designed for empathy, trust, and clarity in the health care industry.',
    href: '#'
  },
  {
    name: 'Domani',
    summary: 'Helping people organize their lives with calm, intuitive design.',
    href: '#'
  }
];

export function ProjectShowcaseSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-10">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">Project Showcase</h2>
          <p className="mx-auto max-w-2xl text-lg text-[var(--pv-text-muted)]">
            Benefit-focused snapshots that highlight the outcomes, not just the visuals.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project, index) => (
            <Card
              key={project.name}
              className="group flex h-full flex-col overflow-hidden border border-[var(--pv-border)] bg-[var(--pv-bg)]/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)] hover:shadow-pv dark:bg-[var(--pv-surface)]/95"
            >
              <div
                className={`relative h-48 w-full overflow-hidden ${projectAccentGradients[index % projectAccentGradients.length]} transition-transform duration-300 group-hover:scale-[1.02]`}
              >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(5,5,19,0.25),rgba(8,8,17,0.55))]" />
                <div className="absolute inset-6 rounded-pv border border-dashed border-white/25 dark:border-white/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)]/85 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--pv-text-muted)] shadow-[0_18px_36px_-28px_rgba(63,0,233,0.6)]">
                    Case Study
                  </div>
                </div>
              </div>
              <CardHeader className="flex-1 space-y-3">
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.summary}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-[var(--pv-text-muted)]">
                From strategy workshops to launch-day QA, we partnered closely to build a digital
                experience that converts visitors into loyal customers.
              </CardContent>
              <CardFooter className="justify-end">
                <Button asChild size="sm" variant="secondary">
                  <Link href={project.href}>View Project</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
