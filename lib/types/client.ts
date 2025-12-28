/**
 * Type definitions for Client entities
 *
 * Centralized types for Client management across the dashboard.
 * These types align with the PVS API schema.
 */

import type { SeoFocus } from './seo-focus';

// Website entity (nested within Client)
export interface Website {
  id: string;
  title: string;
  website_slug: string;
  domain: string;
  type: 'Static' | 'CMS' | string;
  seo_focus?: SeoFocus | null;
}

// Core Client entity from API
export interface Client {
  id: string;
  client: string;
  client_slug: string;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  phone: string | null;
  active: boolean;
  cms: boolean | null;
  created_at: string;
  updated_at: string | null;
  websites?: Website[];
}

// Client list item (for table/list views with aggregated data)
export interface ClientListItem {
  client_id: string;
  client: string;
  client_slug: string;
  firstname: string | null;
  lastname: string | null;
  client_email: string | null;
  client_active: boolean | null;
  cms: boolean | null;
  website_count: number;
  deployment_count_30d: number;
}

// Request payload for creating a new client
export interface ClientCreatePayload {
  client: string;
  client_slug: string;
  active: boolean;
  cms?: boolean;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
}

// Request payload for updating a client
export interface ClientUpdatePayload {
  client?: string;
  active?: boolean;
  cms?: boolean;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
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
export function getClientDisplayName(client: Client | ClientListItem): string {
  const firstName = 'firstname' in client ? client.firstname : null;
  const lastName = 'lastname' in client ? client.lastname : null;

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  if (firstName) {
    return firstName;
  }

  if (lastName) {
    return lastName;
  }

  // Fall back to client name
  return client.client;
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
