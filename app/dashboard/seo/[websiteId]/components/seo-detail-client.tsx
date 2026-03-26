'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Target,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { SeoDrawer } from './seo-drawer';
import type {
  WebsiteSeoResponse,
  AuditHistoryResponse,
  ChecklistItem,
  ChangelogEntry,
  KeywordRecord,
  CompetitorRecord,
} from '@/lib/api/seo';

type DrawerView = null | 'keywords' | 'checklist' | 'audits' | 'competitors' | 'changelog';

interface SeoDetailClientProps {
  seoData: WebsiteSeoResponse | null;
  auditHistory: AuditHistoryResponse | null;
}

export function SeoDetailClient({ seoData, auditHistory }: SeoDetailClientProps) {
  const [drawer, setDrawer] = useState<DrawerView>(null);

  const audit = seoData?.latest_audit;
  const hasAuditData = audit !== null && audit !== undefined;

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/dashboard/seo"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to SEO Health
      </Link>

      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pv-text-muted)]">
            SEO Detail
          </div>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl" style={{ color: 'var(--pv-text)' }}>
            {hasAuditData
              ? audit.summary
                ? audit.summary.split('.')[0]
                : 'SEO Health'
              : 'SEO Health'}
          </h1>
        </div>
        {hasAuditData && <ScoreBadgeLarge score={audit.score} grade={audit.grade} />}
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
            onClick={() => setDrawer('checklist')}
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
            onClick={() => setDrawer('keywords')}
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

      {/* Audit Summary */}
      {hasAuditData && audit.summary && (
        <Card>
          <CardContent className="p-5">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
              Audit Summary
            </h2>
            <p className="text-[var(--pv-text)]">{audit.summary}</p>
            <p className="mt-2 text-xs text-[var(--pv-text-muted)]">
              Audited on{' '}
              {new Date(audit.audit_date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}{' '}
              by {audit.auditor} — {audit.findings_count} finding
              {audit.findings_count !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Preview Sections Grid */}
      {hasAuditData && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Keywords Preview */}
          {seoData && seoData.keywords.items.length > 0 && (
            <PreviewSection
              title="Keyword Rankings"
              count={seoData.keywords.items.length}
              onViewAll={() => setDrawer('keywords')}
            >
              <div className="space-y-2">
                {seoData.keywords.items.slice(0, 5).map((kw) => (
                  <div key={kw.keyword} className="flex items-center justify-between text-sm">
                    <span className="truncate text-[var(--pv-text)]">{kw.keyword}</span>
                    <div className="ml-3 flex items-center gap-2">
                      <span className="font-mono text-[var(--pv-text-muted)]">
                        {kw.position !== null ? `#${kw.position}` : '—'}
                      </span>
                      <TrendBadge trend={kw.trend} />
                    </div>
                  </div>
                ))}
              </div>
            </PreviewSection>
          )}

          {/* Checklist Preview */}
          {audit.checklist.length > 0 && (
            <PreviewSection
              title="Checklist Progress"
              count={audit.checklist.reduce((s, c) => s + c.total, 0)}
              onViewAll={() => setDrawer('checklist')}
            >
              <div className="space-y-3">
                {audit.checklist.slice(0, 4).map((item) => {
                  const color =
                    item.pct >= 80 ? '#22c55e' : item.pct >= 50 ? '#f59e0b' : '#ef4444';
                  return (
                    <div key={item.category} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--pv-text)]">{item.category}</span>
                        <span className="text-[var(--pv-text-muted)]">{item.pct}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--pv-border)]">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${item.pct}%`, background: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </PreviewSection>
          )}

          {/* Audit History Preview */}
          {auditHistory && auditHistory.audits.length > 0 && (
            <PreviewSection
              title="Audit History"
              count={auditHistory.audits.length}
              onViewAll={() => setDrawer('audits')}
            >
              <div className="space-y-2">
                {auditHistory.audits.slice(0, 3).map((a) => (
                  <div key={a.id} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--pv-text)]">
                      {new Date(a.audit_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <SmallScoreBadge score={a.score} grade={a.grade} />
                      <span className="text-xs text-[var(--pv-text-muted)]">
                        {a.findings_count} findings
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </PreviewSection>
          )}

          {/* Competitors Preview */}
          {seoData && seoData.competitors.length > 0 && (
            <PreviewSection
              title="Competitors"
              count={seoData.competitors.length}
              onViewAll={() => setDrawer('competitors')}
            >
              <div className="space-y-2">
                {seoData.competitors.slice(0, 3).map((comp) => (
                  <div
                    key={comp.competitor_domain}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-[var(--pv-text)]">{comp.competitor_domain}</span>
                    <span className="text-xs text-[var(--pv-text-muted)]">
                      {comp.da_score !== null ? `DA ${comp.da_score}` : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </PreviewSection>
          )}
        </div>
      )}

      {/* Changelog Preview */}
      {hasAuditData && audit.changelog.length > 0 && (
        <PreviewSection
          title="Recent Changes"
          count={audit.changelog.length}
          onViewAll={() => setDrawer('changelog')}
        >
          <div className="space-y-2">
            {audit.changelog.slice(0, 4).map((entry, i) => {
              const impactColor =
                (entry.impact || '').toLowerCase() === 'positive'
                  ? '#22c55e'
                  : (entry.impact || '').toLowerCase() === 'negative'
                    ? '#ef4444'
                    : '#6b7280';
              return (
                <div key={`${entry.date}-${i}`} className="flex items-start gap-2 text-sm">
                  <div
                    className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ background: impactColor }}
                  />
                  <span className="text-[var(--pv-text)]">{entry.description}</span>
                </div>
              );
            })}
          </div>
        </PreviewSection>
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

      {/* Empty State */}
      {!hasAuditData && (
        <section className="rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-8 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <BarChart3 className="mx-auto h-12 w-12 text-[var(--pv-text-muted)]" />
            <h2 className="text-xl font-semibold text-[var(--pv-text)]">No Audit Data</h2>
            <p className="text-[var(--pv-text-muted)]">
              No SEO audits have been run for this website yet. Run an audit to start tracking
              health metrics.
            </p>
            <Link
              href="/dashboard/seo"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--pv-primary)] transition-colors hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to SEO overview
            </Link>
          </div>
        </section>
      )}

      {/* ============ DRAWERS ============ */}

      {/* Keywords Drawer */}
      <SeoDrawer
        open={drawer === 'keywords'}
        onClose={() => setDrawer(null)}
        title={`All Keywords (${seoData?.keywords.items.length || 0})`}
      >
        {seoData && seoData.keywords.items.length > 0 ? (
          <div className="space-y-0">
            <div className="mb-3 grid grid-cols-[1fr_60px_60px_60px] gap-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
              <span>Keyword</span>
              <span className="text-center">Pos</span>
              <span className="text-center">Prev</span>
              <span className="text-center">Trend</span>
            </div>
            {seoData.keywords.items.map((kw) => (
              <div
                key={kw.keyword}
                className="grid grid-cols-[1fr_60px_60px_60px] items-center gap-2 border-b border-[var(--pv-border)] py-2.5 last:border-0"
              >
                <div>
                  <span className="text-sm text-[var(--pv-text)]">{kw.keyword}</span>
                  {kw.target_city && (
                    <span className="ml-2 text-[10px] text-[var(--pv-text-muted)]">
                      {kw.target_city}
                    </span>
                  )}
                  {kw.target_url && (
                    <p className="font-mono text-[10px] text-[var(--pv-text-muted)]">
                      {kw.target_url}
                    </p>
                  )}
                </div>
                <span className="text-center font-mono text-sm text-[var(--pv-text)]">
                  {kw.position !== null ? `#${kw.position}` : '—'}
                </span>
                <span className="text-center font-mono text-sm text-[var(--pv-text-muted)]">
                  {kw.previous_position !== null ? `#${kw.previous_position}` : '—'}
                </span>
                <div className="text-center">
                  <TrendBadge trend={kw.trend} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--pv-text-muted)]">No keyword data available.</p>
        )}
      </SeoDrawer>

      {/* Checklist Drawer */}
      <SeoDrawer
        open={drawer === 'checklist'}
        onClose={() => setDrawer(null)}
        title="Checklist Breakdown"
      >
        {hasAuditData && audit.checklist.length > 0 ? (
          <div className="space-y-6">
            {audit.checklist.map((cat) => {
              const color =
                cat.pct >= 80 ? '#22c55e' : cat.pct >= 50 ? '#f59e0b' : '#ef4444';
              return (
                <div key={cat.category}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[var(--pv-text)]">
                      {cat.category}
                    </span>
                    <span className="text-sm text-[var(--pv-text-muted)]">
                      {cat.completed}/{cat.total} ({cat.pct}%)
                    </span>
                  </div>
                  <div className="mb-3 h-2 overflow-hidden rounded-full bg-[var(--pv-border)]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${cat.pct}%`, background: color }}
                    />
                  </div>
                  {(cat.items || []).length > 0 && (
                    <div className="space-y-1.5 pl-1">
                      {(cat.items || []).map((item) => (
                        <div key={item.name} className="flex items-center gap-2 text-sm">
                          {item.status === 'complete' ? (
                            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                          ) : item.status === 'partial' ? (
                            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 flex-shrink-0 text-red-400" />
                          )}
                          <span
                            className={
                              item.status === 'complete'
                                ? 'text-[var(--pv-text-muted)]'
                                : 'text-[var(--pv-text)]'
                            }
                          >
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[var(--pv-text-muted)]">No checklist data available.</p>
        )}
      </SeoDrawer>

      {/* Audit History Drawer */}
      <SeoDrawer
        open={drawer === 'audits'}
        onClose={() => setDrawer(null)}
        title={`Audit History (${auditHistory?.audits.length || 0})`}
      >
        {auditHistory && auditHistory.audits.length > 0 ? (
          <div className="space-y-0">
            {auditHistory.audits.map((a) => (
              <div
                key={a.id}
                className="border-b border-[var(--pv-border)] py-4 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--pv-text)]">
                    {new Date(a.audit_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <SmallScoreBadge score={a.score} grade={a.grade} />
                </div>
                <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-[var(--pv-text-muted)]">
                  <span>Checklist: {a.checklist_pct}%</span>
                  <span>{a.keywords_tracked} keywords</span>
                  <span>{a.findings_count} findings</span>
                  <span>by {a.auditor}</span>
                </div>
                {a.summary && (
                  <p className="mt-2 text-sm text-[var(--pv-text-muted)]">{a.summary}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--pv-text-muted)]">No audit history available.</p>
        )}
      </SeoDrawer>

      {/* Competitors Drawer */}
      <SeoDrawer
        open={drawer === 'competitors'}
        onClose={() => setDrawer(null)}
        title={`Competitors (${seoData?.competitors.length || 0})`}
      >
        {seoData && seoData.competitors.length > 0 ? (
          <div className="space-y-0">
            {seoData.competitors.map((comp) => (
              <div
                key={comp.competitor_domain}
                className="border-b border-[var(--pv-border)] py-4 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--pv-text)]">
                    {comp.competitor_domain}
                  </span>
                  <span className="text-xs text-[var(--pv-text-muted)]">
                    {comp.da_score !== null ? `DA ${comp.da_score}` : '—'}
                  </span>
                </div>
                {comp.keyword_overlap !== null && (
                  <p className="mt-1 text-xs text-[var(--pv-text-muted)]">
                    {comp.keyword_overlap} overlapping keywords
                  </p>
                )}
                {comp.overlap_keywords && comp.overlap_keywords.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {comp.overlap_keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full bg-[var(--pv-surface)] px-2 py-0.5 text-[10px] text-[var(--pv-text-muted)]"
                        style={{ border: '1px solid var(--pv-border)' }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
                {comp.notes && (
                  <p className="mt-2 text-xs text-[var(--pv-text-muted)]">{comp.notes}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--pv-text-muted)]">No competitor data available.</p>
        )}
      </SeoDrawer>

      {/* Changelog Drawer */}
      <SeoDrawer
        open={drawer === 'changelog'}
        onClose={() => setDrawer(null)}
        title={`All Changes (${hasAuditData ? audit.changelog.length : 0})`}
      >
        {hasAuditData && audit.changelog.length > 0 ? (
          <div className="space-y-0">
            {audit.changelog
              .slice()
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry, i) => {
                const catColors: Record<string, string> = {
                  technical: '#3b82f6',
                  content: '#8b5cf6',
                  local: '#f59e0b',
                  backlinks: '#10b981',
                };
                const impactColors: Record<string, string> = {
                  positive: '#22c55e',
                  negative: '#ef4444',
                  neutral: '#6b7280',
                };
                const catColor =
                  catColors[(entry.category || '').toLowerCase()] || '#6b7280';
                const impactColor =
                  impactColors[(entry.impact || '').toLowerCase()] || '#6b7280';

                return (
                  <div
                    key={`${entry.date}-${i}`}
                    className="flex gap-3 border-b border-[var(--pv-border)] py-3 last:border-0"
                  >
                    <div
                      className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full"
                      style={{ background: impactColor }}
                    />
                    <div className="flex-1">
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
              })}
          </div>
        ) : (
          <p className="text-sm text-[var(--pv-text-muted)]">No changelog entries.</p>
        )}
      </SeoDrawer>
    </div>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function PreviewSection({
  title,
  count,
  onViewAll,
  children,
}: {
  title: string;
  count: number;
  onViewAll: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
            {title}
          </h2>
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-medium text-[var(--pv-primary)] transition-colors hover:underline"
          >
            View all {count}
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

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
  onClick,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}) {
  return (
    <Card>
      <CardContent
        className={`p-5 ${onClick ? 'cursor-pointer transition-colors hover:bg-[var(--pv-surface)]' : ''}`}
        onClick={onClick}
      >
        <div className="mb-3 flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: `${color}15`, color }}
          >
            {icon}
          </div>
          <span className="text-sm font-medium text-[var(--pv-text-muted)]">{label}</span>
          {onClick && <ChevronRight className="ml-auto h-4 w-4 text-[var(--pv-text-muted)]" />}
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

function TrendBadge({ trend }: { trend: KeywordRecord['trend'] }) {
  const config: Record<
    KeywordRecord['trend'],
    { color: string; label: string; Icon: typeof TrendingUp }
  > = {
    up: { color: '#22c55e', label: 'Up', Icon: TrendingUp },
    down: { color: '#ef4444', label: 'Down', Icon: TrendingDown },
    stable: { color: '#6b7280', label: '—', Icon: Minus },
    new: { color: '#3b82f6', label: 'New', Icon: TrendingUp },
    lost: { color: '#ef4444', label: 'Lost', Icon: TrendingDown },
  };
  const c = config[trend];
  const Icon = c.Icon;
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
      style={{ background: `${c.color}15`, color: c.color }}
    >
      <Icon className="h-2.5 w-2.5" />
      {c.label}
    </span>
  );
}
