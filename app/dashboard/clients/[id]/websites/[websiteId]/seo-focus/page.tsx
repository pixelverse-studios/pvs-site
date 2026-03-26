import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  CheckCircle2,
  Target,
  Calendar,
} from 'lucide-react';
import {
  type SeoFocus,
  type SeoCity,
  emptySeoFocus,
  getPositionDisplay,
} from '@/lib/types/seo-focus';
import { getClient } from '@/lib/api/clients';
import { getWebsiteSeo, getWebsiteSeoAudits } from '@/lib/api/seo';
import type { Client } from '@/lib/types/client';
import type {
  WebsiteSeoResponse,
  AuditHistoryResponse,
  ChecklistItem,
  ChangelogEntry,
  KeywordRecord,
} from '@/lib/api/seo';

export const metadata = {
  title: 'SEO Focus | Dashboard | PixelVerse Studios',
  description: 'Track hyper-local SEO progress for this website.',
  robots: { index: false, follow: false },
};

export default async function SeoFocusPage({
  params,
}: {
  params: Promise<{ id: string; websiteId: string }>;
}) {
  const { id, websiteId } = await params;
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let client: Client;
  try {
    client = await getClient(id);
  } catch (error) {
    console.error('Error fetching client:', error);
    notFound();
  }

  const website = client.websites?.find((w) => w.id === websiteId);
  if (!website) {
    notFound();
  }

  // Fetch SEO API data in parallel with seo_focus parsing
  const [seoData, auditHistory] = await Promise.all([
    getWebsiteSeo(websiteId).catch(() => null as WebsiteSeoResponse | null),
    getWebsiteSeoAudits(websiteId, { limit: 10 }).catch(
      () => null as AuditHistoryResponse | null,
    ),
  ]);

  // Parse legacy seo_focus data for city cards
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
  const audit = seoData?.latest_audit;
  const hasAuditData = audit !== null && audit !== undefined;
  const hasCityData =
    (seoFocus.primaryCities?.length || 0) > 0 || (seoFocus.secondaryCities?.length || 0) > 0;

  return (
    <main className="pb-16 pt-8 md:pb-24">
      <Container className="max-w-6xl space-y-8">
        {/* Back Link */}
        <Link
          href={`/dashboard/clients/${id}`}
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
                SEO Dashboard
              </div>
              <h1 className="mt-3 text-3xl font-bold md:text-4xl">{website.title}</h1>
              <p className="mt-2 text-[var(--pv-text-muted)]">
                SEO health and keyword tracking for {website.domain}
              </p>
            </div>
            {hasAuditData && (
              <ScoreBadgeLarge score={audit.score} grade={audit.grade} />
            )}
          </div>
        </header>

        {/* Overview Cards */}
        {hasAuditData && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewCard
              label="SEO Score"
              value={`${audit.score}/100`}
              sub={`Grade: ${audit.grade}`}
              icon={<BarChart3 className="h-4 w-4" />}
              color={audit.score >= 80 ? '#22c55e' : audit.score >= 60 ? '#f59e0b' : '#ef4444'}
            />
            <OverviewCard
              label="Checklist"
              value={
                audit.checklist.length > 0
                  ? `${Math.round(audit.checklist.reduce((s, c) => s + c.pct, 0) / audit.checklist.length)}%`
                  : '—'
              }
              sub={`${audit.checklist.reduce((s, c) => s + c.completed, 0)} of ${audit.checklist.reduce((s, c) => s + c.total, 0)} items`}
              icon={<CheckCircle2 className="h-4 w-4" />}
              color="#8b5cf6"
            />
            <OverviewCard
              label="Keywords"
              value={`${seoData?.keywords.ranking || 0}/${seoData?.keywords.total || 0}`}
              sub={
                seoData?.keywords.avg_position
                  ? `Avg position: ${seoData.keywords.avg_position.toFixed(1)}`
                  : 'No ranking data'
              }
              icon={<Target className="h-4 w-4" />}
              color="#3b82f6"
            />
            <OverviewCard
              label="Next Audit"
              value={
                audit.next_audit_due
                  ? new Date(audit.next_audit_due).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  : '—'
              }
              sub={
                audit.next_audit_due && new Date(audit.next_audit_due) < new Date()
                  ? 'Overdue'
                  : 'Scheduled'
              }
              icon={<Calendar className="h-4 w-4" />}
              color={
                audit.next_audit_due && new Date(audit.next_audit_due) < new Date()
                  ? '#ef4444'
                  : '#10b981'
              }
            />
          </div>
        )}

        {/* Changelog */}
        {hasAuditData && audit.changelog.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--pv-text)]">Recent Changes</h2>
            <Card>
              <CardContent className="p-5">
                <div className="space-y-0">
                  {audit.changelog
                    .slice()
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((entry, i) => (
                      <ChangelogRow
                        key={`${entry.date}-${i}`}
                        entry={entry}
                        isLast={i === audit.changelog.length - 1}
                      />
                    ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Checklist Breakdown */}
        {hasAuditData && audit.checklist.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--pv-text)]">Checklist Progress</h2>
            <Card>
              <CardContent className="p-5">
                <div className="space-y-4">
                  {audit.checklist.map((item) => (
                    <ChecklistBar key={item.category} item={item} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Keywords from API */}
        {seoData && seoData.keywords.items.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--pv-text)]">Keyword Rankings</h2>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--pv-surface)]">
                    <tr className="border-b border-[var(--pv-border)]">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                        Keyword
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                        Position
                      </th>
                      <th className="hidden px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] sm:table-cell">
                        Previous
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                        Trend
                      </th>
                      <th className="hidden px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] md:table-cell">
                        Volume
                      </th>
                      <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] lg:table-cell">
                        City
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--pv-border)]">
                    {seoData.keywords.items.map((kw) => (
                      <KeywordRow key={kw.keyword} keyword={kw} />
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}

        {/* Audit History */}
        {auditHistory && auditHistory.audits.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--pv-text)]">Audit History</h2>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--pv-surface)]">
                    <tr className="border-b border-[var(--pv-border)]">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                        Date
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                        Score
                      </th>
                      <th className="hidden px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] sm:table-cell">
                        Checklist
                      </th>
                      <th className="hidden px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] md:table-cell">
                        Findings
                      </th>
                      <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] md:table-cell">
                        Auditor
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--pv-border)]">
                    {auditHistory.audits.map((a) => (
                      <tr key={a.id} className="transition-colors hover:bg-[var(--pv-surface)]">
                        <td className="px-4 py-3 text-[var(--pv-text)]">
                          {new Date(a.audit_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <SmallScoreBadge score={a.score} grade={a.grade} />
                        </td>
                        <td className="hidden px-4 py-3 text-center sm:table-cell">
                          <span className="text-[var(--pv-text)]">{a.checklist_pct}%</span>
                        </td>
                        <td className="hidden px-4 py-3 text-center md:table-cell">
                          <span className="text-[var(--pv-text)]">{a.findings_count}</span>
                        </td>
                        <td className="hidden px-4 py-3 text-[var(--pv-text-muted)] md:table-cell">
                          {a.auditor}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}

        {/* Competitors */}
        {seoData && seoData.competitors.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--pv-text)]">Competitor Analysis</h2>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--pv-surface)]">
                    <tr className="border-b border-[var(--pv-border)]">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                        Domain
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                        DA Score
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                        Keyword Overlap
                      </th>
                      <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] md:table-cell">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--pv-border)]">
                    {seoData.competitors.map((comp) => (
                      <tr
                        key={comp.competitor_domain}
                        className="transition-colors hover:bg-[var(--pv-surface)]"
                      >
                        <td className="px-4 py-3 font-medium text-[var(--pv-text)]">
                          {comp.competitor_domain}
                        </td>
                        <td className="px-4 py-3 text-center text-[var(--pv-text)]">
                          {comp.da_score !== null ? comp.da_score : '—'}
                        </td>
                        <td className="px-4 py-3 text-center text-[var(--pv-text)]">
                          {comp.keyword_overlap !== null ? comp.keyword_overlap : '—'}
                        </td>
                        <td className="hidden px-4 py-3 text-[var(--pv-text-muted)] md:table-cell">
                          {comp.notes || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}

        {/* Score Trend */}
        {seoData && seoData.trend.scores.length > 1 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--pv-text)]">Score Trend</h2>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-end gap-2" style={{ height: '120px' }}>
                  {(() => {
                    const maxScore = Math.max(...seoData.trend.scores);
                    return seoData.trend.scores.map((score, i) => {
                      const heightPct = maxScore > 0 ? (score / maxScore) * 100 : 0;
                      const color =
                        score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
                      return (
                        <div
                          key={`${seoData.trend.dates[i]}-${i}`}
                          className="flex flex-1 flex-col items-center gap-1"
                        >
                          <span className="text-xs font-medium text-[var(--pv-text)]">{score}</span>
                          <div
                            className="w-full rounded-t-md transition-all"
                            style={{
                              height: `${heightPct}%`,
                              minHeight: '4px',
                              background: color,
                              opacity: 0.8,
                            }}
                          />
                          <span className="text-[10px] text-[var(--pv-text-muted)]">
                            {new Date(seoData.trend.dates[i]).toLocaleDateString('en-US', {
                              month: 'short',
                            })}
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Legacy City Cards (from seo_focus JSONB) */}
        {hasCityData && (
          <>
            {/* Strategy Summary */}
            {seoFocus.goal && (
              <section className="rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-5">
                <div className="from-[var(--pv-primary)]/10 via-[var(--pv-primary)]/5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--pv-border)] bg-gradient-to-r to-transparent p-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
                      Local SEO Strategy
                    </p>
                    <h2 className="text-lg font-semibold text-[var(--pv-text)] md:text-xl">
                      {seoFocus.goal}
                    </h2>
                    {seoFocus.strategy && (
                      <p className="text-sm text-[var(--pv-text-muted)]">{seoFocus.strategy}</p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Primary Focus Cities */}
            {seoFocus.primaryCities?.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[var(--pv-text)]">
                    Priority City Targets
                  </h2>
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

            {/* Secondary Cities */}
            {seoFocus.secondaryCities?.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[var(--pv-text)]">Upcoming Focus</h2>
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Pending
                  </span>
                </div>
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
          </>
        )}

        {/* Empty State — no audit data AND no city data */}
        {!hasAuditData && !hasCityData && (
          <section className="rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-8 text-center">
            <div className="mx-auto max-w-md space-y-4">
              <BarChart3 className="mx-auto h-12 w-12 text-[var(--pv-text-muted)]" />
              <h2 className="text-xl font-semibold text-[var(--pv-text)]">No SEO Data</h2>
              <p className="text-[var(--pv-text-muted)]">
                No audit data or SEO focus tracking has been configured for this website yet. Run an
                SEO audit to start tracking health metrics.
              </p>
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function ScoreBadgeLarge({ score, grade }: { score: number; grade: string }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div
      className="flex flex-col items-center rounded-2xl border px-6 py-4"
      style={{ borderColor: `${color}30`, background: `${color}08` }}
    >
      <span className="font-heading text-3xl font-bold" style={{ color }}>
        {score}
      </span>
      <span className="text-sm font-semibold" style={{ color }}>
        {grade}
      </span>
    </div>
  );
}

function SmallScoreBadge({ score, grade }: { score: number; grade: string }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
    >
      {score} <span className="opacity-60">{grade}</span>
    </span>
  );
}

function OverviewCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: `${color}15`, color }}
          >
            {icon}
          </div>
          <span className="text-sm font-medium text-[var(--pv-text-muted)]">{label}</span>
        </div>
        <p className="font-heading text-2xl font-bold" style={{ color: 'var(--pv-text)' }}>
          {value}
        </p>
        <p className="mt-0.5 text-xs" style={{ color: 'var(--pv-text-muted)' }}>
          {sub}
        </p>
      </CardContent>
    </Card>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  technical: '#3b82f6',
  content: '#8b5cf6',
  local: '#f59e0b',
  backlinks: '#10b981',
};

const IMPACT_COLORS: Record<string, string> = {
  positive: '#22c55e',
  negative: '#ef4444',
  neutral: '#6b7280',
};

function ChangelogRow({ entry, isLast }: { entry: ChangelogEntry; isLast: boolean }) {
  const catColor = CATEGORY_COLORS[(entry.category || '').toLowerCase()] || '#6b7280';
  const impactColor = IMPACT_COLORS[(entry.impact || '').toLowerCase()] || IMPACT_COLORS.neutral;

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full"
          style={{ background: impactColor }}
        />
        {!isLast && <div className="w-px flex-1 bg-[var(--pv-border)]" />}
      </div>
      <div className="flex-1 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--pv-text-muted)]">
            {new Date(entry.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{
              background: `${catColor}15`,
              color: catColor,
              border: `1px solid ${catColor}30`,
            }}
          >
            {entry.category}
          </span>
        </div>
        <p className="mt-1 text-sm text-[var(--pv-text)]">{entry.description}</p>
      </div>
    </div>
  );
}

function ChecklistBar({ item }: { item: ChecklistItem }) {
  const color = item.pct >= 80 ? '#22c55e' : item.pct >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--pv-text)]">{item.category}</span>
        <span className="text-sm text-[var(--pv-text-muted)]">
          {item.completed}/{item.total} ({item.pct}%)
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--pv-border)]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${item.pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

function KeywordRow({ keyword: kw }: { keyword: KeywordRecord }) {
  return (
    <tr className="transition-colors hover:bg-[var(--pv-surface)]">
      <td className="px-4 py-3 font-medium text-[var(--pv-text)]">{kw.keyword}</td>
      <td className="px-4 py-3 text-center font-mono text-[var(--pv-text)]">
        {kw.position !== null ? `#${kw.position}` : '—'}
      </td>
      <td className="hidden px-4 py-3 text-center font-mono text-[var(--pv-text-muted)] sm:table-cell">
        {kw.previous_position !== null ? `#${kw.previous_position}` : '—'}
      </td>
      <td className="px-4 py-3 text-center">
        <TrendBadge trend={kw.trend} />
      </td>
      <td className="hidden px-4 py-3 text-center text-[var(--pv-text-muted)] md:table-cell">
        {kw.search_volume !== null ? kw.search_volume.toLocaleString() : '—'}
      </td>
      <td className="hidden px-4 py-3 text-[var(--pv-text-muted)] lg:table-cell">
        {kw.target_city || '—'}
      </td>
    </tr>
  );
}

function TrendBadge({ trend }: { trend: KeywordRecord['trend'] }) {
  const config: Record<string, { color: string; label: string; Icon: typeof TrendingUp | typeof TrendingDown | typeof Minus }> = {
    up: { color: '#22c55e', label: 'Up', Icon: TrendingUp },
    down: { color: '#ef4444', label: 'Down', Icon: TrendingDown },
    stable: { color: '#6b7280', label: 'Stable', Icon: Minus },
    new: { color: '#3b82f6', label: 'New', Icon: TrendingUp },
    lost: { color: '#ef4444', label: 'Lost', Icon: TrendingDown },
  };
  const c = config[trend] || config.stable;
  const Icon = c.Icon;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ background: `${c.color}15`, color: c.color }}
    >
      <Icon className="h-3 w-3" />
      {c.label}
    </span>
  );
}

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

function CityCard({ city }: { city: SeoCity }) {
  const sortedKeywords = [...(city.targetKeywords || [])].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <article className="hover:border-[var(--pv-primary)]/30 group relative rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-4 transition-all hover:shadow-lg">
      <div className="absolute -left-2.5 -top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--pv-primary)] text-xs font-bold text-white shadow-md">
        {city.rank}
      </div>
      <div className="space-y-3">
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
        {city.whyPriority && (
          <p className="text-xs text-[var(--pv-text-muted)]">{city.whyPriority}</p>
        )}
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
