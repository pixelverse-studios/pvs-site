import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

type Layout = 'text-only' | 'text-with-bullets' | 'two-column';
type Background = 'surface' | 'bg';

/**
 * Reusable narrative content section for individual service pages.
 *
 * Supports three layout variants:
 * - `text-only` — centered prose up to max-w-3xl; use for intro and standalone narrative sections
 * - `text-with-bullets` — two-column with heading + intro on the left, bullet list on the right,
 *   and optional full-width closing text below; use for process or criteria sections
 * - `two-column` — heading on the left, body paragraphs on the right; use for dense explanatory copy
 *
 * The `intro` prop accepts either a pre-split `string[]` or a raw string with `\n\n` paragraph
 * breaks — both render as stacked `<p>` elements.
 *
 * For sections that need an inline cross-link (e.g. "Learn more about X"), render the
 * `ServiceNarrativeSection` first and then add the `<Link>` below it inside a shared background
 * wrapper — the component does not accept arbitrary child elements.
 *
 * **Layout selection guide (SEO page):**
 * | Section | Layout |
 * |---------|--------|
 * | Why Businesses Look | `text-only` — prose only, no bullets |
 * | Why Not Just Rankings | `text-with-bullets` — 5 bullet points + closing |
 * | How We Evaluate | `text-with-bullets` — 5 bullet points + closing |
 * | When Optimization Is Right | `text-only` — prose + cross-link rendered below |
 * | What to Expect | `text-with-bullets` — 5 bullet points + closing |
 *
 * @example Prose-only section (SEO page — Why Businesses Look)
 * ```tsx
 * <ServiceNarrativeSection
 *   eyebrow="Why It Matters"
 *   title={seoContent.whyBusinessesLook.title}
 *   intro={seoContent.whyBusinessesLook.body}
 *   layout="text-only"
 *   background="surface"
 * />
 * ```
 *
 * @example Bullet section (SEO page — Why Not Just Rankings)
 * ```tsx
 * <ServiceNarrativeSection
 *   eyebrow="Beyond Rankings"
 *   title={seoContent.whyNotJustRankings.title}
 *   intro={seoContent.whyNotJustRankings.intro}
 *   bullets={seoContent.whyNotJustRankings.bulletPoints}
 *   closing={seoContent.whyNotJustRankings.closing}
 *   layout="text-with-bullets"
 *   background="bg"
 * />
 * ```
 *
 * @example Prose section with cross-link rendered below (SEO page — When Optimization Is Right)
 * ```tsx
 * <div className="bg-[var(--pv-bg)]">
 *   <ServiceNarrativeSection
 *     eyebrow="Is It Right for You?"
 *     title={seoContent.whenOptimizationIsRight.title}
 *     intro={seoContent.whenOptimizationIsRight.body}
 *     layout="text-only"
 *     background="bg"
 *   />
 *   <Container className="pb-12 md:pb-16">
 *     <Link
 *       href={seoContent.whenOptimizationIsRight.crossLink.href}
 *       className="text-sm font-medium text-[var(--pv-primary)] underline-offset-4 hover:underline"
 *     >
 *       {seoContent.whenOptimizationIsRight.crossLink.label} →
 *     </Link>
 *   </Container>
 * </div>
 * ```
 */
export interface ServiceNarrativeSectionProps {
  eyebrow: string;
  title: string;
  intro: string | string[];
  bullets?: string[];
  closing?: string;
  layout?: Layout;
  background?: Background;
}

export function ServiceNarrativeSection({
  eyebrow,
  title,
  intro,
  bullets,
  closing,
  layout = 'text-only',
  background = 'surface',
}: ServiceNarrativeSectionProps) {
  const headingId = `narrative-${eyebrow.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const paragraphs = Array.isArray(intro) ? intro : intro.split('\n\n').filter(Boolean);
  const closingParagraphs = closing ? closing.split('\n\n').filter(Boolean) : [];
  const bgClass = background === 'bg' ? 'bg-[var(--pv-bg)]' : 'bg-[var(--pv-surface)]';

  if (layout === 'text-with-bullets') {
    return (
      <section className={`${bgClass} py-16 md:py-24`} aria-labelledby={headingId}>
        <Container>
          <div className="space-y-12">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
              {/* Left: eyebrow + heading + intro */}
              <MotionSection as="div" className="space-y-5">
                <MotionItem>
                  <div className="space-y-4">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-1 text-xs uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
                      {eyebrow}
                    </span>
                    <h2
                      id={headingId}
                      className="text-balance font-heading text-[2.25rem] leading-[2.75rem] tracking-tight md:text-[2.5rem] md:leading-[3rem]"
                    >
                      {title}
                    </h2>
                  </div>
                </MotionItem>
                {paragraphs.map((paragraph, idx) => (
                  <MotionItem key={`intro-${idx}`} delay={0.08 + idx * 0.06}>
                    <p className="text-pretty text-lg text-[var(--pv-text-muted)]">
                      {paragraph}
                    </p>
                  </MotionItem>
                ))}
              </MotionSection>

              {/* Right: bullets */}
              {bullets && bullets.length > 0 && (
                <MotionSection as="ul" className="space-y-4 self-start">
                  {bullets.map((bullet, idx) => (
                    <MotionItem
                      key={`bullet-${idx}`}
                      as="li"
                      delay={idx * 0.06}
                      className="flex items-start gap-3 text-[var(--pv-text-muted)]"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--pv-primary)]"
                        aria-hidden="true"
                      />
                      <span>{bullet}</span>
                    </MotionItem>
                  ))}
                </MotionSection>
              )}
            </div>

            {/* Closing text (full width below grid) */}
            {closingParagraphs.length > 0 && (
              <MotionSection as="div" className="mx-auto max-w-3xl space-y-4">
                {closingParagraphs.map((paragraph, idx) => (
                  <MotionItem key={`closing-${idx}`} delay={idx * 0.06}>
                    <p className="text-pretty text-lg text-[var(--pv-text-muted)]">
                      {paragraph}
                    </p>
                  </MotionItem>
                ))}
              </MotionSection>
            )}
          </div>
        </Container>
      </section>
    );
  }

  if (layout === 'two-column') {
    return (
      <section className={`${bgClass} py-16 md:py-24`} aria-labelledby={headingId}>
        <Container>
          <div className="grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
            {/* Left: eyebrow + heading */}
            <MotionSection as="div" className="space-y-4">
              <MotionItem>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-1 text-xs uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
                  {eyebrow}
                </span>
              </MotionItem>
              <MotionItem delay={0.06}>
                <h2
                  id={headingId}
                  className="text-balance font-heading text-[2.25rem] leading-[2.75rem] tracking-tight md:text-[2.5rem] md:leading-[3rem]"
                >
                  {title}
                </h2>
              </MotionItem>
            </MotionSection>

            {/* Right: intro paragraphs */}
            <MotionSection as="div" className="space-y-6 self-start">
              {paragraphs.map((paragraph, idx) => (
                <MotionItem key={`para-${idx}`} delay={idx * 0.06}>
                  <p className="text-pretty text-lg text-[var(--pv-text-muted)]">
                    {paragraph}
                  </p>
                </MotionItem>
              ))}
            </MotionSection>
          </div>
        </Container>
      </section>
    );
  }

  // text-only (default)
  return (
    <section className={`${bgClass} py-16 md:py-24`} aria-labelledby={headingId}>
      <Container>
        <MotionSection as="div" className="mx-auto max-w-3xl space-y-6">
          <MotionItem>
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-1 text-xs uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
                {eyebrow}
              </span>
              <h2
                id={headingId}
                className="text-balance font-heading text-[2.25rem] leading-[2.75rem] tracking-tight md:text-[2.5rem] md:leading-[3rem]"
              >
                {title}
              </h2>
            </div>
          </MotionItem>
          {paragraphs.map((paragraph, idx) => (
            <MotionItem key={`para-${idx}`} delay={0.08 + idx * 0.06}>
              <p className="text-pretty text-lg text-[var(--pv-text-muted)]">
                {paragraph}
              </p>
            </MotionItem>
          ))}
          {closingParagraphs.map((paragraph, idx) => (
            <MotionItem
              key={`closing-${idx}`}
              delay={0.08 + (paragraphs.length + idx) * 0.06}
            >
              <p className="text-pretty text-lg text-[var(--pv-text-muted)]">
                {paragraph}
              </p>
            </MotionItem>
          ))}
        </MotionSection>
      </Container>
    </section>
  );
}
