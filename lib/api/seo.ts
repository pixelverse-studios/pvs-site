import { getApiBaseUrl } from '@/lib/api-config';

export interface SeoOverviewWebsite {
  website_id: string;
  website_title: string;
  domain: string;
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
