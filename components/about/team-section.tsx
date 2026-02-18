import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { aboutContent } from '@/data/about';

export function TeamSection() {
  const { heading, subheading, members } = aboutContent.team;

  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-10">
        <MotionSection as="div" className="space-y-4 text-center">
          <MotionItem>
            <h2 className="font-heading text-3xl md:text-4xl">{heading}</h2>
          </MotionItem>
          <MotionItem delay={0.1}>
            <p className="text-lg text-[var(--pv-text-muted)]">{subheading}</p>
          </MotionItem>
        </MotionSection>
        <MotionSection as="div" className="grid gap-6 md:grid-cols-2" delay={0.12}>
          {members.map((member, index) => (
            <MotionItem
              key={member.name}
              delay={index * 0.1}
              className="relative rounded-[1.5rem] bg-[var(--pv-gradient)] p-[1px] shadow-[0_30px_60px_-40px_rgba(63,0,233,0.7)]"
            >
              <Card className="h-full rounded-[1.45rem] bg-[var(--pv-bg)]/95 p-6 dark:bg-[var(--pv-surface)]/95">
                <CardContent className="flex h-full flex-col gap-5 p-0">
                  <div className="flex items-center gap-4">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={`${member.name}, ${member.title}`}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-full border border-white/30 object-cover shadow-[0_20px_30px_-22px_rgba(63,0,233,0.8)] dark:border-white/10"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/30 bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-2xl font-semibold text-white shadow-[0_20px_30px_-22px_rgba(63,0,233,0.8)] dark:border-white/10"
                      >
                        {member.initials}
                      </div>
                    )}
                    <div>
                      <p className="text-lg font-semibold text-[var(--pv-text)]">{member.name}</p>
                      <p className="text-sm text-[var(--pv-text-muted)]">{member.title}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-6 text-[var(--pv-text-muted)]">{member.bio}</p>
                </CardContent>
              </Card>
            </MotionItem>
          ))}
        </MotionSection>
      </Container>
    </section>
  );
}
