/**
 * Type definitions for website deployments
 * Three-state indexing system: pending → requested → indexed
 */

export type IndexingStatus = 'pending' | 'requested' | 'indexed'

export interface ChangedUrl {
  url: string
  indexing_status: IndexingStatus
  indexing_requested_at: string | null
  indexed_at: string | null
}

export interface Deployment {
  id: string
  website_id: string
  changed_urls: ChangedUrl[]
  deploy_summary: string
  internal_notes?: string
  created_at: string
  indexing_status: IndexingStatus
  indexing_requested_at: string | null
  indexed_at: string | null
}

export interface DeploymentsResponse {
  website_id: string
  website_title: string
  total: number
  limit: number
  offset: number
  deployments: Deployment[]
}

export type DeploymentStatus = IndexingStatus | 'partial'
