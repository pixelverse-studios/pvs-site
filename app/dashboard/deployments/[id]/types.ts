/**
 * Type definitions for the deployment detail page
 * Enhanced deployment response includes website and client context
 */

export type IndexingStatus = 'pending' | 'requested' | 'indexed'

export interface ChangedUrl {
  url: string
  indexing_status: IndexingStatus
  indexing_requested_at: string | null
  indexed_at: string | null
}

export interface DeploymentDetail {
  id: string
  website_id: string
  changed_urls: ChangedUrl[]
  deploy_summary: string
  internal_notes: string | null
  created_at: string
  indexing_status: IndexingStatus
  indexing_requested_at: string | null
  indexed_at: string | null
  website: {
    id: string
    title: string
    domain: string
  }
  client: {
    id: string
    firstname: string | null
    lastname: string | null
  }
}
