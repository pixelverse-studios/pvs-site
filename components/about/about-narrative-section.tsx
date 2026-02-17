import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

interface AboutNarrativeSectionProps {
  title: string;
  intro?: string;
  body?: string;
  bulletPoints?: Array<{ text: string }>;
  closing?: string;
  background?: 'surface' | 'default';
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
}: AboutNarrativeSectionProps) {
  return (
    <section
      className={cn(
        'py-16 md:py-24',
        background === 'surface' && 'bg-[var(--pv-surface)]',
      )}
    >
      <Container className="mx-auto max-w-3xl">
        <MotionSection as="div" className="space-y-6">
          <MotionItem>
            <h2 className="text-balance font-heading text-3xl tracking-tight md:text-4xl">
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

          {bulletPoints && bulletPoints.length > 0 && (
            <MotionItem delay={0.15}>
              <ul className="space-y-3 pl-1">
                {bulletPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--pv-primary)]"
                    />
                    <span className="text-lg leading-relaxed text-[var(--pv-text-muted)]">
                      {point.text}
                    </span>
                  </li>
                ))}
              </ul>
            </MotionItem>
          )}

          {closing && (
            <MotionItem delay={0.2}>
              <div className="space-y-4">{renderParagraphs(closing)}</div>
            </MotionItem>
          )}
        </MotionSection>
      </Container>
    </section>
  );
}
