import { MotionItem, MotionSection } from '@/components/ui/motion-section';
import { insightSection } from '@/data/homepage';

import { Container } from './container';
import { ScrollReveal } from './scroll-reveal';

const BEAT_COUNT = insightSection.beats.length;

function InsightBeat({ label, text, index }: { label: string; text: string; index: number }) {
  const isLast = index === BEAT_COUNT - 1;
  const gradientProgress = index / (BEAT_COUNT - 1);
  const labelColor = gradientProgress < 0.5 ? 'var(--pv-primary)' : 'var(--pv-primary-2)';

  return (
    <ScrollReveal className="scroll-fade-left relative flex gap-5" style={{ animationDelay: `${index * 0.1}s` }}>
      {/* Node dot — aligned to the label baseline */}
      <div className="relative flex shrink-0 flex-col items-center pt-[3px]">
        <div
          className="scroll-scale h-2.5 w-2.5 rounded-full shadow-[0_0_0_3px_var(--pv-bg),0_0_0_4px_var(--pv-border)]"
          style={{
            background: `color-mix(in srgb, var(--pv-primary) ${(1 - gradientProgress) * 100}%, var(--pv-primary-2))`,
          }}
        />
      </div>

      {/* Content */}
      <div className={isLast ? '' : 'pb-0'}>
        <p
          className="mb-1.5 text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: labelColor }}
        >
          {label}
        </p>
        <p
          className={`text-[1.0625rem] leading-[1.85] md:text-lg md:leading-[1.85] ${
            isLast ? 'font-semibold text-[var(--pv-text)]' : 'text-[var(--pv-text-muted)]'
          }`}
        >
          {text}
        </p>
      </div>
    </ScrollReveal>
  );
}

export function InsightSection() {
  return (
    <section
      className="border-b border-[var(--pv-border)] bg-[var(--pv-bg)]"
      aria-labelledby="insight-heading"
    >
      <Container className="py-20 md:py-28">
        <div className="lg:flex lg:gap-16">
          {/* Left: Sticky heading */}
          <div className="mb-12 lg:sticky lg:top-24 lg:mb-0 lg:h-fit lg:w-1/3">
            <MotionSection as="div">
              <MotionItem>
                <div
                  className="mb-8 h-1 w-12 rounded-full bg-[image:var(--pv-gradient)]"
                  aria-hidden
                />
              </MotionItem>

              <MotionItem>
                <h2
                  id="insight-heading"
                  className="font-heading text-[2rem] leading-[2.5rem] tracking-[-0.02em] text-[var(--pv-text)] md:text-[2.5rem] md:leading-[3rem]"
                >
                  {insightSection.heading}
                </h2>
              </MotionItem>
            </MotionSection>
          </div>

          {/* Right: Beats with continuous vertical line */}
          <div className="lg:w-2/3">
            <ScrollReveal className="relative space-y-8" threshold={0.1}>
              {/* Single continuous gradient line behind all beats */}
              <div
                className="scroll-grow-y absolute left-[4.5px] top-[3px] bottom-[3px] w-px bg-[image:var(--pv-gradient)]"
                aria-hidden
              />

              {insightSection.beats.map((beat, i) => (
                <InsightBeat key={beat.label} label={beat.label} text={beat.text} index={i} />
              ))}
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
