'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { DeploymentsResponse } from '../types'
import { DeploymentTimeline } from './deployment-timeline'
import { Rocket, AlertCircle, Loader2, PackageX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getApiBaseUrl } from '@/lib/api-config'

interface DeploymentsSectionProps {
  websiteId: string
  websiteTitle: string
}

type DeploymentFilter = 'all' | 'pending' | 'completed'

export function DeploymentsSection({ websiteId, websiteTitle }: DeploymentsSectionProps) {
  const [data, setData] = useState<DeploymentsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<DeploymentFilter>('all')

  // Filter deployments based on selected filter (MUST be before conditional returns)
  const filteredDeployments = useMemo(() => {
    if (!data) return []

    if (filter === 'all') {
      return data.deployments
    } else if (filter === 'pending') {
      return data.deployments.filter(d => d.indexed_at === null)
    } else {
      // completed
      return data.deployments.filter(d => d.indexed_at !== null)
    }
  }, [data, filter])

  // Count pending vs indexed URLs across filtered deployments
  const totalUrls = filteredDeployments.reduce((sum, d) => sum + d.changed_urls.length, 0)
  const pendingUrls = filteredDeployments.reduce(
    (sum, d) => sum + d.changed_urls.filter(u => !u.indexed_at).length,
    0
  )
  const indexedUrls = totalUrls - pendingUrls

  // Count deployments with pending URLs (from all deployments, not filtered)
  const pendingDeploymentsCount = data?.deployments.filter(d => !d.indexed_at).length || 0
  const completedDeploymentsCount = data?.deployments.filter(d => d.indexed_at !== null).length || 0

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

  // Optimistic update: immediately update UI when a URL or deployment is marked as indexed
  const handleMarkedIndexed = useCallback((deploymentId: string, url?: string) => {
    setData(prev => {
      if (!prev) return prev

      const now = new Date().toISOString()

      return {
        ...prev,
        deployments: prev.deployments.map(deployment => {
          if (deployment.id !== deploymentId) return deployment

          if (url) {
            // Mark a single URL as indexed
            const updatedUrls = deployment.changed_urls.map(u =>
              u.url === url ? { ...u, indexed_at: now } : u
            )
            // Check if all URLs are now indexed
            const allIndexed = updatedUrls.every(u => u.indexed_at !== null)
            return {
              ...deployment,
              changed_urls: updatedUrls,
              indexed_at: allIndexed ? now : deployment.indexed_at,
            }
          } else {
            // Mark entire deployment as indexed (all URLs)
            return {
              ...deployment,
              changed_urls: deployment.changed_urls.map(u => ({
                ...u,
                indexed_at: u.indexed_at || now,
              })),
              indexed_at: now,
            }
          }
        }),
      }
    })
  }, [])

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
            {filter === 'all' && (
              <span className="ml-1.5 font-mono">({data.total})</span>
            )}
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`rounded-pv-sm px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${
              filter === 'pending'
                ? 'bg-amber-500 text-white'
                : 'bg-[var(--pv-surface)] text-[var(--pv-text-muted)] hover:bg-[var(--pv-border)]'
            }`}
          >
            Pending
            {filter === 'pending' && pendingDeploymentsCount > 0 && (
              <span className="ml-1.5 font-mono">({pendingDeploymentsCount})</span>
            )}
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`rounded-pv-sm px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${
              filter === 'completed'
                ? 'bg-emerald-500 text-white'
                : 'bg-[var(--pv-surface)] text-[var(--pv-text-muted)] hover:bg-[var(--pv-border)]'
            }`}
          >
            Completed
            {filter === 'completed' && completedDeploymentsCount > 0 && (
              <span className="ml-1.5 font-mono">({completedDeploymentsCount})</span>
            )}
          </button>
        </div>
      </div>

      {/* Status Summary (only show for 'all' or 'pending' filters) */}
      {pendingUrls > 0 && (filter === 'all' || filter === 'pending') && (
        <div className="mb-6 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-500">
                {pendingUrls} URL{pendingUrls !== 1 ? 's' : ''} pending indexing across {pendingDeploymentsCount} deployment{pendingDeploymentsCount !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-[var(--pv-text-muted)] mt-1">
                {indexedUrls > 0 && `${indexedUrls}/${totalUrls} URLs have been indexed. `}
                Remaining URLs need to be re-indexed in Google Search Console.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Results Info */}
      {filteredDeployments.length > 0 && (
        <div className="mb-4 text-sm text-[var(--pv-text-muted)]">
          Showing {filteredDeployments.length} {filter === 'all' ? '' : filter} deployment{filteredDeployments.length !== 1 ? 's' : ''}
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
              No {filter === 'all' ? '' : filter} deployments
            </p>
            <p className="text-[var(--pv-text-muted)] text-sm max-w-md">
              {filter === 'pending' && 'All deployments have been fully indexed!'}
              {filter === 'completed' && 'No deployments have been completed yet.'}
            </p>
          </div>
        </div>
      )}

      {/* Timeline */}
      {filteredDeployments.length > 0 && (
        <DeploymentTimeline
          deployments={filteredDeployments}
          onMarkedIndexed={handleMarkedIndexed}
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
