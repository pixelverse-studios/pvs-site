import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { ArrowLeft } from 'lucide-react';
import {
  type SeoFocus,
  type SeoCity,
  emptySeoFocus,
  getPositionDisplay,
  getPriorityColor,
} from '@/lib/types/seo-focus';
import { getClient } from '@/lib/api/clients';
import type { Client, Website } from '@/lib/types/client';

export const metadata = {
  title: 'SEO Focus | Dashboard | PixelVerse Studios',
  description: 'Track hyper-local SEO progress for this website.',
};

export default async function SeoFocusPage({
  params,
}: {
  params: { id: string; websiteId: string };
}) {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch client from API (which includes websites with seo_focus)
  let client: Client;
  try {
    client = await getClient(params.id);
  } catch (error) {
    console.error('Error fetching client:', error);
    notFound();
  }

  // Find the specific website
  const website = client.websites?.find((w) => w.id === params.websiteId);
  if (!website) {
    notFound();
  }

  // Parse seo_focus - API returns it as a JSON string
  let seoFocus: SeoFocus = emptySeoFocus;
  if (website.seo_focus) {
    try {
      const parsed =
        typeof website.seo_focus === 'string' ? JSON.parse(website.seo_focus) : website.seo_focus;
      seoFocus = {
        strategy: parsed.strategy || undefined,
        goal: parsed.goal || undefined,
        primaryCities: parsed.primaryCities || parsed.primary_cities || [],
        secondaryCities: parsed.secondaryCities || parsed.secondary_cities || [],
        countyKeywords: parsed.countyKeywords || parsed.county_keywords || [],
        lastUpdated: parsed.lastUpdated || parsed.last_updated || undefined,
      };
    } catch (e) {
      console.error('Failed to parse seo_focus:', e);
    }
  }
  const clientName = [client.firstname, client.lastname].filter(Boolean).join(' ') || 'Client';

  // Calculate stats
  const totalKeywords = [
    ...(seoFocus.primaryCities?.flatMap((c) => c.targetKeywords) || []),
    ...(seoFocus.secondaryCities?.flatMap((c) => c.targetKeywords) || []),
  ];
  const rankingKeywords = totalKeywords.filter((k) => k.currentPosition !== null);

  return (
    <main className="pb-16 pt-8 md:pb-24">
      <Container className="max-w-6xl space-y-8">
        {/* Back Link */}
        <Link
          href={`/dashboard/clients/${params.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {clientName}
        </Link>

        {/* Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
                SEO Focus Tracker
              </div>
              <h1 className="mt-3 text-3xl font-bold md:text-4xl">{website.title}</h1>
              <p className="mt-2 text-[var(--pv-text-muted)]">
                Track hyper-local SEO progress for {website.domain}
              </p>
            </div>
          </div>
        </header>

        {seoFocus.primaryCities?.length > 0 || seoFocus.secondaryCities?.length > 0 ? (
          <>
            {/* Strategy Summary */}
            <section className="rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-5">
              <div className="from-[var(--pv-primary)]/10 via-[var(--pv-primary)]/5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--pv-border)] bg-gradient-to-r to-transparent p-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
                    Strategy
                  </p>
                  <h2 className="text-lg font-semibold text-[var(--pv-text)] md:text-xl">
                    {seoFocus.goal || 'No goal set'}
                  </h2>
                  {seoFocus.strategy && (
                    <p className="text-sm text-[var(--pv-text-muted)]">{seoFocus.strategy}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {seoFocus.primaryCities?.length > 0 && (
                    <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {seoFocus.primaryCities.length} Primary Cities
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[var(--pv-border)] bg-[var(--pv-bg)] p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                    Total Keywords
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[var(--pv-text)]">
                    {totalKeywords.length}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--pv-border)] bg-[var(--pv-bg)] p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                    Ranking
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[var(--pv-text)]">
                    {rankingKeywords.length}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--pv-border)] bg-[var(--pv-bg)] p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                    Last Updated
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--pv-text)]">
                    {seoFocus.lastUpdated || 'Unknown'}
                  </p>
                </div>
              </div>
            </section>

            {/* Primary Focus Cities */}
            {seoFocus.primaryCities?.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[var(--pv-text)]">Primary Focus</h2>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Active
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {seoFocus.primaryCities.map((city) => (
                    <CityCard key={city.slug} city={city} />
                  ))}
                </div>
              </section>
            )}

            {/* High Priority Keywords Table */}
            {seoFocus.primaryCities?.some((c) => c.targetKeywords?.length > 0) && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-[var(--pv-text)]">
                  High-Priority Keywords
                </h2>

                <div className="overflow-hidden rounded-xl border border-[var(--pv-border)]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-[var(--pv-surface)]">
                        <tr className="border-b border-[var(--pv-border)]">
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                            Keyword
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                            City
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                            Current
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                            Target
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-[var(--pv-bg)]">
                        {seoFocus.primaryCities.flatMap((city) =>
                          (city.targetKeywords || [])
                            .filter((kw) => kw.priority === 'high')
                            .map((kw) => (
                              <tr
                                key={`${city.slug}-${kw.keyword}`}
                                className="border-b border-[var(--pv-border)] last:border-0"
                              >
                                <td className="px-4 py-2.5 text-[var(--pv-text)]">{kw.keyword}</td>
                                <td className="px-4 py-2.5 text-[var(--pv-text-muted)]">
                                  {city.city}
                                </td>
                                <td className="px-4 py-2.5 text-center font-mono text-[var(--pv-text)]">
                                  {kw.currentPosition ? `#${Math.round(kw.currentPosition)}` : '—'}
                                </td>
                                <td className="px-4 py-2.5 text-center font-mono text-[var(--pv-text-muted)]">
                                  #{kw.targetPosition}
                                </td>
                              </tr>
                            )),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* County/Regional Keywords */}
            {seoFocus.countyKeywords && seoFocus.countyKeywords.length > 0 && (
              <section className="rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                  Regional Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {seoFocus.countyKeywords.map((kw) => (
                    <span
                      key={kw.keyword}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${getPriorityColor(kw.priority)}`}
                    >
                      {kw.keyword}
                      {kw.currentPosition && (
                        <span className="font-mono opacity-70">
                          #{Math.round(kw.currentPosition)}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Secondary Focus Cities */}
            {seoFocus.secondaryCities?.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[var(--pv-text)]">Upcoming Focus</h2>
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Pending
                  </span>
                </div>

                <p className="text-sm text-[var(--pv-text-muted)]">
                  These cities will be prioritized after primary targets are ranking.
                </p>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {seoFocus.secondaryCities.map((city) => (
                    <div
                      key={city.slug}
                      className="rounded-lg border border-[var(--pv-border)] bg-[var(--pv-surface)] p-3 opacity-60"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--pv-text-muted)]">
                          #{city.rank}
                        </span>
                        {city.currentPosition && (
                          <span className="font-mono text-[10px] text-[var(--pv-text-muted)]">
                            Pos {Math.round(city.currentPosition)}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1 text-sm font-medium text-[var(--pv-text)]">
                        {city.city}
                      </h3>
                      {city.population && (
                        <p className="text-[10px] text-[var(--pv-text-muted)]">{city.population}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Footer */}
            {seoFocus.lastUpdated && (
              <footer className="rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-4 text-center">
                <p className="text-xs text-[var(--pv-text-muted)]">
                  Last updated: {seoFocus.lastUpdated}
                </p>
              </footer>
            )}
          </>
        ) : (
          /* Empty State */
          <section className="rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-8 text-center">
            <div className="mx-auto max-w-md space-y-4">
              <div className="bg-[var(--pv-primary)]/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                <svg
                  className="h-8 w-8 text-[var(--pv-primary)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[var(--pv-text)]">No SEO Focus Data</h2>
              <p className="text-[var(--pv-text-muted)]">
                No SEO focus tracking has been configured for this website yet. Add SEO focus data
                to start tracking keyword rankings and city targets.
              </p>
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}

// Priority border color helper
function getPriorityBorderColor(priority: 'high' | 'medium' | 'low'): string {
  switch (priority) {
    case 'high':
      return 'border-l-red-500';
    case 'medium':
      return 'border-l-amber-500';
    case 'low':
      return 'border-l-slate-400';
  }
}

// City Card Component
function CityCard({ city }: { city: SeoCity }) {
  // Sort keywords by priority: high first, then medium, then low
  const sortedKeywords = [...(city.targetKeywords || [])].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <article className="hover:border-[var(--pv-primary)]/30 group relative rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-4 transition-all hover:shadow-lg">
      {/* Rank Badge */}
      <div className="absolute -left-2.5 -top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--pv-primary)] text-xs font-bold text-white shadow-md">
        {city.rank}
      </div>

      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between pt-1">
          <div>
            <h3 className="text-lg font-bold text-[var(--pv-text)]">
              {city.city}, {city.state}
            </h3>
            {city.population && (
              <p className="text-xs text-[var(--pv-text-muted)]">{city.population}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
              Position
            </p>
            <p className="font-mono text-lg font-bold text-[var(--pv-text)]">
              {getPositionDisplay(city.currentPosition)}
            </p>
          </div>
        </div>

        {/* Why Priority */}
        {city.whyPriority && (
          <p className="text-xs text-[var(--pv-text-muted)]">{city.whyPriority}</p>
        )}

        {/* Keywords - Full List */}
        {sortedKeywords.length > 0 && (
          <div className="space-y-2 border-t border-[var(--pv-border)] pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
              Target Keywords ({sortedKeywords.length})
            </p>
            <div className="space-y-1.5">
              {sortedKeywords.map((kw) => (
                <div
                  key={kw.keyword}
                  className={`flex items-center justify-between rounded-md border-l-2 bg-[var(--pv-bg)] px-2.5 py-1.5 ${getPriorityBorderColor(kw.priority)}`}
                >
                  <span className="text-xs text-[var(--pv-text)]">{kw.keyword}</span>
                  <div className="ml-2 flex items-center gap-1.5 whitespace-nowrap">
                    <span className="font-mono text-xs font-semibold text-[var(--pv-text)]">
                      {kw.currentPosition ? `#${Math.round(kw.currentPosition)}` : '—'}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--pv-text-muted)]">
                      → #{kw.targetPosition}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
