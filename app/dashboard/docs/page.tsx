import { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { BookOpen } from 'lucide-react';
import { DocCard } from './components/doc-card';

export const metadata: Metadata = {
  title: 'Documentation | Dashboard | PixelVerse Studios',
  description: 'Reference guides and documentation for SEO, content, and development standards.',
};

const docs = [
  {
    title: 'SEO Checklist',
    description: 'Comprehensive hyper-local SEO checklist prioritized by impact. Covers GBP optimization, NAP consistency, citations, and technical SEO.',
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
    description: 'Standards for creating SEO-optimized, engaging blog content. Includes templates, checklists, and quality standards.',
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
    <main className="pb-16 pt-8 md:pb-24">
      <Container className="max-w-5xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <div
              className="mx-auto mb-4 inline-flex rounded-2xl p-4"
              style={{
                background: 'linear-gradient(135deg, rgba(63, 0, 233, 0.1), rgba(201, 71, 255, 0.1))',
                border: '1px solid rgba(63, 0, 233, 0.2)',
              }}
            >
              <BookOpen
                className="h-8 w-8"
                style={{ color: 'var(--pv-primary)' }}
              />
            </div>
            <h1
              className="mb-3 text-4xl font-bold md:text-5xl"
              style={{ color: 'var(--pv-text)' }}
            >
              Documentation
            </h1>
            <p
              className="mx-auto max-w-xl text-lg"
              style={{ color: 'var(--pv-text-muted)' }}
            >
              Reference guides and standards for SEO, content creation, and development workflows.
            </p>
          </div>

          {/* Doc cards grid */}
          <div className="grid gap-6 md:grid-cols-2">
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

          {/* Quick tips section */}
          <div
            className="rounded-2xl border p-6"
            style={{
              background: 'var(--pv-surface)',
              borderColor: 'var(--pv-border)',
            }}
          >
            <h2
              className="mb-4 text-lg font-semibold"
              style={{ color: 'var(--pv-text)' }}
            >
              Quick Reference
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <QuickTip
                label="GBP Impact"
                value="32%"
                description="of local ranking"
              />
              <QuickTip
                label="Priority Cities"
                value="3-5"
                description="focus before expanding"
              />
              <QuickTip
                label="Content Depth"
                value="1,500+"
                description="words for city pages"
              />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

function QuickTip({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="text-center">
      <p
        className="text-xs font-medium uppercase tracking-wider"
        style={{ color: 'var(--pv-text-muted)' }}
      >
        {label}
      </p>
      <p
        className="my-1 text-2xl font-bold"
        style={{
          background: 'var(--pv-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {value}
      </p>
      <p
        className="text-sm"
        style={{ color: 'var(--pv-text-muted)' }}
      >
        {description}
      </p>
    </div>
  );
}
