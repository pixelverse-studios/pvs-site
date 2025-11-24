'use client'

import { useState } from 'react'
import { Deployment } from '../types'
import { DeploymentStatusBadge } from './deployment-status-badge'
import { CopyButton } from '../../../components/copy-button'
import { ExternalLink, FileText, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getApiBaseUrl } from '@/lib/api-config'

interface DeploymentCardProps {
  deployment: Deployment
  index: number
  onUrlMarked?: () => void
}

export function DeploymentCard({ deployment, index, onUrlMarked }: DeploymentCardProps) {
  const [markingUrl, setMarkingUrl] = useState<string | null>(null)
  const [markingAll, setMarkingAll] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate status based on URL indexing
  const indexedUrlCount = deployment.changed_urls.filter(u => u.indexed_at).length
  const totalUrlCount = deployment.changed_urls.length
  const isFullyIndexed = deployment.indexed_at !== null
  const isPartiallyIndexed = indexedUrlCount > 0 && !isFullyIndexed
  const hasPendingUrls = deployment.changed_urls.some(u => !u.indexed_at)

  const status = isFullyIndexed ? 'indexed' : (isPartiallyIndexed ? 'partial' : 'pending')

  // Handler to mark a single URL as indexed
  const handleMarkUrlIndexed = async (url: string) => {
    setMarkingUrl(url)
    setError(null)

    try {
      const response = await fetch(
        `${getApiBaseUrl()}/api/deployments/${deployment.id}/urls/indexed`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        }
      )

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Deployment not found')
        }
        throw new Error(`Failed to mark URL as indexed: ${response.status}`)
      }

      // Success - trigger refetch
      if (onUrlMarked) {
        onUrlMarked()
      }
    } catch (err) {
      console.error('Error marking URL as indexed:', err)
      setError(err instanceof Error ? err.message : 'Failed to mark URL as indexed')
    } finally {
      setMarkingUrl(null)
    }
  }

  // Handler to mark entire deployment as indexed
  const handleMarkAllIndexed = async () => {
    setMarkingAll(true)
    setError(null)

    try {
      const response = await fetch(
        `${getApiBaseUrl()}/api/deployments/${deployment.id}/indexed`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Deployment not found')
        }
        throw new Error(`Failed to mark deployment as indexed: ${response.status}`)
      }

      // Success - trigger refetch
      if (onUrlMarked) {
        onUrlMarked()
      }
    } catch (err) {
      console.error('Error marking deployment as indexed:', err)
      setError(err instanceof Error ? err.message : 'Failed to mark deployment as indexed')
    } finally {
      setMarkingAll(false)
    }
  }

  // Format timestamp as mission control style: YYYY-MM-DD HH:MM:SS UTC
  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString)
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    const seconds = String(date.getUTCSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`
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

  return (
    <div
      className="
        bg-[var(--pv-surface)]
        border border-[var(--pv-border)]
        rounded-lg
        overflow-hidden
        transition-all duration-200
        hover:border-[var(--pv-primary)]/30
        animate-fade-in
      "
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'backwards',
      }}
    >
      {/* Compact Header: Status + Timestamps inline */}
      <div className="flex items-center justify-between gap-4 px-5 py-3 bg-[var(--pv-bg)] border-b border-[var(--pv-border)]">
        <DeploymentStatusBadge
          status={status}
          indexedCount={indexedUrlCount}
          totalCount={totalUrlCount}
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

      {/* Changed URLs Section (AT TOP) */}
      <div className="px-5 py-4 border-b border-[var(--pv-border)]">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-[var(--pv-text-muted)]" />
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
              Changed URLs ({deployment.changed_urls.length})
            </h4>
            {deployment.changed_urls.length > 0 && (
              <span className="text-xs text-[var(--pv-text-muted)]">
                {deployment.changed_urls.filter(u => u.indexed_at).length}/{deployment.changed_urls.length} indexed
              </span>
            )}
          </div>

          {/* Mark All as Indexed button (only show if there are pending URLs) */}
          {hasPendingUrls && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllIndexed}
              disabled={markingAll}
              className="h-8 px-3 text-xs"
              title="Mark all URLs in this deployment as indexed"
            >
              {markingAll ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  <span>Marking All...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                  <span>Mark All as Indexed</span>
                </>
              )}
            </Button>
          )}
        </div>

        <div className="space-y-1.5">
          {deployment.changed_urls.map((urlObj) => {
            const isIndexed = urlObj.indexed_at !== null

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
                  ${isIndexed
                    ? 'border-[var(--pv-border)] bg-transparent hover:bg-emerald-500/5'
                    : 'border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10'
                  }
                `}
              >
                {/* Status indicator dot + URL */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div
                    className={`
                      flex-shrink-0 w-1.5 h-1.5 rounded-full
                      ${isIndexed ? 'bg-emerald-500' : 'bg-amber-500'}
                    `}
                    title={isIndexed ? 'Indexed' : 'Pending indexing'}
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
                  {/* Mark as Indexed button (only for pending URLs) */}
                  {!isIndexed && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkUrlIndexed(urlObj.url)}
                      disabled={markingUrl === urlObj.url}
                      className="h-8 px-2 text-xs"
                      title="Mark as indexed in Google Search Console"
                    >
                      {markingUrl === urlObj.url ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                          <span>Marking...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          <span>Mark Indexed</span>
                        </>
                      )}
                    </Button>
                  )}

                  {/* Show indexed checkmark for indexed URLs */}
                  {isIndexed && (
                    <div className="flex items-center gap-1 px-2 text-xs text-emerald-500">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span className="font-medium">Indexed</span>
                    </div>
                  )}

                  {/* Copy and external link buttons - always visible on hover */}
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

      {/* Changes/Summary Section (BELOW URLs) */}
      {deployment.summary && (
        <div className="px-5 py-4 border-b border-[var(--pv-border)]">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-[var(--pv-text-muted)]" />
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
              Changes
            </h4>
          </div>
          <p className="text-sm text-[var(--pv-text)] leading-relaxed">
            {deployment.summary}
          </p>
        </div>
      )}

      {/* Indexed timestamp (if applicable) */}
      {deployment.indexed_at && (
        <div className="px-5 py-3 bg-[var(--pv-bg)]">
          <div className="text-xs text-[var(--pv-text-muted)]">
            <span className="font-semibold">Indexed:</span>{' '}
            <time
              className="font-mono"
              dateTime={deployment.indexed_at}
              title={formatTimestamp(deployment.indexed_at)}
            >
              {formatTimestamp(deployment.indexed_at)}
            </time>
          </div>
        </div>
      )}

      {/* Error message if marking failed */}
      {error && (
        <div className="px-5 py-3 bg-red-500/5 border-t border-red-500/20">
          <p className="text-sm text-red-500">
            {error}
          </p>
        </div>
      )}
    </div>
  )
}
