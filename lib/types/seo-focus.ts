/**
 * SEO Focus Types
 *
 * Types for tracking hyper-local SEO focus per client website.
 * Data is stored as JSONB in the websites.seo_focus column.
 */

export interface SeoKeyword {
  keyword: string;
  currentPosition: number | null;
  targetPosition: number;
  priority: 'high' | 'medium' | 'low';
}

export interface SeoCity {
  rank: number;
  city: string;
  state: string;
  slug: string;
  currentPosition: number | null;
  population?: string;
  whyPriority?: string;
  targetKeywords: SeoKeyword[];
}

export interface SeoFocus {
  /** Overall SEO strategy description */
  strategy?: string;
  /** Main goal for this website's SEO */
  goal?: string;
  /** Primary focus cities (Phase 1 - active) */
  primaryCities: SeoCity[];
  /** Secondary focus cities (Phase 2 - upcoming) */
  secondaryCities: SeoCity[];
  /** Broader regional keywords (optional) */
  countyKeywords?: SeoKeyword[];
  /** Last time the SEO data was updated */
  lastUpdated?: string;
}

// Helper functions for display

export function getPositionDisplay(position: number | null): string {
  if (position === null) return 'Not ranking';
  if (position <= 3) return `#${Math.round(position)} 🏆`;
  if (position <= 10) return `#${Math.round(position)} ✓`;
  if (position <= 20) return `#${Math.round(position)}`;
  return `#${Math.round(position)} ⚠️`;
}

export function getPriorityColor(priority: 'high' | 'medium' | 'low'): string {
  switch (priority) {
    case 'high':
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
    case 'medium':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    case 'low':
      return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
  }
}

// Default empty state
export const emptySeoFocus: SeoFocus = {
  primaryCities: [],
  secondaryCities: [],
};
