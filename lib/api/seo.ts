import { getApiBaseUrl } from '@/lib/api-config';

export interface SeoOverviewWebsite {
  website_id: string;
  website_title: string;
  domain: string;
  client_id: string | null;
  client_name: string;
  project_status: string;
  seo_score: number | null;
  seo_grade: string | null;
  last_audit_date: string | null;
  auditor: string | null;
  findings_count: number | null;
  keywords_tracked: number;
  keywords_ranking: number;
  checklist_pct: number | null;
  next_audit_due: string | null;
  score_trend: 'up' | 'down' | 'stable' | null;
  score_delta: number | null;
}

export interface SeoOverviewResponse {
  total: number;
  websites: SeoOverviewWebsite[];
}

// Get SEO health overview for all websites (dashboard table)
export async function getSeoOverview(): Promise<SeoOverviewResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/seo/overview`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch SEO overview: ${res.status}`);
  }

  return res.json();
}

// ============================================================================
// Single Website SEO Data
// ============================================================================

export interface ChecklistItemDetail {
  name: string;
  status: 'complete' | 'incomplete' | 'partial';
}

export interface ChecklistItem {
  category: string;
  total: number;
  completed: number;
  pct: number;
  items?: ChecklistItemDetail[];
}

export interface ChangelogEntry {
  date: string;
  description: string;
  category: string;
  impact: string;
}

export interface KeywordRecord {
  keyword: string;
  position: number | null;
  previous_position: number | null;
  search_volume: number | null;
  trend: 'up' | 'down' | 'stable' | 'new' | 'lost';
  target_city: string | null;
  target_url: string | null;
}

export interface CompetitorRecord {
  competitor_domain: string;
  da_score: number | null;
  keyword_overlap: number | null;
  overlap_keywords: string[];
  notes: string | null;
}

export interface WebsiteSeoResponse {
  website_id: string;
  latest_audit: {
    id: string;
    audit_date: string;
    score: number;
    grade: string;
    auditor: string;
    findings_count: number;
    summary: string | null;
    next_audit_due: string | null;
    checklist: ChecklistItem[];
    changelog: ChangelogEntry[];
  } | null;
  keywords: {
    total: number;
    ranking: number;
    avg_position: number | null;
    items: KeywordRecord[];
  };
  competitors: CompetitorRecord[];
  trend: {
    dates: string[];
    scores: number[];
  };
}

export interface AuditHistoryItem {
  id: string;
  audit_date: string;
  score: number;
  grade: string;
  auditor: string;
  findings_count: number;
  summary: string | null;
  checklist_pct: number;
  keywords_tracked: number;
  next_audit_due: string | null;
  created_at: string;
}

export interface AuditHistoryResponse {
  website_id: string;
  total: number;
  limit: number;
  offset: number;
  audits: AuditHistoryItem[];
}

// Get full SEO data for a single website (latest audit + keywords + competitors + trend)
export async function getWebsiteSeo(websiteId: string): Promise<WebsiteSeoResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/websites/${websiteId}/seo`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch website SEO data: ${res.status}`);
  }

  return res.json();
}

// Get audit history for a website
export async function getWebsiteSeoAudits(
  websiteId: string,
  params?: { limit?: number; offset?: number },
): Promise<AuditHistoryResponse> {
  const searchParams = new URLSearchParams();
  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit));
  if (params?.offset !== undefined) searchParams.set('offset', String(params.offset));

  const queryString = searchParams.toString();
  const url = `${getApiBaseUrl()}/api/websites/${websiteId}/seo/audits${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Failed to fetch audit history: ${res.status}`);
  }

  return res.json();
}
