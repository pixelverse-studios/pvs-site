/**
 * Type definitions for Client entities
 *
 * Centralized types for Client management across the dashboard.
 * These types align with the PVS API schema.
 */

import type { SeoFocus } from './seo-focus';
import type { ProjectStatus } from './project';

// Website entity (nested within Client)
export interface Website {
  id: string;
  title: string;
  website_slug: string;
  domain: string;
  type: 'Static' | 'CMS' | string;
  status: ProjectStatus;
  priority: number;
  seo_focus?: SeoFocus | null;
}

// Core Client entity from API
export interface Client {
  id: string;
  client?: string; // @deprecated - use company_name
  client_slug: string;
  company_name?: string | null; // Business/company name (optional)
  firstname: string; // Contact person's first name (required)
  lastname: string; // Contact person's last name (required)
  email: string | null;
  phone: string | null;
  active: boolean;
  cms: boolean | null;
  created_at: string;
  updated_at: string | null;
  websites?: Website[];
}

// Nested website in client list response
export interface ClientWebsite {
  website_id: string;
  website_title: string;
  domain: string;
  status: ProjectStatus;
  priority: number;
}

// Nested deployment in client list response
export interface ClientDeployment {
  deployment_id: string;
  website_id: string;
  website_title: string;
  deploy_summary: string;
  indexing_status: 'pending' | 'requested' | 'indexed';
  created_at: string;
}

// Client list item (for table/list views with aggregated data)
export interface ClientListItem {
  client_id: string;
  company_name?: string | null; // Business/company name (optional)
  firstname: string;
  lastname: string;
  client_email: string | null;
  client_active: boolean | null;
  website_count: number;
  websites: ClientWebsite[];
  recent_deployments: ClientDeployment[];
  deployment_count_30d: number;
}

// Request payload for creating a new client
export interface ClientCreatePayload {
  firstname: string; // required
  lastname: string; // required
  company_name?: string; // optional
  email?: string;
  phone?: string;
  active?: boolean; // defaults to true
}

// Request payload for updating a client
export interface ClientUpdatePayload {
  company_name?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  active?: boolean;
}

// API response for paginated client list
export interface ClientListResponse {
  total: number;
  limit: number;
  offset: number;
  clients: ClientListItem[];
}

// Query parameters for listing clients
export interface ClientQueryParams {
  limit?: number;
  offset?: number;
  active?: boolean;
  search?: string;
}

// Helper: Get display name for a client
// Prefers company_name if set, otherwise falls back to "firstname lastname"
export function getClientDisplayName(client: Client | ClientListItem): string {
  // Prefer company name if available
  if ('company_name' in client && client.company_name) {
    return client.company_name;
  }

  // Fall back to firstname + lastname
  const firstName = client.firstname;
  const lastName = client.lastname;

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  if (firstName) {
    return firstName;
  }

  if (lastName) {
    return lastName;
  }

  return 'Unknown';
}

// Helper: Get initials for avatar
export function getClientInitials(client: Client | ClientListItem): string {
  const displayName = getClientDisplayName(client);
  const parts = displayName.split(' ').filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return displayName.slice(0, 2).toUpperCase();
}
