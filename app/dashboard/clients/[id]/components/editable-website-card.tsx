'use client'

import { useState } from 'react'
import { ExternalLink, Copy, Check, Eye, Save, X, Trash2 } from 'lucide-react'
import { WebsiteTypeBadge } from '../../components/website-type-badge'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

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
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                style={{
                  background: 'var(--pv-gradient)',
                  color: '#fff',
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </span>
              </button>
              <button
                onClick={handleCancel}
                className="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                style={{
                  background: 'var(--pv-border)',
                  color: 'var(--pv-text)',
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleVisit}
                className="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:shadow-md"
                style={{
                  background: 'var(--pv-gradient)',
                  color: '#fff',
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Visit
                </span>
              </button>

              <button
                onClick={handleCopy}
                className="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                style={{
                  background: copied ? 'var(--pv-success)' : 'var(--pv-border)',
                  color: copied ? '#fff' : 'var(--pv-text)',
                }}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>

              <button
                onClick={handleView}
                className="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                style={{
                  background: 'var(--pv-border)',
                  color: 'var(--pv-text)',
                }}
              >
                <Eye className="h-4 w-4" />
              </button>

              <button
                onClick={handleDelete}
                className="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-red-50"
                style={{
                  background: 'var(--pv-border)',
                  color: 'var(--pv-danger)',
                }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
