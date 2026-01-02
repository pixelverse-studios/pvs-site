/**
 * Type definitions for Project entities (websites and apps)
 *
 * Centralized types for CRM-style kanban board management.
 * These types align with the PVS API schema after PVS-171.
 */

import type { SeoFocus } from './seo-focus';

// Project status values - 15 total across 3 phases
export type ProjectStatus =
  // Phase 1: Sales/Pre-Project
  | 'lead'
  | 'discovery'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost'
  // Phase 2: Project Lifecycle
  | 'planning'
  | 'development'
  | 'review'
  | 'qa'
  | 'staging'
  | 'deployed'
  // Phase 3: Post-Launch
  | 'maintenance'
  | 'on_hold'
  | 'archived';

// Project type discriminator
export type ProjectType = 'website' | 'app';

// Website type values
export type WebsiteType = 'Static' | 'CMS' | 'Custom' | string;

// App platform values
export type AppPlatform = 'iOS' | 'Android' | 'Web' | string;

// Base project interface
interface BaseProject {
  id: string;
  title: string;
  status: ProjectStatus;
  priority: number;
  created_at: string;
  updated_at: string | null;
}

// Website project
export interface WebsiteProject extends BaseProject {
  type: 'website';
  domain: string;
  website_slug: string;
  websiteType: WebsiteType;
  seo_focus?: SeoFocus | null;
  client_id: string;
}

// App project
export interface AppProject extends BaseProject {
  type: 'app';
  platform: AppPlatform;
  app_slug: string;
  appStoreUrl?: string | null;
  playStoreUrl?: string | null;
  client_id: string;
}

// Union type for any project
export type Project = WebsiteProject | AppProject;

// Status phase groupings
export const STATUS_PHASES = {
  sales: ['lead', 'discovery', 'proposal', 'negotiation', 'won', 'lost'] as ProjectStatus[],
  project: ['planning', 'development', 'review', 'qa', 'staging', 'deployed'] as ProjectStatus[],
  postLaunch: ['maintenance', 'on_hold', 'archived'] as ProjectStatus[],
} as const;

// Status display labels
export const STATUS_LABELS: Record<ProjectStatus, string> = {
  lead: 'Lead',
  discovery: 'Discovery',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
  planning: 'Planning',
  development: 'Development',
  review: 'Review',
  qa: 'QA',
  staging: 'Staging',
  deployed: 'Deployed',
  maintenance: 'Maintenance',
  on_hold: 'On Hold',
  archived: 'Archived',
};

// Status colors for left border
export const STATUS_COLORS: Record<ProjectStatus, string> = {
  // Sales phase - Amber tones
  lead: '#f59e0b',
  discovery: '#f97316',
  proposal: '#eab308',
  negotiation: '#d97706',
  won: '#22c55e',
  lost: '#6b7280',
  // Project phase - Blue tones
  planning: '#3b82f6',
  development: '#6366f1',
  review: '#8b5cf6',
  qa: '#a855f7',
  staging: '#0ea5e9',
  deployed: '#10b981',
  // Post-launch - Green/Gray tones
  maintenance: '#14b8a6',
  on_hold: '#9ca3af',
  archived: '#6b7280',
};

// Helper: Get phase for a status
export function getStatusPhase(status: ProjectStatus): 'sales' | 'project' | 'postLaunch' {
  if (STATUS_PHASES.sales.includes(status)) return 'sales';
  if (STATUS_PHASES.project.includes(status)) return 'project';
  return 'postLaunch';
}

// Helper: Check if project is in a completed/archived state
export function isProjectInactive(status: ProjectStatus): boolean {
  return status === 'archived' || status === 'lost';
}

// Helper: Format relative time (simple implementation)
export function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return 'Never';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;

  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
