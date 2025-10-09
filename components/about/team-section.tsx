import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';

const team = [
  {
    name: 'Sami',
    title: 'UX Design',
    description:
      'Sami shapes every experience around real user journeys, turning research and narrative into intuitive flows that drive conversions.'
  },
  {
    name: 'Phil',
    title: 'Development',
    description:
      'Phil crafts the technical backbone of each build, engineering performant, scalable systems that keep the web fast and reliable.'
  }
];

export function TeamSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-10">
        <div className="space-y-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl">Meet the people behind the craft</h2>
          <p className="text-lg text-[var(--pv-text-muted)]">
            Two specialists, one aligned mission — design smarter, build faster, and ship experiences
            you can scale.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {team.map((member) => (
            <div
              key={member.name}
              className="relative rounded-[1.5rem] bg-[var(--pv-gradient)] p-[1px] shadow-[0_30px_60px_-40px_rgba(63,0,233,0.7)]"
            >
              <Card className="h-full rounded-[1.45rem] bg-[var(--pv-bg)]/95 p-6 dark:bg-[var(--pv-surface)]/95">
                <CardContent className="flex h-full flex-col gap-5 p-0">
                  <div className="flex items-center gap-4">
                    <div
                      aria-hidden="true"
                      className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/30 bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-2xl font-semibold text-white shadow-[0_20px_30px_-22px_rgba(63,0,233,0.8)] dark:border-white/10"
                    >
                      {member.name.slice(0, 1)}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-[var(--pv-text)]">{member.name}</p>
                      <p className="text-sm text-[var(--pv-text-muted)]">{member.title}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-6 text-[var(--pv-text-muted)]">{member.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
