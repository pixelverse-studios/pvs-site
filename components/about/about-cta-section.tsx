import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { aboutContent } from '@/data/about';

export function AboutCtaSection() {
  const { title, description, cta } = aboutContent.letsTalk;
  const paragraphs = description.split('\n\n');

  return (
    <section className="py-16 md:py-24">
      <Container className="flex flex-col items-center gap-8 text-center">
        <MotionSection as="div" className="flex flex-col items-center gap-8 text-center">
          <MotionItem className="space-y-5">
            <h2 className="font-heading text-3xl md:text-4xl">{title}</h2>
            <div className="max-w-2xl space-y-4">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-lg text-[var(--pv-text-muted)] md:text-xl"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </MotionItem>
          <MotionItem delay={0.1}>
            <Button asChild size="lg" variant="cta">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          </MotionItem>
        </MotionSection>
      </Container>
    </section>
  );
}
