/**
 * Type definitions for website deployments
 */

export interface ChangedUrl {
  url: string
  indexed_at: string | null
}

export interface Deployment {
  id: string
  website_id: string
  changed_urls: ChangedUrl[]
  summary: string
  created_at: string
  indexed_at: string | null // null if ANY url is pending, timestamp if ALL indexed
}

export interface DeploymentsResponse {
  website_id: string
  website_title: string
  total: number
  limit: number
  offset: number
  deployments: Deployment[]
}

export type DeploymentStatus = 'indexed' | 'pending' | 'partial'
