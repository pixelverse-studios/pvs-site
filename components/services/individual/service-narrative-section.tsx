import { Container } from '@/components/ui/container';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export type Layout = 'text-only' | 'text-with-bullets' | 'text-with-bullets-alt' | 'two-column';
export type Background = 'surface' | 'bg';

/**
 * Reusable narrative content section for individual service pages.
 *
 * Supports four layout variants:
 * - `text-only` — centered prose up to max-w-3xl; use for intro and standalone narrative sections
 * - `text-with-bullets` — two-column with heading + intro on the left, bullet list on the right,
 *   and optional full-width closing text below; use for process or criteria sections
 * - `text-with-bullets-alt` — stacked header (eyebrow + heading + intro) above a 2-column bullet
 *   grid with gradient dot accents; use when the heading should span full width before the list
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
 * | How We Evaluate | `text-with-bullets-alt` — 5 bullet points, stacked header |
 * | When Optimization Is Right | `text-only` — prose + cross-link rendered below |
 * | What to Expect | `text-with-bullets` — 5 bullet points + closing |
 *
 * **Layout selection guide (web-dev page):**
 * | Section | Layout |
 * |---------|--------|
 * | Design and Development | `text-with-bullets-alt` — stacked header, 2-column bullet grid |
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
 *
 * @example Stacked-header section with 2-column bullet grid (web-dev page — Design and Development)
 * ```tsx
 * <ServiceNarrativeSection
 *   eyebrow="How We Build"
 *   title={webDevelopmentContent.designAndDevelopment.title}
 *   intro={webDevelopmentContent.designAndDevelopment.intro}
 *   bullets={webDevelopmentContent.designAndDevelopment.bulletPoints}
 *   layout="text-with-bullets-alt"
 *   background="surface"
 * />
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

  const eyebrowClass =
    'inline-flex items-center gap-2 rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-1 text-xs uppercase tracking-[0.2em] text-[var(--pv-text-muted)]';
  const headingClass =
    'text-balance font-heading text-[2.25rem] leading-[2.75rem] tracking-tight md:text-[2.5rem] md:leading-[3rem]';

  if (layout === 'text-with-bullets') {
    const closingBgClass = background === 'bg' ? 'bg-[var(--pv-surface)]' : 'bg-[var(--pv-bg)]';

    return (
      <section className={`${bgClass} py-16 md:py-24`} aria-labelledby={headingId}>
        <Container>
          <div className="space-y-12">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
              {/* Left: eyebrow + heading + intro */}
              <MotionSection as="div" className="space-y-5">
                <MotionItem>
                  <div className="space-y-4">
                    <span aria-hidden="true" className={eyebrowClass}>
                      {eyebrow}
                    </span>
                    <h2
                      id={headingId}
                      className={headingClass}
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

              {/* Right: numbered bullets with dividers — offset to align with h2 top */}
              {bullets && bullets.length > 0 && (
                <MotionSection as="ul" className="self-start divide-y divide-[var(--pv-border)] md:pt-10">
                  {bullets.map((bullet, idx) => (
                    <MotionItem
                      key={`bullet-${idx}`}
                      as="li"
                      delay={idx * 0.06}
                      className="group flex items-start gap-4 py-5 first:pt-0 last:pb-0"
                    >
                      <span
                        className="mt-0.5 shrink-0 font-mono text-xs font-medium tracking-widest text-[var(--pv-primary)]"
                        aria-hidden="true"
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[var(--pv-text-muted)] transition-colors duration-200 group-hover:text-[var(--pv-text)]">
                        {bullet}
                      </span>
                    </MotionItem>
                  ))}
                </MotionSection>
              )}
            </div>

            {/* Closing callout card */}
            {closingParagraphs.length > 0 && (
              <MotionItem>
                <div
                  className={`relative overflow-hidden rounded-xl border border-[var(--pv-border)] px-8 py-7 ${closingBgClass}`}
                >
                  <div
                    className="absolute left-0 top-0 h-full w-[3px]"
                    style={{
                      background:
                        'linear-gradient(to bottom, var(--pv-primary), var(--pv-primary-2))',
                    }}
                    aria-hidden="true"
                  />
                  <div className="space-y-4">
                    {closingParagraphs.map((paragraph, idx) => (
                      <p
                        key={`closing-${idx}`}
                        className="text-pretty text-lg text-[var(--pv-text-muted)]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </MotionItem>
            )}
          </div>
        </Container>
      </section>
    );
  }

  if (layout === 'text-with-bullets-alt') {
    return (
      <section className={`${bgClass} py-16 md:py-24`} aria-labelledby={headingId}>
        <Container>
          <div className="space-y-10">
            {/* Stacked header: eyebrow + heading + intro all flow naturally */}
            <MotionSection as="div" className="max-w-3xl space-y-5">
              <MotionItem>
                <div className="space-y-4">
                  <span aria-hidden="true" className={eyebrowClass}>
                    {eyebrow}
                  </span>
                  <h2
                    id={headingId}
                    className={headingClass}
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

            {/* Bullets: 2-column grid with gradient dot accents */}
            {bullets && bullets.length > 0 && (
              <MotionSection
                as="ul"
                className="grid grid-cols-1 gap-x-12 gap-y-5 sm:grid-cols-2"
              >
                {bullets.map((bullet, idx) => (
                  <MotionItem
                    key={`bullet-${idx}`}
                    as="li"
                    delay={idx * 0.05}
                    className="group flex items-start gap-3"
                  >
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                      style={{
                        background:
                          'linear-gradient(135deg, var(--pv-primary), var(--pv-primary-2))',
                      }}
                      aria-hidden="true"
                    />
                    <span className="text-[var(--pv-text-muted)] transition-colors duration-200 group-hover:text-[var(--pv-text)]">
                      {bullet}
                    </span>
                  </MotionItem>
                ))}
              </MotionSection>
            )}

            {/* Closing — top divider treatment (distinct from the bordered card in text-with-bullets) */}
            {closingParagraphs.length > 0 && (
              <MotionItem>
                <div className="space-y-4 border-t border-[var(--pv-border)] pt-8">
                  {closingParagraphs.map((paragraph, idx) => (
                    <p
                      key={`closing-${idx}`}
                      className="max-w-3xl text-pretty text-lg text-[var(--pv-text-muted)]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </MotionItem>
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
                <span aria-hidden="true" className={eyebrowClass}>
                  {eyebrow}
                </span>
              </MotionItem>
              <MotionItem delay={0.06}>
                <h2
                  id={headingId}
                  className={headingClass}
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
              <span aria-hidden="true" className={eyebrowClass}>
                {eyebrow}
              </span>
              <h2
                id={headingId}
                className={headingClass}
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
