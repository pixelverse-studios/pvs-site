'use client'

import { useState } from 'react'
import { ExternalLink, Copy, Check, Eye, Save, X, Trash2, ArrowUpRight } from 'lucide-react'
import { WebsiteTypeBadge } from '../../components/website-type-badge'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Website {
  id: string
  type: string
  title: string
  domain: string
  website_slug: string
}

interface EditableWebsiteCardProps {
  website: Website
  clientId: string
  onSave?: (updatedWebsite: Website) => void
  onDelete?: (websiteId: string) => void
}

export function EditableWebsiteCard({ website, clientId, onSave, onDelete }: EditableWebsiteCardProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [editedWebsite, setEditedWebsite] = useState(website)

  const fullUrl = `https://${website.domain}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleVisit = () => {
    window.open(fullUrl, '_blank', 'noopener,noreferrer')
  }

  const handleView = () => {
    router.push(`/dashboard/clients/${clientId}/websites/${website.id}`)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedWebsite(website)
  }

  const handleSave = () => {
    if (onSave) {
      onSave(editedWebsite)
    }
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (onDelete && confirm(`Are you sure you want to delete "${website.title}"?`)) {
      onDelete(website.id)
    }
  }

  return (
    <div
      className="group relative overflow-hidden rounded-lg border transition-all duration-200"
      style={{
        background: 'var(--pv-surface)',
        borderColor: isEditing ? 'var(--pv-primary)' : 'var(--pv-border)',
        boxShadow: isEditing ? '0 0 0 2px rgba(63, 0, 233, 0.1)' : 'none',
      }}
    >
      {/* Edit mode indicator */}
      {isEditing && (
        <div
          className="absolute left-0 top-0 h-full w-1"
          style={{
            background: 'var(--pv-gradient)',
          }}
        />
      )}

      <div className="p-4">
        {/* Header Row */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--pv-text-muted)]">
                    Website Title
                  </label>
                  <Input
                    value={editedWebsite.title}
                    onChange={(e) =>
                      setEditedWebsite({ ...editedWebsite, title: e.target.value })
                    }
                    className="font-semibold"
                    placeholder="e.g., 360 Degree Care"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--pv-text-muted)]">
                    Domain
                  </label>
                  <Input
                    value={editedWebsite.domain}
                    onChange={(e) =>
                      setEditedWebsite({ ...editedWebsite, domain: e.target.value })
                    }
                    className="font-mono text-sm"
                    placeholder="www.example.com"
                  />
                </div>
              </div>
            ) : (
              <>
                <h3
                  className="mb-1 text-lg font-semibold leading-tight"
                  style={{ color: 'var(--pv-text)' }}
                >
                  {website.title}
                </h3>
                <a
                  href={fullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-center gap-1 font-mono text-sm transition-colors hover:underline"
                  style={{ color: 'var(--pv-primary)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>{website.domain}</span>
                  <ExternalLink className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </a>
              </>
            )}
          </div>

          {/* Type Badge */}
          {isEditing ? (
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--pv-text-muted)]">
                Type
              </label>
              <select
                value={editedWebsite.type}
                onChange={(e) =>
                  setEditedWebsite({ ...editedWebsite, type: e.target.value })
                }
                className="rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
                style={{
                  background: 'var(--pv-surface)',
                  borderColor: 'var(--pv-border)',
                  color: 'var(--pv-text)',
                }}
              >
                <option value="Static">Static</option>
                <option value="WordPress">WordPress</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          ) : (
            <WebsiteTypeBadge type={website.type} />
          )}
        </div>

        {/* Slug */}
        {isEditing ? (
          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--pv-text-muted)]">
              Website Slug
            </label>
            <Input
              value={editedWebsite.website_slug}
              onChange={(e) =>
                setEditedWebsite({ ...editedWebsite, website_slug: e.target.value })
              }
              className="font-mono text-sm"
              placeholder="e.g., 360dc"
            />
          </div>
        ) : (
          website.website_slug && (
            <div
              className="mb-3 rounded px-2 py-1 font-mono text-xs"
              style={{
                background: 'var(--pv-border)',
                color: 'var(--pv-text-muted)',
              }}
            >
              /{website.website_slug}
            </div>
          )
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="group/btn flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                style={{
                  background: 'var(--pv-gradient)',
                  color: '#fff',
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Save className="h-4 w-4 transition-transform duration-200 group-hover/btn:rotate-[-8deg]" />
                  Save Changes
                </span>
              </button>
              <button
                onClick={handleCancel}
                className="rounded-lg p-2.5 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: 'var(--pv-border)',
                  color: 'var(--pv-text)',
                }}
                aria-label="Cancel editing"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              {/* Primary Action - Visit */}
              <button
                onClick={handleVisit}
                className="group/visit relative flex-[1.2] overflow-hidden rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
                style={{
                  background: 'var(--pv-gradient)',
                  color: '#fff',
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/visit:-translate-y-0.5 group-hover/visit:translate-x-0.5" />
                  <span>Visit</span>
                </span>
                {/* Shine effect on hover */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover/visit:translate-x-full" />
              </button>

              {/* Secondary Action - Copy */}
              <button
                onClick={handleCopy}
                className={cn(
                  "group/copy relative flex-1 overflow-hidden rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
                  copied
                    ? "border-[var(--pv-success)] bg-[var(--pv-success)] text-white"
                    : "border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-text)] hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)]"
                )}
              >
                <span className="flex items-center justify-center gap-2">
                  {copied ? (
                    <Check className="h-4 w-4 animate-[bounce_0.4s_ease-out]" />
                  ) : (
                    <Copy className="h-4 w-4 transition-transform duration-200 group-hover/copy:scale-110" />
                  )}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </span>
              </button>

              {/* Secondary Action - View */}
              <button
                onClick={handleView}
                className="group/view flex-1 rounded-lg border border-transparent bg-[var(--pv-surface)] px-3 py-2.5 text-sm font-medium text-[var(--pv-text)] transition-all duration-300 hover:scale-[1.02] hover:border-[var(--pv-border)] hover:bg-[var(--pv-bg)] active:scale-[0.98]"
              >
                <span className="flex items-center justify-center gap-2">
                  <Eye className="h-4 w-4 transition-transform duration-200 group-hover/view:scale-110" />
                  <span>View</span>
                </span>
              </button>

              {/* Divider */}
              <div className="h-6 w-px bg-[var(--pv-border)]" />

              {/* Destructive Action - Delete */}
              <button
                onClick={handleDelete}
                className="group/delete rounded-lg border border-transparent bg-[var(--pv-surface)] p-2.5 text-[var(--pv-danger)] transition-all duration-300 hover:scale-105 hover:border-[var(--pv-danger)]/30 hover:bg-[var(--pv-danger)]/10 active:scale-95"
                aria-label="Delete website"
              >
                <Trash2 className="h-4 w-4 transition-transform duration-200 group-hover/delete:scale-110" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
