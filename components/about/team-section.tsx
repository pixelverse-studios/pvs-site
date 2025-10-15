import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

const team = [
  {
    name: 'Sami',
    title: 'UX Design',
    description:
      'Sami is a designer with a creative background in music, where the goal is always to make something people connect with. That same mindset guides his approach to design, understanding audiences, shaping experiences that resonate, and creating with purpose. When he’s not designing, he’s on the water fishing, recharging, and finding the balance that keeps his creativity flowing.',
  },
  {
    name: 'Phil',
    title: 'Development',
    description:
      'With 7 years of experience in full-stack development, Phil builds scalable applications and solves complex technical challenges. He specializes in JavaScript, modern frameworks, databases, and web performance. Outside of work, he enjoys riding motorcycles and bikes—long rides that clear his mind and spark new ideas.',
  },
];

export function TeamSection() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-10">
        <MotionSection as="div" className="space-y-4 text-center">
          <MotionItem>
            <h2 className="font-heading text-3xl md:text-4xl">
              Meet the people behind the operation
            </h2>
          </MotionItem>
          <MotionItem delay={0.1}>
            <p className="text-lg text-[var(--pv-text-muted)]">
              Two specialists, one aligned mission — design smarter, build faster, and ship
              experiences you can scale.
            </p>
          </MotionItem>
        </MotionSection>
        <MotionSection as="div" className="grid gap-6 md:grid-cols-2" delay={0.12}>
          {team.map((member, index) => (
            <MotionItem
              key={member.name}
              delay={index * 0.1}
              className="relative rounded-[1.5rem] bg-[var(--pv-gradient)] p-[1px] shadow-[0_30px_60px_-40px_rgba(63,0,233,0.7)]"
            >
              <Card className="bg-[var(--pv-bg)]/95 dark:bg-[var(--pv-surface)]/95 h-full rounded-[1.45rem] p-6">
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
                  <p className="text-sm leading-6 text-[var(--pv-text-muted)]">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            </MotionItem>
          ))}
        </MotionSection>
      </Container>
    </section>
  );
}
