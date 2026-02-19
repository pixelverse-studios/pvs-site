import { CheckCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MotionItem, MotionSection } from '@/components/ui/motion-section';

export interface ServiceBulletItem {
  icon?: LucideIcon;
  title: string;
  description: string;
}

/**
 * Card-based bullet list with icon, title, and description per item.
 *
 * Use this component when bullets have distinct **titles and supporting descriptions**
 * (e.g., a features grid or named process steps with explanations).
 *
 * For simple bullet lists where each item is a **single plain string** (e.g., criteria
 * or expectation lists), use `ServiceNarrativeSection` with `layout="text-with-bullets"`
 * and pass the strings to the `bullets` prop instead — that pattern is lighter and
 * matches the SEO and Web Development service page content structures.
 *
 * @example Rich card bullets (features or named process steps)
 * ```tsx
 * <ServiceBulletList
 *   items={[
 *     { icon: Search, title: 'Local Visibility Audit', description: 'We review...' },
 *     { icon: FileText, title: 'Content Clarity Review', description: 'We assess...' },
 *   ]}
 *   layout="grid"
 * />
 * ```
 *
 * @example Simple string bullets — use ServiceNarrativeSection instead
 * ```tsx
 * // ✅ Correct for plain string bullets (SEO / Web Dev page sections)
 * <ServiceNarrativeSection
 *   eyebrow="What to Expect"
 *   title="..."
 *   intro="..."
 *   bullets={['Reorganizing service pages', 'Refining messaging', ...]}
 *   layout="text-with-bullets"
 * />
 *
 * // ❌ Incorrect — ServiceBulletList requires { title, description } per item
 * <ServiceBulletList items={['Reorganizing service pages', ...]} />
 * ```
 */
export interface ServiceBulletListProps {
  items: ServiceBulletItem[];
  layout?: 'grid' | 'vertical';
}

export function ServiceBulletList({ items, layout = 'grid' }: ServiceBulletListProps) {
  if (!items.length) return null;

  const containerClass =
    layout === 'grid'
      ? 'grid grid-cols-1 gap-6 md:grid-cols-2'
      : 'flex flex-col gap-4';

  return (
    <MotionSection as="div" className={containerClass}>
      {items.map(({ icon: Icon = CheckCircle, title, description }, index) => (
        <MotionItem
          key={title}
          delay={index * 0.08}
          triggerOnViewport={false}
          className="h-full"
        >
          <Card className="group flex h-full flex-col overflow-hidden bg-[var(--pv-bg)]/90 transition-all duration-300 dark:bg-[var(--pv-surface)]/90 hover:-translate-y-1 hover:border-[var(--pv-primary)] hover:shadow-[0_24px_50px_-36px_rgba(63,0,233,0.75)]">
            <CardHeader className="flex flex-row items-start gap-4 pb-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_18px_38px_-28px_rgba(63,0,233,0.9)] transition-transform duration-300 group-hover:-translate-y-0.5">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <CardTitle className="text-lg text-[var(--pv-text)]">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="leading-6">
                {description}
              </CardDescription>
            </CardContent>
          </Card>
        </MotionItem>
      ))}
    </MotionSection>
  );
}
