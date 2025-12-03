'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { DeploymentsResponse, IndexingStatus } from '../types'
import { DeploymentTimeline } from './deployment-timeline'
import { Rocket, AlertCircle, Loader2, PackageX, Clock, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getApiBaseUrl } from '@/lib/api-config'

interface DeploymentsSectionProps {
  websiteId: string
  websiteTitle: string
}

type DeploymentFilter = 'all' | 'pending' | 'requested' | 'indexed'

export function DeploymentsSection({ websiteId, websiteTitle }: DeploymentsSectionProps) {
  const [data, setData] = useState<DeploymentsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<DeploymentFilter>('all')

  // Filter deployments based on selected filter (show deployments that have URLs matching the filter)
  const filteredDeployments = useMemo(() => {
    if (!data) return []

    if (filter === 'all') {
      return data.deployments
    }
    // Show deployments that have at least one URL matching the filter status
    return data.deployments.filter(d =>
      d.changed_urls.some(u => u.indexing_status === filter)
    )
  }, [data, filter])

  // Count deployments that have at least one URL of each status
  const statusCounts = useMemo(() => {
    if (!data) return { pending: 0, requested: 0, indexed: 0 }
    return {
      pending: data.deployments.filter(d => d.changed_urls.some(u => u.indexing_status === 'pending')).length,
      requested: data.deployments.filter(d => d.changed_urls.some(u => u.indexing_status === 'requested')).length,
      indexed: data.deployments.filter(d => d.changed_urls.some(u => u.indexing_status === 'indexed')).length,
    }
  }, [data])

  // Count URLs per status across filtered deployments
  const urlCounts = useMemo(() => {
    const counts = { pending: 0, requested: 0, indexed: 0, total: 0 }
    for (const d of filteredDeployments) {
      for (const u of d.changed_urls) {
        counts[u.indexing_status]++
        counts.total++
      }
    }
    return counts
  }, [filteredDeployments])

  const fetchDeployments = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${getApiBaseUrl()}/api/websites/${websiteId}/deployments`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        }
      )

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Website not found')
        }
        throw new Error(`Failed to fetch deployments: ${response.status}`)
      }

      const result: DeploymentsResponse = await response.json()
      setData(result)
    } catch (err) {
      console.error('Error fetching deployments:', err)
      setError(err instanceof Error ? err.message : 'Failed to load deployments')
    } finally {
      setLoading(false)
    }
  }, [websiteId])

  // Optimistic update when status changes
  const handleStatusUpdated = useCallback(
    (deploymentId: string, newStatus: IndexingStatus, url?: string) => {
      setData(prev => {
        if (!prev) return prev

        const now = new Date().toISOString()

        return {
          ...prev,
          deployments: prev.deployments.map(deployment => {
            if (deployment.id !== deploymentId) return deployment

            if (url) {
              // Update single URL
              const updatedUrls = deployment.changed_urls.map(u => {
                if (u.url !== url) return u
                return {
                  ...u,
                  indexing_status: newStatus,
                  indexing_requested_at:
                    newStatus === 'requested' || newStatus === 'indexed'
                      ? u.indexing_requested_at || now
                      : u.indexing_requested_at,
                  indexed_at: newStatus === 'indexed' ? now : u.indexed_at,
                }
              })

              // Recalculate deployment-level status
              const allIndexed = updatedUrls.every(u => u.indexing_status === 'indexed')
              const anyPending = updatedUrls.some(u => u.indexing_status === 'pending')
              const deploymentStatus: IndexingStatus = allIndexed
                ? 'indexed'
                : anyPending
                  ? 'pending'
                  : 'requested'

              return {
                ...deployment,
                changed_urls: updatedUrls,
                indexing_status: deploymentStatus,
                indexing_requested_at:
                  deploymentStatus !== 'pending'
                    ? deployment.indexing_requested_at || now
                    : deployment.indexing_requested_at,
                indexed_at: deploymentStatus === 'indexed' ? now : deployment.indexed_at,
              }
            } else {
              // Update entire deployment (all URLs)
              return {
                ...deployment,
                changed_urls: deployment.changed_urls.map(u => ({
                  ...u,
                  indexing_status: newStatus,
                  indexing_requested_at:
                    newStatus === 'requested' || newStatus === 'indexed'
                      ? u.indexing_requested_at || now
                      : u.indexing_requested_at,
                  indexed_at: newStatus === 'indexed' ? now : u.indexed_at,
                })),
                indexing_status: newStatus,
                indexing_requested_at:
                  newStatus === 'requested' || newStatus === 'indexed'
                    ? deployment.indexing_requested_at || now
                    : deployment.indexing_requested_at,
                indexed_at: newStatus === 'indexed' ? now : deployment.indexed_at,
              }
            }
          }),
        }
      })
    },
    []
  )

  useEffect(() => {
    fetchDeployments()
  }, [fetchDeployments])

  // Loading state
  if (loading) {
    return (
      <section className="mt-12">
        <div className="flex items-center gap-3 mb-8">
          <Rocket className="h-6 w-6 text-[var(--pv-primary)]" />
          <h2 className="text-2xl font-heading font-semibold">
            Deployment History
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Loader2 className="h-8 w-8 text-[var(--pv-primary)] animate-spin" />
          <p className="text-[var(--pv-text-muted)] text-sm">
            Loading deployment history...
          </p>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="mt-12">
        <div className="flex items-center gap-3 mb-8">
          <Rocket className="h-6 w-6 text-[var(--pv-primary)]" />
          <h2 className="text-2xl font-heading font-semibold">
            Deployment History
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--pv-danger)]/10">
            <AlertCircle className="h-8 w-8 text-[var(--pv-danger)]" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-[var(--pv-text)] font-semibold">
              Failed to load deployments
            </p>
            <p className="text-[var(--pv-text-muted)] text-sm">
              {error}
            </p>
          </div>
          <Button
            onClick={fetchDeployments}
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </section>
    )
  }

  // Empty state
  if (!data || data.deployments.length === 0) {
    return (
      <section className="mt-12">
        <div className="flex items-center gap-3 mb-8">
          <Rocket className="h-6 w-6 text-[var(--pv-primary)]" />
          <h2 className="text-2xl font-heading font-semibold">
            Deployment History
          </h2>
          <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-2 text-xs font-mono font-semibold rounded-full bg-[var(--pv-surface)] text-[var(--pv-text-muted)] border border-[var(--pv-border)]">
            0
          </span>
        </div>

        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--pv-surface)]">
            <PackageX className="h-8 w-8 text-[var(--pv-text-muted)]" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-[var(--pv-text)] font-semibold">
              No deployments yet
            </p>
            <p className="text-[var(--pv-text-muted)] text-sm max-w-md">
              Deployment history will appear here when changes are made to <strong>{websiteTitle}</strong>.
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Success state with data
  return (
    <section className="mt-12">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <Rocket className="h-6 w-6 text-[var(--pv-primary)]" />
          <h2 className="text-2xl font-heading font-semibold">
            Deployment History
          </h2>
          <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-2 text-xs font-mono font-semibold rounded-full bg-[var(--pv-primary)]/10 text-[var(--pv-primary)] border border-[var(--pv-primary)]/20">
            {data.total}
          </span>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-pv-sm px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${
              filter === 'all'
                ? 'bg-[var(--pv-primary)] text-white'
                : 'bg-[var(--pv-surface)] text-[var(--pv-text-muted)] hover:bg-[var(--pv-border)]'
            }`}
          >
            All
            <span className="ml-1.5 font-mono">({data.total})</span>
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`rounded-pv-sm px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              filter === 'pending'
                ? 'bg-amber-500 text-white'
                : 'bg-[var(--pv-surface)] text-[var(--pv-text-muted)] hover:bg-[var(--pv-border)]'
            }`}
          >
            <Clock className="h-3 w-3" />
            Pending
            {statusCounts.pending > 0 && (
              <span className="font-mono">({statusCounts.pending})</span>
            )}
          </button>
          <button
            onClick={() => setFilter('requested')}
            className={`rounded-pv-sm px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              filter === 'requested'
                ? 'bg-blue-500 text-white'
                : 'bg-[var(--pv-surface)] text-[var(--pv-text-muted)] hover:bg-[var(--pv-border)]'
            }`}
          >
            <Send className="h-3 w-3" />
            Submitted
            {statusCounts.requested > 0 && (
              <span className="font-mono">({statusCounts.requested})</span>
            )}
          </button>
          <button
            onClick={() => setFilter('indexed')}
            className={`rounded-pv-sm px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              filter === 'indexed'
                ? 'bg-emerald-500 text-white'
                : 'bg-[var(--pv-surface)] text-[var(--pv-text-muted)] hover:bg-[var(--pv-border)]'
            }`}
          >
            <CheckCircle className="h-3 w-3" />
            Indexed
            {statusCounts.indexed > 0 && (
              <span className="font-mono">({statusCounts.indexed})</span>
            )}
          </button>
        </div>
      </div>

      {/* Status Summary Alert */}
      {(urlCounts.pending > 0 || urlCounts.requested > 0) && (filter === 'all' || filter === 'pending' || filter === 'requested') && (
        <div className="mb-6 p-4 rounded-lg bg-[var(--pv-surface)] border border-[var(--pv-border)]">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-[var(--pv-text-muted)] mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--pv-text)]">
                URL Indexing Status
              </p>
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-[var(--pv-text-muted)]">
                {urlCounts.pending > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {urlCounts.pending} pending GSC submission
                  </span>
                )}
                {urlCounts.requested > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    {urlCounts.requested} awaiting Google indexing
                  </span>
                )}
                {urlCounts.indexed > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {urlCounts.indexed} indexed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Results Info */}
      {filteredDeployments.length > 0 && filter !== 'all' && (
        <div className="mb-4 text-sm text-[var(--pv-text-muted)]">
          Showing {filteredDeployments.length} deployment{filteredDeployments.length !== 1 ? 's' : ''} with {filter === 'requested' ? 'submitted' : filter} URLs
        </div>
      )}

      {/* Empty state for filtered results */}
      {filteredDeployments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--pv-surface)]">
            <PackageX className="h-8 w-8 text-[var(--pv-text-muted)]" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-[var(--pv-text)] font-semibold">
              No {filter === 'requested' ? 'submitted' : filter} URLs
            </p>
            <p className="text-[var(--pv-text-muted)] text-sm max-w-md">
              {filter === 'pending' && 'All URLs have been submitted to GSC!'}
              {filter === 'requested' && 'No URLs are currently awaiting Google indexing.'}
              {filter === 'indexed' && 'No URLs have been indexed yet.'}
            </p>
          </div>
        </div>
      )}

      {/* Timeline */}
      {filteredDeployments.length > 0 && (
        <DeploymentTimeline
          deployments={filteredDeployments}
          onStatusUpdated={handleStatusUpdated}
          urlFilter={filter}
        />
      )}

      {/* Pagination info (if needed in future) */}
      {data.total > data.deployments.length && (
        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--pv-text-muted)]">
            Showing {data.deployments.length} of {data.total} deployments
          </p>
        </div>
      )}
    </section>
  )
}
