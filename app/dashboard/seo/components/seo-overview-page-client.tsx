'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  BarChart3,
  AlertTriangle,
  Target,
  Globe,
  Check,
  X,
} from 'lucide-react';
import type { SeoOverviewResponse, SeoOverviewWebsite } from '@/lib/api/seo';

type SortField = 'website_title' | 'seo_score' | 'checklist_pct' | 'keywords_tracked' | 'last_audit_date';
type SortDirection = 'asc' | 'desc';
type AuditTag = 'audited' | 'overdue' | 'unaudited';
type ProjectTag = 'active' | 'in-progress' | 'inactive';

const PROJECT_OPTIONS: { value: ProjectTag; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'inactive', label: 'Inactive' },
];

const AUDIT_OPTIONS: { value: AuditTag; label: string }[] = [
  { value: 'audited', label: 'Audited' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'unaudited', label: 'Unaudited' },
];

function SortIcon({
  field,
  sortField,
  sortDirection,
}: {
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
}) {
  if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
  return sortDirection === 'asc' ? (
    <ArrowUp className="h-3.5 w-3.5" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5" />
  );
}

function ScoreBadge({ score, grade }: { score: number; grade: string | null }) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
    >
      {score}
      {grade && <span className="opacity-60">{grade}</span>}
    </span>
  );
}

function TrendIndicator({ trend, delta }: { trend: 'up' | 'down' | 'stable' | null; delta: number | null }) {
  if (!trend || delta === null) return null;
  if (trend === 'up') {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-emerald-500">
        <TrendingUp className="h-3 w-3" />+{delta}
      </span>
    );
  }
  if (trend === 'down') {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-red-500">
        <TrendingDown className="h-3 w-3" />{delta}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-xs text-[var(--pv-text-muted)]">
      <Minus className="h-3 w-3" />
    </span>
  );
}

function isOverdue(nextAuditDue: string | null): boolean {
  if (!nextAuditDue) return false;
  return new Date(nextAuditDue) < new Date();
}

interface SeoOverviewPageClientProps {
  data: SeoOverviewResponse;
}

const STORAGE_KEY = 'pvs-seo-overview-filters';

const VALID_PROJECT_TAGS = new Set<string>(['active', 'in-progress', 'inactive']);
const VALID_AUDIT_TAGS = new Set<string>(['audited', 'overdue', 'unaudited']);

function loadFilters(): { project: ProjectTag[]; audit: AuditTag[] } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.project) || !Array.isArray(parsed.audit)) return null;
    return {
      project: parsed.project.filter((v: string) => VALID_PROJECT_TAGS.has(v)),
      audit: parsed.audit.filter((v: string) => VALID_AUDIT_TAGS.has(v)),
    };
  } catch {
    return null;
  }
}

function saveFilters(project: Set<ProjectTag>, audit: Set<AuditTag>) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ project: Array.from(project), audit: Array.from(audit) }),
    );
  } catch {
    // localStorage unavailable
  }
}

export function SeoOverviewPageClient({ data }: SeoOverviewPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [auditTags, setAuditTags] = useState<Set<AuditTag>>(new Set());
  const [projectTags, setProjectTags] = useState<Set<ProjectTag>>(() => new Set<ProjectTag>(['active']));
  const [sortField, setSortField] = useState<SortField>('seo_score');
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadFilters();
    if (saved) {
      setProjectTags(new Set<ProjectTag>(saved.project));
      setAuditTags(new Set<AuditTag>(saved.audit));
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage on change (after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveFilters(projectTags, auditTags);
    }
  }, [projectTags, auditTags, isHydrated]);

  const toggleTag = useCallback(<T extends string>(set: Set<T>, setFn: (s: Set<T>) => void, tag: T) => {
    const next = new Set(set);
    if (next.has(tag)) {
      next.delete(tag);
    } else {
      next.add(tag);
    }
    setFn(next);
  }, []);

  const activeFilterCount = auditTags.size + projectTags.size;

  const clearAllFilters = useCallback(() => {
    setAuditTags(new Set());
    setProjectTags(new Set());
  }, []);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'website_title' ? 'asc' : 'desc');
    }
  };

  // Compute aggregate stats
  const stats = useMemo(() => {
    const audited = data.websites.filter((w) => w.seo_score !== null);
    const avgScore = audited.length > 0
      ? Math.round(audited.reduce((sum, w) => sum + (w.seo_score || 0), 0) / audited.length)
      : null;
    const overdueCount = data.websites.filter((w) => isOverdue(w.next_audit_due)).length;
    const totalKeywords = data.websites.reduce((sum, w) => sum + w.keywords_tracked, 0);
    return { auditedCount: audited.length, avgScore, overdueCount, totalKeywords };
  }, [data.websites]);

  const filteredAndSorted = useMemo(() => {
    let result = data.websites;

    if (searchQuery) {
      const query = (searchQuery || '').toLowerCase();
      result = result.filter(
        (w) =>
          (w.website_title || '').toLowerCase().includes(query) ||
          (w.client_name || '').toLowerCase().includes(query) ||
          (w.domain || '').toLowerCase().includes(query),
      );
    }

    if (projectTags.size > 0) {
      result = result.filter((w) => {
        const status = (w.project_status || '').toLowerCase();
        if (projectTags.has('active') && ['deployed', 'maintenance'].includes(status)) return true;
        if (projectTags.has('in-progress') && ['planning', 'development', 'review', 'qa', 'staging'].includes(status)) return true;
        if (projectTags.has('inactive') && ['archived', 'lost', 'on_hold'].includes(status)) return true;
        return false;
      });
    }

    if (auditTags.size > 0) {
      result = result.filter((w) => {
        if (auditTags.has('audited') && w.seo_score !== null) return true;
        if (auditTags.has('overdue') && isOverdue(w.next_audit_due)) return true;
        if (auditTags.has('unaudited') && w.seo_score === null) return true;
        return false;
      });
    }

    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'website_title':
          comparison = (a.website_title || '').localeCompare(b.website_title || '');
          break;
        case 'seo_score':
          comparison = (a.seo_score ?? -1) - (b.seo_score ?? -1);
          break;
        case 'checklist_pct':
          comparison = (a.checklist_pct ?? -1) - (b.checklist_pct ?? -1);
          break;
        case 'keywords_tracked':
          comparison = a.keywords_tracked - b.keywords_tracked;
          break;
        case 'last_audit_date':
          comparison =
            new Date(a.last_audit_date || '1970-01-01').getTime() -
            new Date(b.last_audit_date || '1970-01-01').getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [data.websites, searchQuery, auditTags, projectTags, sortField, sortDirection]);

  if (data.websites.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-bold md:text-3xl" style={{ color: 'var(--pv-text)' }}>
            SEO Health
          </h1>
          <p className="text-sm" style={{ color: 'var(--pv-text-muted)' }}>
            SEO health overview across all websites
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BarChart3 className="mb-4 h-12 w-12 text-[var(--pv-text-muted)]" />
            <p className="text-lg font-medium text-[var(--pv-text)]">No SEO data yet</p>
            <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
              Run an SEO audit to start tracking health metrics.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold md:text-3xl" style={{ color: 'var(--pv-text)' }}>
          SEO Health
        </h1>
        <p className="text-sm" style={{ color: 'var(--pv-text-muted)' }}>
          {data.total} website{data.total !== 1 ? 's' : ''} tracked
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat
          label="Websites"
          value={data.total}
          sub={`${stats.auditedCount} audited`}
          icon={<Globe className="h-4 w-4" />}
          color="#3b82f6"
        />
        <MiniStat
          label="Avg Score"
          value={stats.avgScore !== null ? stats.avgScore : '—'}
          sub={stats.avgScore !== null ? (stats.avgScore >= 80 ? 'Healthy' : stats.avgScore >= 60 ? 'Needs work' : 'Critical') : 'No audits'}
          icon={<BarChart3 className="h-4 w-4" />}
          color={stats.avgScore !== null ? (stats.avgScore >= 80 ? '#22c55e' : stats.avgScore >= 60 ? '#f59e0b' : '#ef4444') : '#6b7280'}
        />
        <MiniStat
          label="Overdue"
          value={stats.overdueCount}
          sub={stats.overdueCount === 0 ? 'All on schedule' : `${stats.overdueCount} need attention`}
          icon={<AlertTriangle className="h-4 w-4" />}
          color={stats.overdueCount > 0 ? '#ef4444' : '#22c55e'}
        />
        <MiniStat
          label="Keywords"
          value={stats.totalKeywords}
          sub="Tracked across all sites"
          icon={<Target className="h-4 w-4" />}
          color="#8b5cf6"
        />
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        {/* Search row */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--pv-text-muted)]" />
            <Input
              type="text"
              placeholder="Search by website, client, or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-[var(--pv-text-muted)] transition-colors hover:bg-[var(--pv-surface)] hover:text-[var(--pv-text)]"
            >
              <X className="h-3 w-3" />
              Clear filters
            </button>
          )}
        </div>

        {/* Filter chips — single compact row */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--pv-text-muted)]">
            Status
          </span>
          {PROJECT_OPTIONS.map(({ value, label }) => {
            const selected = projectTags.has(value);
            return (
              <button
                key={value}
                onClick={() => toggleTag(projectTags, setProjectTags, value)}
                className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all"
                style={{
                  background: selected ? 'var(--pv-primary)' : 'transparent',
                  borderColor: selected ? 'var(--pv-primary)' : 'var(--pv-border)',
                  color: selected ? 'white' : 'var(--pv-text-muted)',
                }}
              >
                {selected && <Check className="h-2.5 w-2.5" />}
                {label}
              </button>
            );
          })}

          <span className="ml-2 mr-1 h-4 w-px bg-[var(--pv-border)]" />

          <span className="mr-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--pv-text-muted)]">
            Audit
          </span>
          {AUDIT_OPTIONS.map(({ value, label }) => {
            const selected = auditTags.has(value);
            return (
              <button
                key={value}
                onClick={() => toggleTag(auditTags, setAuditTags, value)}
                className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all"
                style={{
                  background: selected ? 'var(--pv-primary)' : 'transparent',
                  borderColor: selected ? 'var(--pv-primary)' : 'var(--pv-border)',
                  color: selected ? 'white' : 'var(--pv-text-muted)',
                }}
              >
                {selected && <Check className="h-2.5 w-2.5" />}
                {label}
              </button>
            );
          })}

          <span className="ml-auto text-xs text-[var(--pv-text-muted)]">
            {filteredAndSorted.length} of {data.websites.length}
          </span>
        </div>
      </div>

      {/* Results */}
      {filteredAndSorted.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-[var(--pv-text-muted)]">No websites match your criteria</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)]">
                      <th className="px-5 py-4 text-left">
                        <button onClick={() => handleSort('website_title')} className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]">
                          Website <SortIcon field="website_title" sortField={sortField} sortDirection={sortDirection} />
                        </button>
                      </th>
                      <th className="px-5 py-4 text-center">
                        <button onClick={() => handleSort('seo_score')} className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]">
                          Score <SortIcon field="seo_score" sortField={sortField} sortDirection={sortDirection} />
                        </button>
                      </th>
                      <th className="px-5 py-4 text-center">
                        <button onClick={() => handleSort('checklist_pct')} className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]">
                          Checklist <SortIcon field="checklist_pct" sortField={sortField} sortDirection={sortDirection} />
                        </button>
                      </th>
                      <th className="px-5 py-4 text-center">
                        <button onClick={() => handleSort('keywords_tracked')} className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]">
                          Keywords <SortIcon field="keywords_tracked" sortField={sortField} sortDirection={sortDirection} />
                        </button>
                      </th>
                      <th className="px-5 py-4 text-center">
                        <span className="text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                          Trend
                        </span>
                      </th>
                      <th className="px-5 py-4 text-right">
                        <button onClick={() => handleSort('last_audit_date')} className="ml-auto flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]">
                          Last Audit <SortIcon field="last_audit_date" sortField={sortField} sortDirection={sortDirection} />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--pv-border)]">
                    {filteredAndSorted.map((website) => (
                      <WebsiteRow key={website.website_id} website={website} />
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="grid gap-4 md:hidden">
            {filteredAndSorted.map((website) => (
              <WebsiteCard key={website.website_id} website={website} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function WebsiteRow({ website }: { website: SeoOverviewWebsite }) {
  const overdue = isOverdue(website.next_audit_due);
  const detailHref = `/dashboard/seo/${website.website_id}`;

  return (
    <tr className="group transition-colors hover:bg-[var(--pv-surface)]">
      <td className="px-5 py-4">
        <Link href={detailHref} className="block">
          <p className="font-medium text-[var(--pv-text)] transition-colors group-hover:text-[var(--pv-primary)]">
            {website.website_title}
          </p>
          <p className="text-xs text-[var(--pv-text-muted)]">{website.client_name}</p>
        </Link>
      </td>
      <td className="px-5 py-4 text-center">
        {website.seo_score !== null ? (
          <ScoreBadge score={website.seo_score} grade={website.seo_grade} />
        ) : (
          <span className="text-xs text-[var(--pv-text-muted)]">—</span>
        )}
      </td>
      <td className="px-5 py-4 text-center">
        {website.checklist_pct !== null ? (
          <div className="inline-flex items-center gap-2">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--pv-border)]">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${website.checklist_pct}%`,
                  background: website.checklist_pct >= 80 ? '#22c55e' : website.checklist_pct >= 50 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>
            <span className="text-sm text-[var(--pv-text)]">{website.checklist_pct}%</span>
          </div>
        ) : (
          <span className="text-xs text-[var(--pv-text-muted)]">—</span>
        )}
      </td>
      <td className="px-5 py-4 text-center">
        {website.keywords_tracked > 0 ? (
          <span className="text-sm text-[var(--pv-text)]">
            <span className="font-medium">{website.keywords_ranking}</span>
            <span className="text-[var(--pv-text-muted)]">/{website.keywords_tracked}</span>
          </span>
        ) : (
          <span className="text-xs text-[var(--pv-text-muted)]">—</span>
        )}
      </td>
      <td className="px-5 py-4 text-center">
        <TrendIndicator trend={website.score_trend} delta={website.score_delta} />
      </td>
      <td className="px-5 py-4 text-right">
        {website.last_audit_date ? (
          <div>
            <span className="text-sm text-[var(--pv-text)]">
              {new Date(website.last_audit_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            {overdue && (
              <p className="text-xs text-red-500">Overdue</p>
            )}
          </div>
        ) : (
          <span className="text-xs text-[var(--pv-text-muted)]">Never</span>
        )}
      </td>
    </tr>
  );
}

function WebsiteCard({ website }: { website: SeoOverviewWebsite }) {
  const detailHref = `/dashboard/seo/${website.website_id}`;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <Link href={detailHref}>
            <p className="font-semibold text-[var(--pv-text)] transition-colors hover:text-[var(--pv-primary)]">
              {website.website_title}
            </p>
            <p className="text-xs text-[var(--pv-text-muted)]">{website.client_name}</p>
          </Link>
          {website.seo_score !== null ? (
            <ScoreBadge score={website.seo_score} grade={website.seo_grade} />
          ) : (
            <span className="text-xs text-[var(--pv-text-muted)]">Not audited</span>
          )}
        </div>

        <div className="space-y-2 border-t border-[var(--pv-border)] pt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--pv-text-muted)]">Checklist</span>
            <span className="text-[var(--pv-text)]">
              {website.checklist_pct !== null ? `${website.checklist_pct}%` : '—'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--pv-text-muted)]">Keywords</span>
            <span className="text-[var(--pv-text)]">
              {website.keywords_tracked > 0
                ? `${website.keywords_ranking}/${website.keywords_tracked} ranking`
                : '—'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--pv-text-muted)]">Last Audit</span>
            <span className="text-[var(--pv-text)]">
              {website.last_audit_date
                ? new Date(website.last_audit_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : 'Never'}
            </span>
          </div>
          {website.score_trend && website.score_delta !== null && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--pv-text-muted)]">Trend</span>
              <TrendIndicator trend={website.score_trend} delta={website.score_delta} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStat({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: string | number;
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
