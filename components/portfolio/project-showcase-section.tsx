import { Container } from '@/components/ui/container';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const projectAccentGradients = [
  'bg-[radial-gradient(circle_at_top_left,var(--pv-primary)/0.35,transparent_65%)]',
  'bg-[radial-gradient(circle_at_top,var(--pv-primary-2)/0.35,transparent_70%)]',
  'bg-[radial-gradient(circle_at_bottom_right,var(--pv-primary)/0.3,transparent_60%)]',
];

const projects = [
  {
    name: 'Jones Pressure Washing',
    industry: 'Home Services',
    summary: [
      'Rebuilt a local brand’s online experience to increase trust, clarity, and ease of booking.',
      'From competitor research to content strategy and launch, we focused on measurable results and lasting usability.',
    ],
    highlights: [
      'Modernized the brand’s website for better usability and lead generation.',
      'Simplified service structure and copy to improve clarity and local SEO.',
      'New design makes booking easier, leading to more online inquiries.',
    ],
    url: 'https://www.jonespressurewashingnj.com',
  },
  {
    name: '360 Degree Care',
    industry: 'Healthcare',
    summary: [
      'Built a new home health care website to foster trust, clarity, and emotional connection for families seeking care.',
      'Delivered a scalable, SEO-optimized build focused on accessibility, engagement, and measurable growth in site performance.',
    ],
    highlights: [
      'Session duration doubled thanks to simplified service flows.',
      'Content management system empowers the team to update care plans in minutes.',
      'WCAG-focused design improved accessibility scores across devices.',
    ],
    url: 'https://www.360degreecare.net',
  },
  {
    name: 'Domani',
    industry: 'Productivity SaaS',
    summary: [
      'Partnered with the founding team to translate product vision into a high-converting marketing site.',
    ],
    highlights: [
      'Lifted free-trial signups by 35% with clearer feature storytelling.',
      'Internationalized content rollout launched in two weeks using modular builds.',
      'Analytics-ready architecture made onboarding funnels measurable from day one.',
    ],
    url: 'https://www.domani-app.com',
  },
];

export function ProjectShowcaseSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-10">
        <MotionSection as="div" className="flex flex-col gap-4 text-center">
          <MotionItem>
            <h2 className="text-3xl font-semibold md:text-4xl">Trust Through Collaboration</h2>
          </MotionItem>
          <MotionItem delay={0.08}>
            <p className="mx-auto max-w-3xl text-lg text-[var(--pv-text-muted)]">
              Our portfolio shows the variety of industries we serve — but what stays the same is
              our focus on clarity, usability, and results. Each project is a collaboration. We
              listen, adapt, and deliver a website that reflects your vision while adding UX
              strategy and technical expertise.
            </p>
          </MotionItem>
        </MotionSection>
        <MotionSection as="div" className="grid gap-6 md:grid-cols-3" delay={0.12}>
          {projects.map((project, index) => (
            <MotionItem
              key={project.name}
              delay={index * 0.08}
              triggerOnViewport={false}
              className="h-full"
            >
              <Card className="bg-[var(--pv-bg)]/95 dark:bg-[var(--pv-surface)]/95 group flex h-full flex-col overflow-hidden border border-[var(--pv-border)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--pv-primary)] hover:shadow-pv">
                <div
                  className={`relative h-48 w-full overflow-hidden ${projectAccentGradients[index % projectAccentGradients.length]} transition-transform duration-300 group-hover:scale-[1.02]`}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(5,5,19,0.25),rgba(8,8,17,0.55))]" />
                  <div className="absolute inset-6 rounded-pv border border-dashed border-white/25 dark:border-white/10" />
                  <div className="absolute inset-0 flex items-center justify-center"></div>
                </div>
                <CardHeader className="mb-5 flex-1 space-y-3">
                  <CardTitle>{project.name}</CardTitle>
                  <div className="space-y-2">
                    {project.summary.map((paragraph) => (
                      <CardDescription key={paragraph}>{paragraph}</CardDescription>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 text-sm text-[var(--pv-text-muted)]">
                  <ul className="space-y-2">
                    {project.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-3 text-left">
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--pv-primary)]"
                          aria-hidden="true"
                        />
                        <span className="flex-1">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-[var(--pv-bg)]/85 w-fit rounded-full border border-[var(--pv-border)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--pv-text-muted)] shadow-[0_18px_36px_-28px_rgba(63,0,233,0.6)]">
                    {project.industry}
                  </div>
                </CardContent>
                <CardFooter className="flex-start flex-col text-xs uppercase tracking-[0.25em] text-[var(--pv-text-muted)]">
                  <a
                    href={project.url}
                    className="flex items-center gap-2 dark:text-pv-text dark:hover:text-pv-primary2"
                    target="__blank"
                  >
                    View live site <ArrowRight size={18} />
                  </a>
                </CardFooter>
              </Card>
            </MotionItem>
          ))}
        </MotionSection>
      </Container>
    </section>
  );
}
