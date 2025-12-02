'use client'

import { useState } from 'react'
import {
  ExternalLink,
  Copy,
  Check,
  Save,
  X,
  Trash2,
  ArrowUpRight,
  History,
  Target,
  Globe,
  Pencil,
} from 'lucide-react'
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
  seo_focus?: object | null
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

  const handleDeployments = () => {
    router.push(`/dashboard/clients/${clientId}/websites/${website.id}`)
  }

  const handleSeoFocus = () => {
    router.push(`/dashboard/clients/${clientId}/websites/${website.id}/seo-focus`)
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
      className={cn(
        'group relative overflow-hidden rounded-2xl border transition-all duration-300',
        isEditing
          ? 'border-[var(--pv-primary)] shadow-[0_0_0_3px_rgba(63,0,233,0.1)]'
          : 'border-[var(--pv-border)] hover:border-[var(--pv-border)] hover:shadow-[0_8px_30px_-12px_rgba(63,0,233,0.15)]'
      )}
      style={{ background: 'var(--pv-surface)' }}
    >
      {/* Gradient accent bar at top */}
      <div
        className={cn(
          'h-1 w-full transition-opacity duration-300',
          isEditing ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'
        )}
        style={{ background: 'var(--pv-gradient)' }}
      />

      <div className="p-6">
        {isEditing ? (
          /* ============ EDIT MODE ============ */
          <div className="space-y-5">
            {/* Edit Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: 'var(--pv-primary)', opacity: 0.1 }}
                >
                  <Pencil className="h-4 w-4 text-[var(--pv-primary)]" />
                </div>
                <span className="text-sm font-semibold text-[var(--pv-text)]">Edit Website</span>
              </div>
              <WebsiteTypeBadge type={editedWebsite.type} />
            </div>

            {/* Edit Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                  Website Title
                </label>
                <Input
                  value={editedWebsite.title}
                  onChange={(e) => setEditedWebsite({ ...editedWebsite, title: e.target.value })}
                  className="text-base font-semibold"
                  placeholder="e.g., 360 Degree Care"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                  Website Type
                </label>
                <select
                  value={editedWebsite.type}
                  onChange={(e) => setEditedWebsite({ ...editedWebsite, type: e.target.value })}
                  className="h-10 w-full rounded-lg border px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--pv-primary)]/20"
                  style={{
                    background: 'var(--pv-bg)',
                    borderColor: 'var(--pv-border)',
                    color: 'var(--pv-text)',
                  }}
                >
                  <option value="Static">Static</option>
                  <option value="WordPress">WordPress</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                  Domain
                </label>
                <Input
                  value={editedWebsite.domain}
                  onChange={(e) => setEditedWebsite({ ...editedWebsite, domain: e.target.value })}
                  className="font-mono text-sm"
                  placeholder="www.example.com"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                  Slug
                </label>
                <Input
                  value={editedWebsite.website_slug}
                  onChange={(e) => setEditedWebsite({ ...editedWebsite, website_slug: e.target.value })}
                  className="font-mono text-sm"
                  placeholder="e.g., 360dc"
                />
              </div>
            </div>

            {/* Edit Actions */}
            <div className="flex items-center gap-3 border-t border-[var(--pv-border)] pt-5">
              <button
                onClick={handleSave}
                className="group/btn flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                style={{ background: 'var(--pv-gradient)' }}
              >
                <Save className="h-4 w-4 transition-transform duration-200 group-hover/btn:rotate-[-8deg]" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center justify-center gap-2 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-bg)] px-5 py-3 text-sm font-medium text-[var(--pv-text)] transition-all duration-200 hover:bg-[var(--pv-surface)] active:scale-[0.98]"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* ============ VIEW MODE ============ */
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(63, 0, 233, 0.08)' }}
                >
                  <Globe className="h-6 w-6 text-[var(--pv-primary)]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--pv-text)]">{website.title}</h3>
                  <p className="text-sm text-[var(--pv-text-muted)]">Website</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <WebsiteTypeBadge type={website.type} />
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg border border-transparent p-2 text-[var(--pv-text-muted)] transition-all duration-200 hover:border-[var(--pv-border)] hover:bg-[var(--pv-bg)] hover:text-[var(--pv-text)]"
                  aria-label="Edit website"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Domain Box */}
            <div
              className="rounded-xl border p-4"
              style={{
                background: 'var(--pv-bg)',
                borderColor: 'var(--pv-border)',
              }}
            >
              <a
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link flex items-center gap-2 text-base font-medium transition-colors hover:text-[var(--pv-primary)]"
                style={{ color: 'var(--pv-text)' }}
              >
                <span className="font-mono">{website.domain}</span>
                <ExternalLink className="h-4 w-4 text-[var(--pv-text-muted)] transition-all group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-[var(--pv-primary)]" />
              </a>
              {website.website_slug && (
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="inline-block rounded-md px-2 py-0.5 font-mono text-xs"
                    style={{
                      background: 'var(--pv-border)',
                      color: 'var(--pv-text-muted)',
                    }}
                  >
                    /{website.website_slug}
                  </span>
                </div>
              )}
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {/* Visit Site */}
              <button
                onClick={handleVisit}
                className="group/visit relative flex flex-col items-center gap-2 overflow-hidden rounded-xl px-4 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                style={{ background: 'var(--pv-gradient)' }}
              >
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover/visit:-translate-y-0.5 group-hover/visit:translate-x-0.5" />
                <span>Visit Site</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover/visit:translate-x-full" />
              </button>

              {/* Copy URL */}
              <button
                onClick={handleCopy}
                className={cn(
                  'group/copy flex flex-col items-center gap-2 rounded-xl border px-4 py-4 text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]',
                  copied
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-[var(--pv-border)] bg-[var(--pv-bg)] text-[var(--pv-text)] hover:border-[var(--pv-primary)]/50 hover:text-[var(--pv-primary)]'
                )}
              >
                {copied ? (
                  <Check className="h-5 w-5 animate-[bounce_0.4s_ease-out]" />
                ) : (
                  <Copy className="h-5 w-5 transition-transform duration-200 group-hover/copy:scale-110" />
                )}
                <span>{copied ? 'Copied!' : 'Copy URL'}</span>
              </button>

              {/* Deployments */}
              <button
                onClick={handleDeployments}
                className="group/deploy flex flex-col items-center gap-2 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-bg)] px-4 py-4 text-sm font-medium text-[var(--pv-text)] transition-all duration-300 hover:scale-[1.02] hover:border-[var(--pv-primary)]/50 hover:text-[var(--pv-primary)] active:scale-[0.98]"
              >
                <History className="h-5 w-5 transition-transform duration-200 group-hover/deploy:scale-110" />
                <span>Deploys</span>
              </button>

              {/* SEO Focus or Delete */}
              {website.seo_focus ? (
                <button
                  onClick={handleSeoFocus}
                  className="group/seo flex flex-col items-center gap-2 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-bg)] px-4 py-4 text-sm font-medium text-[var(--pv-text)] transition-all duration-300 hover:scale-[1.02] hover:border-[var(--pv-primary)]/50 hover:text-[var(--pv-primary)] active:scale-[0.98]"
                >
                  <Target className="h-5 w-5 transition-transform duration-200 group-hover/seo:scale-110" />
                  <span>SEO Focus</span>
                </button>
              ) : (
                <button
                  onClick={handleDelete}
                  className="group/delete flex flex-col items-center gap-2 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-bg)] px-4 py-4 text-sm font-medium text-[var(--pv-text-muted)] transition-all duration-300 hover:scale-[1.02] hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-500 active:scale-[0.98]"
                >
                  <Trash2 className="h-5 w-5 transition-transform duration-200 group-hover/delete:scale-110" />
                  <span>Delete</span>
                </button>
              )}
            </div>

            {/* Bottom row with SEO + Delete when SEO exists */}
            {website.seo_focus && (
              <div className="flex justify-end border-t border-[var(--pv-border)] pt-4">
                <button
                  onClick={handleDelete}
                  className="group/delete flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[var(--pv-text-muted)] transition-all duration-200 hover:bg-red-500/10 hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Website</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
