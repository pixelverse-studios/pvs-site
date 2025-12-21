import fs from 'fs';
import type { Metadata } from 'next';
import path from 'path';

import { Container } from '@/components/ui/container';
import { DownloadSitemapButton } from '@/components/ui/download-sitemap-button';
import { createPageMetadata } from '@/lib/metadata';

function getSitemapUrls() {
  try {
    const sitemapIndexPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    const sitemapIndex = fs.readFileSync(sitemapIndexPath, 'utf8');
    const sitemapEntries = Array.from(sitemapIndex.matchAll(/<loc>(.*?)<\/loc>/g)).map(
      (match) => match[1],
    );

    const urls = new Set<string>();

    sitemapEntries.forEach((entry) => {
      try {
        const fileName = path.basename(new URL(entry).pathname);
        const sitemapPath = path.join(process.cwd(), 'public', fileName);

        if (!fs.existsSync(sitemapPath)) return;

        const sitemap = fs.readFileSync(sitemapPath, 'utf8');
        Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g)).forEach((match) => urls.add(match[1]));
      } catch {
        // Ignore malformed sitemap entries
      }
    });

    return Array.from(urls);
  } catch {
    return null;
  }
}

function formatDateIsoToMdY(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

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
metadata.robots = {
  index: false,
  follow: false,
};

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
    notes:
      'Deployed Bergen County SEO updates across hub and city pages plus a CTR-focused blog post; keep indexing tight and monitor performance closely post-publish.',
    notesDetail: [
      'Submit manual index requests for the Bergen hub and each city page immediately after deploy to speed pickup.',
      'Watch CTR and position for Bergen/local queries over 7–14 days; refine titles/meta if CTR stays soft.',
      'Keep internal links to Bergen hub from home/services/blog sections so crawl frequency and authority stay high.',
    ],
  },
];

export default function SeoUpdatesPage() {
  const sitemapUrls = getSitemapUrls();
  const sitemapUrlCount = sitemapUrls?.length ?? null;

  return (
    <main className="bg-[var(--pv-bg)] pb-16">
      <Container className="space-y-12 pt-hero">
        <header className="space-y-4">
          <div className="inline-flex rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--pv-text-muted)]">
            SEO Updates Log
          </div>
          <h1 className="font-heading text-4xl font-semibold leading-[3rem] text-[var(--pv-text)] md:text-[2.75rem]">
            Recent SEO changes and indexing checklist
          </h1>
          <p className="max-w-2xl text-lg text-[var(--pv-text-muted)]">
            Quick reference for what changed, sitemap coverage, and what to monitor in Search
            Console.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex flex-wrap items-center gap-3 rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-2 text-sm text-[var(--pv-text-muted)]">
              <span className="font-semibold text-[var(--pv-text)]">{sitemapUrlCount ?? '—'}</span>
              <span>unique URLs currently listed in the sitemap</span>
            </div>
            <DownloadSitemapButton urls={sitemapUrls ?? []} />
          </div>
        </header>

        <section className="space-y-10">
          {updates.map((update) => (
            <article
              key={update.date}
              className="bg-[var(--pv-surface)]/70 dark:bg-[var(--pv-surface)]/85 space-y-6 rounded-3xl border border-[var(--pv-border)] p-6 shadow-[0_32px_80px_-48px_rgba(63,0,233,0.35)]"
            >
              <div className="from-[var(--pv-primary)]/12 via-[var(--pv-primary)]/6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--pv-border)] bg-gradient-to-r to-[var(--pv-surface)] p-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--pv-text-muted)]">
                    Update
                  </p>
                  <h2 className="font-heading text-2xl font-semibold text-[var(--pv-text)]">
                    {formatDateIsoToMdY(update.date)}
                  </h2>
                </div>
                <div className="rounded-full border border-[var(--pv-border)] bg-[var(--pv-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
                  SEO log
                </div>
              </div>

              <div className="bg-[var(--pv-bg)]/92 space-y-6 rounded-2xl border border-[var(--pv-border)] p-6 shadow-[0_18px_50px_-42px_rgba(63,0,233,0.3)]">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--pv-text-muted)]">
                    Overview
                  </h3>
                  <p className="text-base leading-7 text-[var(--pv-text-muted)]">{update.notes}</p>
                </div>

                <div className="space-y-3 border-t border-[var(--pv-border)] pt-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--pv-text-muted)]">
                    What changed
                  </h3>
                  <ul className="space-y-2 text-base leading-7 text-[var(--pv-text-muted)]">
                    {update.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span
                          className="mt-[0.5rem] inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--pv-primary)]"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 border-t border-[var(--pv-border)] pt-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--pv-text-muted)]">
                    Action checklist
                  </h3>
                  <ul className="space-y-2 text-base leading-7 text-[var(--pv-text-muted)]">
                    {update.notesDetail.map((note) => (
                      <li key={note} className="flex gap-3">
                        <span
                          className="mt-[0.5rem] inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--pv-primary)]"
                          aria-hidden
                        />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </section>
      </Container>
    </main>
  );
}
