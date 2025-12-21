import { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { BookOpen, Search, PenTool, Target, MapPin, FileText } from 'lucide-react';
import { DocCard } from './components/doc-card';

export const metadata: Metadata = {
  title: 'Documentation | Dashboard | PixelVerse Studios',
  description: 'Reference guides and documentation for SEO, content, and development standards.',
};

const docs = [
  {
    title: 'SEO Checklist',
    description:
      'Comprehensive hyper-local SEO checklist prioritized by impact. Covers GBP optimization, NAP consistency, citations, and technical SEO.',
    href: '/dashboard/docs/seo-checklist',
    iconName: 'search' as const,
    accentColor: '#10b981',
    stats: {
      label: 'Sections',
      value: '12',
    },
  },
  {
    title: 'Blog Guidelines',
    description:
      'Standards for creating SEO-optimized, engaging blog content. Includes templates, checklists, and quality standards.',
    href: '/dashboard/docs/blog-guidelines',
    iconName: 'penTool' as const,
    accentColor: '#3b82f6',
    stats: {
      label: 'Sections',
      value: '7',
    },
  },
];

export default function DocsPage() {
  return (
    <main className="pb-16 pt-6 lg:pt-8">
      <Container className="max-w-5xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(63, 0, 233, 0.15), rgba(201, 71, 255, 0.08))',
                border: '1px solid rgba(63, 0, 233, 0.2)',
              }}
            >
              <BookOpen className="h-5 w-5" style={{ color: 'var(--pv-primary)' }} />
            </div>
            <div>
              <h1
                className="font-heading text-2xl font-bold md:text-3xl"
                style={{ color: 'var(--pv-text)' }}
              >
                Documentation
              </h1>
              <p className="text-sm" style={{ color: 'var(--pv-text-muted)' }}>
                Reference guides and standards for SEO and content
              </p>
            </div>
          </div>

          {/* Doc cards grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {docs.map((doc) => (
              <DocCard
                key={doc.href}
                title={doc.title}
                description={doc.description}
                href={doc.href}
                iconName={doc.iconName}
                accentColor={doc.accentColor}
                stats={doc.stats}
              />
            ))}
          </div>

          {/* Quick Reference Cards */}
          <div
            className="rounded-2xl border p-6"
            style={{
              background: 'var(--pv-surface)',
              borderColor: 'var(--pv-border)',
            }}
          >
            <h2 className="mb-6 text-base font-semibold" style={{ color: 'var(--pv-text)' }}>
              Quick Reference
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <QuickTip
                icon={Target}
                label="GBP Impact"
                value="32%"
                description="of local ranking"
                color="#10b981"
              />
              <QuickTip
                icon={MapPin}
                label="Priority Cities"
                value="3-5"
                description="focus before expanding"
                color="var(--pv-primary)"
              />
              <QuickTip
                icon={FileText}
                label="Content Depth"
                value="1,500+"
                description="words for city pages"
                color="#3b82f6"
              />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

function QuickTip({
  icon: Icon,
  label,
  value,
  description,
  color,
}: {
  icon: typeof Target;
  label: string;
  value: string;
  description: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
        style={{
          background: `linear-gradient(135deg, ${color}15, ${color}05)`,
          border: `1px solid ${color}20`,
        }}
      >
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div>
        <p
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: 'var(--pv-text-muted)' }}
        >
          {label}
        </p>
        <p className="text-xl font-bold" style={{ color: 'var(--pv-text)' }}>
          {value}
        </p>
        <p className="text-xs" style={{ color: 'var(--pv-text-muted)' }}>
          {description}
        </p>
      </div>
    </div>
  );
}
