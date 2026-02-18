import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

import { type BulletLayout, type BulletPoint, BulletVariants } from './bullet-variants';

interface AboutNarrativeSectionProps {
  title: string;
  intro?: string;
  body?: string;
  bulletPoints?: BulletPoint[];
  closing?: string;
  background?: 'surface' | 'default';
  bulletLayout?: BulletLayout;
}

function renderParagraphs(text: string, className?: string) {
  return text.split('\n\n').map((paragraph, i) => (
    <p key={i} className={cn('text-lg leading-relaxed text-[var(--pv-text-muted)]', className)}>
      {paragraph}
    </p>
  ));
}

export function AboutNarrativeSection({
  title,
  intro,
  body,
  bulletPoints,
  closing,
  background = 'default',
  bulletLayout,
}: AboutNarrativeSectionProps) {
  const hasBullets = bulletPoints && bulletPoints.length > 0;
  const headingId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <section
      className={cn(
        'py-16 md:py-24',
        background === 'surface' && 'bg-[var(--pv-surface)]',
      )}
      aria-labelledby={headingId}
    >
      <Container>
        <MotionSection as="div" className="space-y-10">
          {/* Prose content stays narrow for readability */}
          <div className="mx-auto max-w-3xl space-y-6">
            <MotionItem>
              <h2 id={headingId} className="text-balance font-heading text-3xl tracking-tight md:text-4xl">
                {title}
              </h2>
            </MotionItem>

            {intro && (
              <MotionItem delay={0.1}>
                <div className="space-y-4">{renderParagraphs(intro)}</div>
              </MotionItem>
            )}

            {body && (
              <MotionItem delay={0.1}>
                <div className="space-y-4">{renderParagraphs(body)}</div>
              </MotionItem>
            )}
          </div>

          {/* Bullet points — variant controlled by context */}
          {hasBullets && (
            <BulletVariants bulletPoints={bulletPoints} background={background} layout={bulletLayout ?? 'cards'} />
          )}

          {/* Closing prose back to narrow column */}
          {closing && (
            <div className="mx-auto max-w-3xl">
              <MotionItem delay={0.2}>
                <div className="space-y-4">{renderParagraphs(closing)}</div>
              </MotionItem>
            </div>
          )}
        </MotionSection>
      </Container>
    </section>
  );
}
