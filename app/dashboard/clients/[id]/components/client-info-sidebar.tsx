'use client'

import { Mail, Phone, Calendar, Clock, Hash, User } from 'lucide-react'
import { ClientStatusBadge } from '../../components/client-status-badge'
import { CopyButton } from './copy-button'

interface ClientInfoSidebarProps {
  client: {
    id: string
    firstname: string | null
    lastname: string | null
    email: string | null
    phone: string | null
    active: boolean | null
    created_at: string
    updated_at: string | null
  }
  formattedCreatedAt: string
  formattedUpdatedAt: string
}

export function ClientInfoSidebar({ client, formattedCreatedAt, formattedUpdatedAt }: ClientInfoSidebarProps) {
  const fullName =
    client.firstname && client.lastname
      ? `${client.firstname} ${client.lastname}`
      : client.firstname || client.lastname || 'Unnamed Client'

  return (
    <div className="space-y-4">
      {/* Client Header */}
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--pv-text)' }}>
            {fullName}
          </h2>
          <ClientStatusBadge active={client.active} />
        </div>
        <p className="font-mono text-xs text-[var(--pv-text-muted)]">ID: {client.id.slice(0, 12)}...</p>
      </div>

      {/* Contact Section */}
      <div
        className="rounded-lg border p-4"
        style={{
          background: 'var(--pv-surface)',
          borderColor: 'var(--pv-border)',
        }}
      >
        <div className="mb-3 flex items-center gap-2">
          <User className="h-4 w-4 text-[var(--pv-text-muted)]" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
            Contact
          </h3>
        </div>

        <div className="space-y-3">
          {/* Email */}
          <div>
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-[var(--pv-text-muted)]" />
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--pv-text-muted)]">
                Email
              </p>
            </div>
            {client.email ? (
              <div className="mt-1 flex items-center justify-between gap-2">
                <a
                  href={`mailto:${client.email}`}
                  className="text-sm text-[var(--pv-text)] hover:text-[var(--pv-primary)] hover:underline"
                >
                  {client.email}
                </a>
                <CopyButton text={client.email} />
              </div>
            ) : (
              <p className="mt-1 text-sm text-[var(--pv-text-muted)]">Not provided</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-[var(--pv-text-muted)]" />
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--pv-text-muted)]">
                Phone
              </p>
            </div>
            {client.phone ? (
              <div className="mt-1 flex items-center justify-between gap-2">
                <a
                  href={`tel:${client.phone}`}
                  className="text-sm text-[var(--pv-text)] hover:text-[var(--pv-primary)] hover:underline"
                >
                  {client.phone}
                </a>
                <CopyButton text={client.phone} />
              </div>
            ) : (
              <p className="mt-1 text-sm text-[var(--pv-text-muted)]">Not provided</p>
            )}
          </div>
        </div>
      </div>

      {/* Account Details Section */}
      <div
        className="rounded-lg border p-4"
        style={{
          background: 'var(--pv-surface)',
          borderColor: 'var(--pv-border)',
        }}
      >
        <div className="mb-3 flex items-center gap-2">
          <Hash className="h-4 w-4 text-[var(--pv-text-muted)]" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
            Account
          </h3>
        </div>

        <div className="space-y-3">
          {/* Created */}
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-[var(--pv-text-muted)]" />
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--pv-text-muted)]">
                Created
              </p>
            </div>
            <p className="mt-1 text-sm text-[var(--pv-text)]">
              {formattedCreatedAt}
            </p>
          </div>

          {/* Updated */}
          <div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-[var(--pv-text-muted)]" />
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--pv-text-muted)]">
                Last Updated
              </p>
            </div>
            <p className="mt-1 text-sm text-[var(--pv-text)]">
              {formattedUpdatedAt}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
