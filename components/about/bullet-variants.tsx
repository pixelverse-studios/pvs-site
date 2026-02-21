'use client';

import Link from 'next/link';
import {
  BarChart3,
  ClipboardList,
  Code,
  Compass,
  LayoutGrid,
  Search,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

// =============================================================================
// Shared Types & Utilities
// =============================================================================

const iconMap = {
  compass: Compass,
  search: Search,
  layoutGrid: LayoutGrid,
  clipboardList: ClipboardList,
  shieldCheck: ShieldCheck,
  trendingUp: TrendingUp,
  code: Code,
  barChart: BarChart3,
} as const;

export type IconKey = keyof typeof iconMap;

export interface BulletPoint {
  text: string;
  icon?: IconKey;
  href?: string;
}

export type BulletLayout = 'cards' | 'inline' | 'connected';

interface BulletVariantsProps {
  bulletPoints: BulletPoint[];
  background: 'surface' | 'default';
  layout: BulletLayout;
}

function getIconColor(index: number, total: number) {
  const progress = total > 1 ? index / (total - 1) : 0;
  return `color-mix(in srgb, var(--pv-primary) ${(1 - progress) * 100}%, var(--pv-primary-2))`;
}

// =============================================================================
// Variant A: Editorial Cards
// =============================================================================
function CardsVariant({ bulletPoints, background }: BulletVariantsProps) {
  return (
    <MotionSection
      as="div"
      className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3"
      delay={0.12}
    >
      {bulletPoints.map((point, i) => {
        const iconColor = getIconColor(i, bulletPoints.length);
        const IconComponent = point.icon ? iconMap[point.icon] : null;

        return (
          <MotionItem
            key={point.text}
            delay={i * 0.08}
            className="group relative rounded-2xl bg-[var(--pv-gradient)] p-px shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(63,0,233,0.35)]"
          >
            <div
              className={cn(
                'relative h-full overflow-hidden rounded-[calc(1rem-1px)] p-6',
                background === 'surface'
                  ? 'bg-[var(--pv-surface)] dark:bg-[var(--pv-bg)]/95'
                  : 'bg-[var(--pv-bg)] dark:bg-[var(--pv-surface)]/95',
              )}
            >
              {/* Oversized watermark number */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-2 -top-4 select-none font-heading text-[7rem] font-bold leading-none opacity-[0.04] transition-opacity duration-300 group-hover:opacity-[0.08]"
                style={{
                  background: 'var(--pv-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {IconComponent && (
                <div className="mb-4">
                  <IconComponent className="h-5 w-5" style={{ color: iconColor }} />
                </div>
              )}

              <p className="relative pr-10 text-[0.9375rem] leading-[1.75] text-[var(--pv-text-muted)] md:text-base md:leading-[1.8]">
                {point.text}
              </p>

              {point.href && (
                <Link
                  href={point.href}
                  className="mt-3 inline-flex text-sm font-medium text-[var(--pv-primary)] transition-colors hover:text-[var(--pv-primary-2)]"
                >
                  Learn more &rarr;
                </Link>
              )}
            </div>
          </MotionItem>
        );
      })}
    </MotionSection>
  );
}

// =============================================================================
// Variant B: Inline — lightweight emphasis within prose flow
// =============================================================================
function InlineVariant({ bulletPoints }: BulletVariantsProps) {
  return (
    <MotionSection as="div" className="mx-auto max-w-3xl" delay={0.12}>
      <div className="flex flex-wrap gap-3">
        {bulletPoints.map((point, i) => {
          const iconColor = getIconColor(i, bulletPoints.length);
          const IconComponent = point.icon ? iconMap[point.icon] : null;
          const chipClasses = "inline-flex items-center gap-2 rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)]/60 px-4 py-2 text-[0.9375rem] text-[var(--pv-text-muted)] transition-all duration-200 hover:border-[var(--pv-primary)]/30 hover:text-[var(--pv-text)]";
          const chipContent = (
            <>
              {IconComponent && (
                <IconComponent className="h-3.5 w-3.5 shrink-0" style={{ color: iconColor }} />
              )}
              {point.text}
            </>
          );

          return (
            <MotionItem
              key={point.text}
              delay={i * 0.06}
              className="group"
            >
              {point.href ? (
                <Link href={point.href} className={chipClasses}>
                  {chipContent}
                </Link>
              ) : (
                <span className={chipClasses}>
                  {chipContent}
                </span>
              )}
            </MotionItem>
          );
        })}
      </div>
    </MotionSection>
  );
}

// =============================================================================
// Variant C: Connected — disciplines linked by a horizontal gradient bridge
// Adapts column count to the number of bullet points (2 or 3 supported)
// =============================================================================
function ConnectedVariant({ bulletPoints, background }: BulletVariantsProps) {
  const count = bulletPoints.length;
  // Gradient bridge spans between the first and last icon centres.
  // Icon centre sits at (1 / (2 * count)) of the container width from each edge.
  const bridgeOffset = `calc(100% / ${2 * count})`;
  const gridCols = count === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3';

  return (
    <MotionSection as="div" className="mx-auto max-w-4xl" delay={0.12}>
      <div className="relative">
        {/* Horizontal gradient bridge connecting all nodes (desktop only) */}
        <div
          className="absolute top-[28px] hidden h-px md:block"
          style={{ background: 'var(--pv-gradient)', left: bridgeOffset, right: bridgeOffset }}
          aria-hidden="true"
        />

        <div className={`grid gap-10 sm:gap-6 ${gridCols}`}>
          {bulletPoints.map((point, i) => {
            const iconColor = getIconColor(i, bulletPoints.length);
            const IconComponent = point.icon ? iconMap[point.icon] : null;

            return (
              <MotionItem
                key={point.text}
                delay={i * 0.1}
                className="group flex flex-col items-center text-center"
              >
                {/* Icon node */}
                <div
                  className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_24px_-8px_rgba(63,0,233,0.4)]"
                  style={{
                    background: `color-mix(in srgb, ${iconColor} 10%, ${background === 'surface' ? 'var(--pv-surface)' : 'var(--pv-bg)'})`,
                    border: `1.5px solid color-mix(in srgb, ${iconColor} 25%, transparent)`,
                  }}
                >
                  {IconComponent ? (
                    <IconComponent
                      className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: iconColor }}
                    />
                  ) : (
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: iconColor }}
                    />
                  )}
                </div>

                {/* Text */}
                <p className="text-[0.9375rem] leading-[1.75] text-[var(--pv-text-muted)] md:text-base md:leading-[1.8]">
                  {point.text}
                </p>

                {point.href && (
                  <Link
                    href={point.href}
                    className="mt-2 inline-flex text-sm font-medium text-[var(--pv-primary)] transition-colors hover:text-[var(--pv-primary-2)]"
                  >
                    Learn more &rarr;
                  </Link>
                )}
              </MotionItem>
            );
          })}
        </div>
      </div>
    </MotionSection>
  );
}

// =============================================================================
// Variant Router
// =============================================================================
const layoutComponents: Record<BulletLayout, React.ComponentType<BulletVariantsProps>> = {
  cards: CardsVariant,
  inline: InlineVariant,
  connected: ConnectedVariant,
};

export function BulletVariants({ bulletPoints, background, layout }: BulletVariantsProps) {
  const LayoutComponent = layoutComponents[layout];
  return <LayoutComponent bulletPoints={bulletPoints} background={background} layout={layout} />;
}
