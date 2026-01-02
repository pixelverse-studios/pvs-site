/**
 * Type definitions for Deployment entities
 *
 * Centralized types for deployment tracking and URL indexing management.
 * These types align with the PVS API schema for deployments.
 *
 * Three-state indexing system: pending -> requested -> indexed
 * - pending: URL has not been submitted for indexing
 * - requested: Indexing has been requested via Google API
 * - indexed: URL has been confirmed as indexed
 */

/**
 * Indexing status for URLs and deployments
 * Represents the Google Search Console indexing state
 */
export type IndexingStatus = 'pending' | 'requested' | 'indexed';

/**
 * Display status for UI components
 * Extends IndexingStatus with 'partial' for mixed-state deployments
 */
export type DeploymentStatus = IndexingStatus | 'partial';

/**
 * A single URL that was changed in a deployment
 * Tracks individual URL indexing state
 */
export interface ChangedUrl {
  /** The full URL that was changed */
  url: string;
  /** Current indexing status for this URL */
  indexing_status: IndexingStatus;
  /** ISO timestamp when indexing was requested, null if not yet requested */
  indexing_requested_at: string | null;
  /** ISO timestamp when URL was confirmed indexed, null if not yet indexed */
  indexed_at: string | null;
}

/**
 * Core deployment entity from the API
 * Represents a single deployment with its changed URLs
 */
export interface Deployment {
  /** Unique deployment identifier */
  id: string;
  /** Reference to the website this deployment belongs to */
  website_id: string;
  /** Array of URLs that were changed in this deployment */
  changed_urls: ChangedUrl[];
  /** Client-facing summary of deployment changes */
  deploy_summary: string;
  /** Internal team notes (not sent to clients) */
  internal_notes?: string | null;
  /** ISO timestamp when deployment was created */
  created_at: string;
  /** Overall indexing status for the deployment */
  indexing_status: IndexingStatus;
  /** ISO timestamp when indexing was requested for all URLs */
  indexing_requested_at: string | null;
  /** ISO timestamp when all URLs were confirmed indexed */
  indexed_at: string | null;
}

/**
 * Nested website info for deployment detail views
 * Minimal website context needed for display
 */
export interface DeploymentWebsite {
  /** Website unique identifier */
  id: string;
  /** Display title of the website */
  title: string;
  /** Website domain (e.g., 'example.com') */
  domain: string;
}

/**
 * Nested client info for deployment detail views
 * Minimal client context needed for display
 */
export interface DeploymentClient {
  /** Client unique identifier */
  id: string;
  /** Client first name, null if not set */
  firstname: string | null;
  /** Client last name, null if not set */
  lastname: string | null;
}

/**
 * Extended deployment with website and client context
 * Used for deployment detail pages that need full context
 */
export interface DeploymentDetail extends Deployment {
  /** Nested website information */
  website: DeploymentWebsite;
  /** Nested client information */
  client: DeploymentClient;
}

/**
 * API response for paginated deployment list
 * Used when fetching deployments for a specific website
 */
export interface DeploymentsResponse {
  /** Website ID these deployments belong to */
  website_id: string;
  /** Website display title */
  website_title: string;
  /** Total number of deployments matching query */
  total: number;
  /** Maximum results per page */
  limit: number;
  /** Number of results skipped */
  offset: number;
  /** Array of deployment objects */
  deployments: Deployment[];
}

/**
 * Query parameters for listing deployments
 */
export interface DeploymentQueryParams {
  /** Maximum number of results to return */
  limit?: number;
  /** Number of results to skip for pagination */
  offset?: number;
  /** Filter by indexing status */
  indexing_status?: IndexingStatus;
}

// ============================================================================
// Status Display Utilities
// ============================================================================

/**
 * Display labels for indexing statuses
 */
export const INDEXING_STATUS_LABELS: Record<DeploymentStatus, string> = {
  pending: 'Pending',
  requested: 'Requested',
  indexed: 'Indexed',
  partial: 'Partial',
};

/**
 * Status colors for UI badges and indicators
 */
export const INDEXING_STATUS_COLORS: Record<DeploymentStatus, string> = {
  pending: '#f59e0b', // Amber - awaiting action
  requested: '#3b82f6', // Blue - in progress
  indexed: '#22c55e', // Green - complete
  partial: '#8b5cf6', // Purple - mixed state
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate aggregate status for a deployment based on its URLs
 * @param urls - Array of changed URLs to analyze
 * @returns Aggregate status: 'indexed' if all indexed, 'pending' if none requested, 'partial' if mixed
 */
export function getDeploymentAggregateStatus(urls: ChangedUrl[]): DeploymentStatus {
  if (urls.length === 0) return 'pending';

  const allIndexed = urls.every((url) => url.indexing_status === 'indexed');
  if (allIndexed) return 'indexed';

  const allPending = urls.every((url) => url.indexing_status === 'pending');
  if (allPending) return 'pending';

  const allRequested = urls.every((url) => url.indexing_status === 'requested');
  if (allRequested) return 'requested';

  return 'partial';
}

/**
 * Get display name for a deployment's client
 * @param client - Client info from deployment detail
 * @returns Formatted display name or 'Unknown Client'
 */
export function getDeploymentClientName(client: DeploymentClient): string {
  if (client.firstname && client.lastname) {
    return `${client.firstname} ${client.lastname}`;
  }

  if (client.firstname) {
    return client.firstname;
  }

  if (client.lastname) {
    return client.lastname;
  }

  return 'Unknown Client';
}

/**
 * Count URLs by indexing status
 * @param urls - Array of changed URLs
 * @returns Object with counts for each status
 */
export function countUrlsByStatus(urls: ChangedUrl[]): Record<IndexingStatus, number> {
  return urls.reduce(
    (acc, url) => {
      acc[url.indexing_status]++;
      return acc;
    },
    { pending: 0, requested: 0, indexed: 0 } as Record<IndexingStatus, number>,
  );
}

/**
 * Format deployment date for display
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Jan 15, 2025")
 */
export function formatDeploymentDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format deployment date with time for detailed views
 * @param dateString - ISO date string
 * @returns Formatted date and time string (e.g., "Jan 15, 2025 at 2:30 PM")
 */
export function formatDeploymentDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
