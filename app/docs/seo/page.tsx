import type { Metadata } from 'next';

import { Container } from '@/components/ui/container';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'SEO Updates Log | PixelVerse Studios',
  description:
    'Reference log of recent SEO updates, affected URLs, and indexing actions for PixelVerse Studios.',
  path: '/docs/seo',
  keywords: [
    'PixelVerse SEO log',
    'SEO updates',
    'indexing checklist',
    'Bergen County SEO changes',
    'local SEO updates',
  ],
});

const updates = [
  {
    date: '2025-11-20',
    items: [
      'Refreshed metadata and hero copy on Bergen County hub to target “Bergen County SEO & web design” plus analytics reporting.',
      'Added FAQs on Bergen hub for website analytics agency + website design agency Bergen County queries.',
      'Moved Bergen hub CTA near the top to drive contact for local traffic.',
      'Tuned Fort Lee metadata to include “seo fort lee” and SEO agency phrasing.',
      'Updated Paramus metadata with “website design Paramus NJ” and added local SEO FAQ.',
      'Updated Englewood metadata with “local SEO agency Englewood NJ” and added local SEO FAQ.',
      'Added Bergen hub CTAs/links from Home services block, Services intro, and Blog hero to channel visitors to local pages.',
      'Published blog: Local SEO Title & Meta Playbook (CTR-first snippet guide).',
    ],
    urlsToReindex: [
      '/services/bergen-county',
      '/services/fort-lee',
      '/services/paramus',
      '/services/englewood',
      '/',
      '/services',
      '/blog',
      '/blog/local-seo-title-meta-playbook',
    ],
    notes: 'Request indexing post-deploy; monitor CTR and positions for Bergen County/local queries over 7–14 days.',
  },
];

export default function SeoUpdatesPage() {
  return (
    <main className="bg-[var(--pv-bg)] pb-16">
      <Container className="pt-hero space-y-12">
        <header className="space-y-4">
          <div className="inline-flex rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--pv-text-muted)]">
            SEO Updates Log
          </div>
          <h1 className="font-heading text-4xl font-semibold leading-[3rem] text-[var(--pv-text)] md:text-[2.75rem]">
            Recent SEO changes and indexing checklist
          </h1>
          <p className="max-w-2xl text-lg text-[var(--pv-text-muted)]">
            Quick reference for what changed, which URLs to request indexing for, and what to monitor in Search Console.
          </p>
        </header>

        <section className="space-y-10 rounded-pv border border-[var(--pv-border)] bg-[var(--pv-surface)]/70 p-6 shadow-[0_24px_60px_-40px_rgba(63,0,233,0.35)] dark:bg-[var(--pv-surface)]/80">
          {updates.map((update) => (
            <div key={update.date} className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.3em] text-[var(--pv-text-muted)]">Update</p>
                <h2 className="font-heading text-2xl font-semibold text-[var(--pv-text)]">{update.date}</h2>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--pv-text-muted)]">
                  What changed
                </h3>
                <ul className="space-y-2 text-base leading-7 text-[var(--pv-text-muted)]">
                  {update.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-[0.4rem] inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--pv-primary)]" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--pv-text-muted)]">
                  URLs to request indexing
                </h3>
                <div className="flex flex-wrap gap-2">
                  {update.urlsToReindex.map((url) => (
                    <code
                      key={url}
                      className="rounded-full bg-[var(--pv-bg)] px-3 py-1 text-sm text-[var(--pv-text)] shadow-sm border border-[var(--pv-border)]"
                    >
                      {url}
                    </code>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--pv-text-muted)]">
                  Notes
                </h3>
                <p className="text-base leading-7 text-[var(--pv-text-muted)]">{update.notes}</p>
              </div>
            </div>
          ))}
        </section>
      </Container>
    </main>
  );
}
