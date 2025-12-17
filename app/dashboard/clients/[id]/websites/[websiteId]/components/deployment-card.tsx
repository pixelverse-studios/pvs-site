'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Deployment, IndexingStatus } from '../types'
import { DeploymentStatusBadge, UrlStatusIndicator } from './deployment-status-badge'
import { CopyButton } from '../../../components/copy-button'
import {
  ExternalLink,
  FileText,
  Loader2,
  Send,
  CheckCircle,
  Clock,
  Copy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getApiBaseUrl } from '@/lib/api-config'

type UrlFilter = 'all' | 'pending' | 'requested' | 'indexed'

interface DeploymentCardProps {
  deployment: Deployment
  index: number
  onStatusUpdated?: (
    deploymentId: string,
    newStatus: IndexingStatus,
    url?: string
  ) => void
  urlFilter?: UrlFilter
}

export function DeploymentCard({
  deployment,
  index,
  onStatusUpdated,
  urlFilter = 'all',
}: DeploymentCardProps) {
  const [updatingUrl, setUpdatingUrl] = useState<string | null>(null)
  const [updatingAll, setUpdatingAll] = useState<IndexingStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  // Filter URLs based on urlFilter
  const filteredUrls = urlFilter === 'all'
    ? deployment.changed_urls
    : deployment.changed_urls.filter(u => u.indexing_status === urlFilter)

  // Calculate counts per status (from all URLs, not filtered)
  const pendingCount = deployment.changed_urls.filter(
    (u) => u.indexing_status === 'pending'
  ).length
  const requestedCount = deployment.changed_urls.filter(
    (u) => u.indexing_status === 'requested'
  ).length
  const indexedCount = deployment.changed_urls.filter(
    (u) => u.indexing_status === 'indexed'
  ).length
  const totalCount = deployment.changed_urls.length

  // Determine overall status for badge
  const getOverallStatus = () => {
    if (deployment.indexing_status === 'indexed') return 'indexed'
    if (deployment.indexing_status === 'requested') return 'requested'
    if (deployment.indexing_status === 'pending') return 'pending'
    // Fallback logic for partial states
    if (indexedCount === totalCount) return 'indexed'
    if (pendingCount === 0 && requestedCount > 0) return 'requested'
    if (indexedCount > 0 || requestedCount > 0) return 'partial'
    return 'pending'
  }

  const status = getOverallStatus()
  const hasPendingUrls = pendingCount > 0
  const hasRequestedUrls = requestedCount > 0
  const hasNonIndexedUrls = hasPendingUrls || hasRequestedUrls

  // Update single URL status
  const handleUpdateUrlStatus = async (url: string, newStatus: IndexingStatus) => {
    setUpdatingUrl(url)
    setError(null)

    // Optimistic update
    if (onStatusUpdated) {
      onStatusUpdated(deployment.id, newStatus, url)
    }

    try {
      const response = await fetch(
        `${getApiBaseUrl()}/api/deployments/${deployment.id}/urls/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, status: newStatus }),
        }
      )

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Deployment not found')
        }
        throw new Error(`Failed to update URL status: ${response.status}`)
      }
    } catch (err) {
      console.error('Error updating URL status:', err)
      setError(err instanceof Error ? err.message : 'Failed to update URL status')
    } finally {
      setUpdatingUrl(null)
    }
  }

  // Update all URLs to a specific status
  const handleUpdateAllStatus = async (newStatus: IndexingStatus) => {
    setUpdatingAll(newStatus)
    setError(null)

    // Optimistic update
    if (onStatusUpdated) {
      onStatusUpdated(deployment.id, newStatus)
    }

    try {
      const response = await fetch(
        `${getApiBaseUrl()}/api/deployments/${deployment.id}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }
      )

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Deployment not found')
        }
        throw new Error(`Failed to update deployment status: ${response.status}`)
      }
    } catch (err) {
      console.error('Error updating deployment status:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to update deployment status'
      )
    } finally {
      setUpdatingAll(null)
    }
  }

  // Copy all pending/requested URLs to clipboard
  const handleCopyAllUrls = async () => {
    const urlsToCopy = deployment.changed_urls
      .filter((u) => u.indexing_status !== 'indexed')
      .map((u) => u.url)
      .join('\n')

    await navigator.clipboard.writeText(urlsToCopy)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  // Format timestamp in local time: YYYY-MM-DD HH:MM:SS
  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  // Format relative time (e.g., "2 hours ago")
  const formatRelativeTime = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    if (diffMins > 0) return `${diffMins}m ago`
    return 'just now'
  }

  // Get border color based on URL status
  const getUrlBorderClass = (urlStatus: IndexingStatus) => {
    switch (urlStatus) {
      case 'pending':
        return 'border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10'
      case 'requested':
        return 'border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10'
      case 'indexed':
        return 'border-[var(--pv-border)] bg-transparent hover:bg-emerald-500/5'
    }
  }

  return (
    <div
      className="
        relative
        bg-[var(--pv-surface)]
        border border-[var(--pv-border)]
        rounded-lg
        overflow-clip
        transition-all duration-200
        hover:border-[var(--pv-primary)]/30
        animate-fade-in
      "
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'backwards',
      }}
    >
      {/* Sticky Header Container - includes status row and URL actions row */}
      <div
        className="
          sticky top-0 z-10
          bg-[var(--pv-surface)]
          border-b border-[var(--pv-border)]
          rounded-t-lg
        "
      >
        {/* Header: Status + Timestamps */}
        <div className="flex items-center justify-between gap-4 px-5 py-3 bg-[var(--pv-bg)] border-b border-[var(--pv-border)]">
          <DeploymentStatusBadge
            status={status}
            indexedCount={indexedCount}
            requestedCount={requestedCount}
            totalCount={totalCount}
          />

          <div className="flex items-center gap-3 text-xs text-[var(--pv-text-muted)]">
            <time
              className="font-mono"
              dateTime={deployment.created_at}
              title={formatTimestamp(deployment.created_at)}
            >
              {formatTimestamp(deployment.created_at)}
            </time>
            <span className="text-[var(--pv-text-muted)]/70">
              {formatRelativeTime(deployment.created_at)}
            </span>
          </div>
        </div>

        {/* Changed URLs Header Row */}
        <div className="flex items-center justify-between gap-4 px-5 pt-5 pb-3 bg-[var(--pv-surface)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-[var(--pv-text-muted)]" />
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                {urlFilter === 'all' ? 'Changed URLs' : urlFilter === 'requested' ? 'Submitted URLs' : `${urlFilter.charAt(0).toUpperCase() + urlFilter.slice(1)} URLs`} ({filteredUrls.length}{urlFilter !== 'all' ? `/${totalCount}` : ''})
              </h4>
            </div>
            {/* Status count chips */}
            {urlFilter === 'all' && totalCount > 0 && (
              <div className="flex items-center gap-2">
                {pendingCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-500 border border-amber-500/20">
                    <Clock className="h-3 w-3" />
                    <span className="font-mono">{pendingCount}</span>
                    <span className="hidden sm:inline">pending</span>
                  </span>
                )}
                {requestedCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-500 border border-blue-500/20">
                    <Send className="h-3 w-3" />
                    <span className="font-mono">{requestedCount}</span>
                    <span className="hidden sm:inline">submitted</span>
                  </span>
                )}
                {indexedCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-500 border border-emerald-500/20">
                    <CheckCircle className="h-3 w-3" />
                    <span className="font-mono">{indexedCount}</span>
                    <span className="hidden sm:inline">indexed</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bulk Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Copy all non-indexed URLs */}
            {hasNonIndexedUrls && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyAllUrls}
                className="h-8 px-2 text-xs"
                title="Copy all pending/requested URLs for GSC"
              >
                {copiedAll ? (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
                    <span className="text-emerald-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                    <span>Copy URLs</span>
                  </>
                )}
              </Button>
            )}

            {/* Mark All as Requested (only if pending URLs exist) */}
            {hasPendingUrls && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateAllStatus('requested')}
                disabled={updatingAll !== null}
                className="h-8 px-3 text-xs border-blue-500/30 text-blue-500 hover:bg-blue-500/10"
                title="Mark all URLs as submitted to GSC"
              >
                {updatingAll === 'requested' ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    <span>Marking...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    <span>Submit All</span>
                  </>
                )}
              </Button>
            )}

            {/* Mark All as Indexed (only if non-indexed URLs exist) */}
            {hasNonIndexedUrls && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateAllStatus('indexed')}
                disabled={updatingAll !== null}
                className="h-8 px-3 text-xs border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                title="Mark all URLs as indexed in Google"
              >
                {updatingAll === 'indexed' ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    <span>Marking...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                    <span>Index All</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Changed URLs List */}
      <div className="px-5 py-4 border-b border-[var(--pv-border)]">
        <div className="space-y-1.5">
          {filteredUrls.map((urlObj) => {
            const isUpdating = updatingUrl === urlObj.url
            const canRequest = urlObj.indexing_status === 'pending'
            const canIndex =
              urlObj.indexing_status === 'pending' ||
              urlObj.indexing_status === 'requested'
            // Get the original index from the full list (not filtered)
            const originalIndex = deployment.changed_urls.findIndex(u => u.url === urlObj.url)

            return (
              <div
                key={urlObj.url}
                className={`
                  flex items-center justify-between gap-3
                  px-3 py-2.5
                  border
                  rounded
                  transition-all duration-150
                  group/url
                  ${getUrlBorderClass(urlObj.indexing_status)}
                `}
              >
                {/* Number + Status indicator + URL */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <span className="flex-shrink-0 w-6 text-xs font-mono text-[var(--pv-text-muted)] text-right">
                    {originalIndex + 1}.
                  </span>
                  <UrlStatusIndicator
                    status={urlObj.indexing_status}
                    showLabel={false}
                  />

                  <a
                    href={urlObj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex-1
                      font-mono text-sm
                      text-[var(--pv-text)]
                      hover:text-[var(--pv-primary)]
                      transition-colors
                      truncate
                    "
                    title={urlObj.url}
                  >
                    {urlObj.url}
                  </a>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Request Indexing button (pending → requested) */}
                  {canRequest && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateUrlStatus(urlObj.url, 'requested')}
                      disabled={isUpdating}
                      className="h-8 px-2 text-xs text-blue-500 hover:bg-blue-500/10"
                      title="Mark as submitted to Google Search Console"
                    >
                      {isUpdating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5 mr-1" />
                          <span>Submitted URL</span>
                        </>
                      )}
                    </Button>
                  )}

                  {/* Mark Indexed button (pending/requested → indexed) */}
                  {canIndex && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateUrlStatus(urlObj.url, 'indexed')}
                      disabled={isUpdating}
                      className="h-8 px-2 text-xs text-emerald-500 hover:bg-emerald-500/10"
                      title="Mark as indexed in Google"
                    >
                      {isUpdating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          <span>Indexed</span>
                        </>
                      )}
                    </Button>
                  )}

                  {/* Show indexed status for completed URLs */}
                  {urlObj.indexing_status === 'indexed' && (
                    <div className="flex items-center gap-1 px-2 text-xs text-emerald-500">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span className="font-medium">Indexed</span>
                    </div>
                  )}

                  {/* Copy and external link buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover/url:opacity-100 transition-opacity">
                    <CopyButton text={urlObj.url} />
                    <a
                      href={urlObj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        h-8 w-8
                        flex items-center justify-center
                        rounded
                        hover:bg-[var(--pv-surface)]
                        transition-colors
                      "
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-4 w-4 text-[var(--pv-text-muted)]" />
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Changes/Summary Section */}
      {deployment.deploy_summary && (
        <div className="px-5 py-4 border-b border-[var(--pv-border)]">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-[var(--pv-text-muted)]" />
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
              Changes
            </h4>
          </div>
          <div className="text-sm text-[var(--pv-text)] leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
            <ReactMarkdown>{deployment.deploy_summary}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Timestamps Footer */}
      <div className="px-5 py-3 bg-[var(--pv-bg)] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--pv-text-muted)]">
        {deployment.indexing_requested_at && (
          <div className="flex items-center gap-1.5">
            <Send className="h-3 w-3 text-blue-500" />
            <span className="font-semibold">Submitted:</span>
            <time
              className="font-mono"
              dateTime={deployment.indexing_requested_at}
              title={formatTimestamp(deployment.indexing_requested_at)}
            >
              {formatTimestamp(deployment.indexing_requested_at)}
            </time>
          </div>
        )}

        {deployment.indexed_at && (
          <div className="flex items-center gap-1.5">
            <CheckCircle className="h-3 w-3 text-emerald-500" />
            <span className="font-semibold">Indexed:</span>
            <time
              className="font-mono"
              dateTime={deployment.indexed_at}
              title={formatTimestamp(deployment.indexed_at)}
            >
              {formatTimestamp(deployment.indexed_at)}
            </time>
          </div>
        )}

        {!deployment.indexing_requested_at && !deployment.indexed_at && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-amber-500" />
            <span>Awaiting GSC submission</span>
          </div>
        )}
      </div>

      {/* Error message if update failed */}
      {error && (
        <div className="px-5 py-3 bg-red-500/5 border-t border-red-500/20">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
    </div>
  )
}
