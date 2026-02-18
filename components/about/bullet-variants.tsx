'use client';

import {
  BarChart3,
  ClipboardList,
  Code,
  Compass,
  LayoutGrid,
  Palette,
  Search,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

import { useBulletVariant } from './bullet-variant-context';

interface BulletPoint {
  text: string;
  icon?: string;
}

export type BulletLayout = 'cards' | 'timeline' | 'panels' | 'inline' | 'connected';

interface BulletVariantsProps {
  bulletPoints: BulletPoint[];
  background: 'surface' | 'default';
  layout?: BulletLayout;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  compass: Compass,
  search: Search,
  layoutGrid: LayoutGrid,
  clipboardList: ClipboardList,
  shieldCheck: ShieldCheck,
  trendingUp: TrendingUp,
  palette: Palette,
  code: Code,
  barChart: BarChart3,
};

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
            key={i}
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
            </div>
          </MotionItem>
        );
      })}
    </MotionSection>
  );
}

// =============================================================================
// Variant B: Timeline
// =============================================================================
function TimelineVariant({ bulletPoints }: BulletVariantsProps) {
  return (
    <MotionSection as="div" className="mx-auto max-w-3xl" delay={0.12}>
      <div className="relative space-y-0">
        {/* Continuous gradient line */}
        <div
          className="absolute bottom-4 left-[15px] top-4 w-px"
          style={{ background: 'var(--pv-gradient)' }}
          aria-hidden="true"
        />

        {bulletPoints.map((point, i) => {
          const iconColor = getIconColor(i, bulletPoints.length);
          const IconComponent = point.icon ? iconMap[point.icon] : null;
          const isLast = i === bulletPoints.length - 1;

          return (
            <MotionItem
              key={i}
              delay={i * 0.1}
              className={cn('group relative flex gap-6', !isLast && 'pb-8')}
            >
              <div className="relative z-10 flex shrink-0 items-start pt-0.5">
                <div
                  className="flex h-[31px] w-[31px] items-center justify-center rounded-full border-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_16px_-4px_rgba(63,0,233,0.5)]"
                  style={{
                    borderColor: iconColor,
                    background: 'var(--pv-bg)',
                  }}
                >
                  {IconComponent ? (
                    <IconComponent className="h-3.5 w-3.5" style={{ color: iconColor }} />
                  ) : (
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ background: iconColor }}
                    />
                  )}
                </div>
              </div>

              <div className="flex-1 pt-1">
                <p
                  className={cn(
                    'text-[1.0625rem] leading-[1.85] md:text-lg md:leading-[1.85]',
                    isLast
                      ? 'font-medium text-[var(--pv-text)]'
                      : 'text-[var(--pv-text-muted)]',
                  )}
                >
                  {point.text}
                </p>
              </div>
            </MotionItem>
          );
        })}
      </div>
    </MotionSection>
  );
}

// =============================================================================
// Variant C: Stacked Panels
// =============================================================================
function PanelsVariant({ bulletPoints, background }: BulletVariantsProps) {
  return (
    <MotionSection as="div" className="mx-auto max-w-4xl space-y-3" delay={0.12}>
      {bulletPoints.map((point, i) => {
        const accentColor = getIconColor(i, bulletPoints.length);
        const IconComponent = point.icon ? iconMap[point.icon] : null;

        return (
          <MotionItem
            key={i}
            delay={i * 0.08}
            className="group"
          >
            <div
              className={cn(
                'relative flex items-center gap-5 overflow-hidden rounded-xl border border-[var(--pv-border)] px-6 py-5 transition-all duration-300 hover:border-transparent hover:shadow-[0_12px_32px_-12px_rgba(63,0,233,0.3)]',
                background === 'surface'
                  ? 'bg-[var(--pv-surface)] hover:bg-[var(--pv-bg)]/80'
                  : 'bg-[var(--pv-bg)] hover:bg-[var(--pv-surface)]/80',
              )}
            >
              {/* Left accent bar */}
              <div
                className="absolute inset-y-0 left-0 w-1 transition-all duration-300 group-hover:w-1.5"
                style={{ background: accentColor }}
                aria-hidden="true"
              />

              {/* Large number */}
              <span
                className="shrink-0 font-heading text-3xl font-bold leading-none tracking-tight opacity-20 transition-opacity duration-300 group-hover:opacity-40 md:text-4xl"
                style={{
                  background: 'var(--pv-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {IconComponent && (
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `color-mix(in srgb, ${accentColor} 12%, transparent)` }}
                >
                  <IconComponent className="h-4 w-4" style={{ color: accentColor }} />
                </div>
              )}

              <p className="flex-1 text-[0.9375rem] leading-[1.75] text-[var(--pv-text-muted)] transition-colors duration-300 group-hover:text-[var(--pv-text)] md:text-base md:leading-[1.8]">
                {point.text}
              </p>
            </div>
          </MotionItem>
        );
      })}
    </MotionSection>
  );
}

// =============================================================================
// Variant D: Inline — lightweight emphasis within prose flow
// =============================================================================
function InlineVariant({ bulletPoints }: BulletVariantsProps) {
  return (
    <MotionSection as="div" className="mx-auto max-w-3xl" delay={0.12}>
      <div className="flex flex-wrap gap-3">
        {bulletPoints.map((point, i) => {
          const iconColor = getIconColor(i, bulletPoints.length);
          const IconComponent = point.icon ? iconMap[point.icon] : null;

          return (
            <MotionItem
              key={i}
              delay={i * 0.06}
              className="group"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)]/60 px-4 py-2 text-[0.9375rem] text-[var(--pv-text-muted)] transition-all duration-200 hover:border-[var(--pv-primary)]/30 hover:text-[var(--pv-text)]">
                {IconComponent && (
                  <IconComponent className="h-3.5 w-3.5 shrink-0" style={{ color: iconColor }} />
                )}
                {point.text}
              </span>
            </MotionItem>
          );
        })}
      </div>
    </MotionSection>
  );
}

// =============================================================================
// Variant E: Connected — disciplines linked by a horizontal gradient bridge
// =============================================================================
function ConnectedVariant({ bulletPoints, background }: BulletVariantsProps) {
  return (
    <MotionSection as="div" className="mx-auto max-w-4xl" delay={0.12}>
      <div className="relative">
        {/* Horizontal gradient bridge connecting all nodes (desktop only) */}
        <div
          className="absolute left-[calc(100%/6)] right-[calc(100%/6)] top-[28px] hidden h-px md:block"
          style={{ background: 'var(--pv-gradient)' }}
          aria-hidden="true"
        />

        <div className="grid gap-10 sm:grid-cols-3 sm:gap-6">
          {bulletPoints.map((point, i) => {
            const iconColor = getIconColor(i, bulletPoints.length);
            const IconComponent = point.icon ? iconMap[point.icon] : null;

            return (
              <MotionItem
                key={i}
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
                  {IconComponent && (
                    <IconComponent
                      className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: iconColor }}
                    />
                  )}
                </div>

                {/* Text */}
                <p className="text-[0.9375rem] leading-[1.75] text-[var(--pv-text-muted)] md:text-base md:leading-[1.8]">
                  {point.text}
                </p>
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
  timeline: TimelineVariant,
  panels: PanelsVariant,
  inline: InlineVariant,
  connected: ConnectedVariant,
};

export function BulletVariants({ bulletPoints, background, layout }: BulletVariantsProps) {
  // If an explicit layout is set, use it; otherwise fall back to the context switcher
  const { variant } = useBulletVariant();
  const resolvedLayout = layout ?? variant;
  const LayoutComponent = layoutComponents[resolvedLayout];

  return <LayoutComponent bulletPoints={bulletPoints} background={background} />;
}
