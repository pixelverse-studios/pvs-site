'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ExternalLink,
  Calendar,
  FileText,
  Search,
  Mail,
  Clock,
  MessageSquare,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getApiBaseUrl } from '@/lib/api-config';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Prospect,
  ProspectSource,
  ProspectStatus,
  SOURCE_LABELS,
  STATUS_LABELS,
  SOURCE_COLORS,
  STATUS_COLORS,
} from './types';

// ─── Badge helpers ────────────────────────────────────────────────────────────

function SourceBadge({ source }: { source: ProspectSource }) {
  const c = SOURCE_COLORS[source];
  return (
    <span className={cn('rounded-full border px-2.5 py-0.5 text-xs font-medium', c.bg, c.text, c.border)}>
      {SOURCE_LABELS[source]}
    </span>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[var(--pv-text-muted)]" />
        <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
          {title}
        </h4>
      </div>
      <div className="rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-4">
        {children}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | string[] | null }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const display = Array.isArray(value) ? value.join(', ') : value;
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-[var(--pv-text-muted)]">{label}</p>
      <p className="text-sm text-[var(--pv-text)]">{display}</p>
    </div>
  );
}

// ─── Status selector ──────────────────────────────────────────────────────────

interface StatusSelectorProps {
  current: ProspectStatus;
  prospectId: string;
  onUpdate: (newStatus: ProspectStatus) => void;
}

function StatusSelector({ current, prospectId, onUpdate }: StatusSelectorProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = async (newStatus: ProspectStatus) => {
    if (newStatus === current) return;
    setSaving(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/prospects/${prospectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onUpdate(newStatus);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // status update failed silently — user can retry
    } finally {
      setSaving(false);
    }
  };

  const c = STATUS_COLORS[current];

  return (
    <div className="flex items-center gap-2">
      <select
        value={current}
        onChange={(e) => handleChange(e.target.value as ProspectStatus)}
        disabled={saving}
        className={cn(
          'rounded-full border px-3 py-1 text-xs font-medium outline-none transition-colors disabled:opacity-50',
          c.bg,
          c.text,
          c.border,
        )}
        aria-label="Update prospect status"
      >
        {(Object.keys(STATUS_LABELS) as ProspectStatus[]).map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {saving && <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--pv-text-muted)]" />}
      {saved && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
    </div>
  );
}

// ─── Notes field ──────────────────────────────────────────────────────────────

interface NotesFieldProps {
  prospectId: string;
  initialNotes: string;
}

function NotesField({ prospectId, initialNotes }: NotesFieldProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const save = async (value: string) => {
    setSaving(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/prospects/${prospectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: value }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // notes save failed silently
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (value: string) => {
    setNotes(value);
    setSaved(false);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => save(value), 1000);
  };

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-[var(--pv-text-muted)]" />
        <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]">
          Internal Notes
        </h4>
        {saving && <Loader2 className="ml-auto h-3.5 w-3.5 animate-spin text-[var(--pv-text-muted)]" />}
        {saved && !saving && (
          <span className="ml-auto flex items-center gap-1 text-xs text-emerald-500">
            <CheckCircle2 className="h-3 w-3" /> Saved
          </span>
        )}
      </div>
      <textarea
        value={notes}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Add internal notes about this prospect…"
        rows={4}
        className="w-full resize-none rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-3 text-sm text-[var(--pv-text)] placeholder:text-[var(--pv-text-muted)] outline-none transition-colors focus:border-[var(--pv-primary)]"
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ProspectDetailDrawerProps {
  prospect: Prospect | null;
  open: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, newStatus: ProspectStatus) => void;
}

export function ProspectDetailDrawer({
  prospect,
  open,
  onClose,
  onStatusUpdate,
}: ProspectDetailDrawerProps) {
  const formatDate = (str?: string) => {
    if (!str) return '—';
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date(str));
    } catch {
      return '—';
    }
  };

  const formatRelative = (str?: string) => {
    if (!str) return '—';
    try {
      const diff = Date.now() - new Date(str).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'just now';
      if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
      const days = Math.floor(hrs / 24);
      if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
      const months = Math.floor(days / 30);
      if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
      return `${Math.floor(months / 12)} year${Math.floor(months / 12) !== 1 ? 's' : ''} ago`;
    } catch {
      return '—';
    }
  };

  if (!prospect) return null;

  const sourceIcon =
    prospect.source === 'calendly_call'
      ? Calendar
      : prospect.source === 'review_request'
        ? Search
        : FileText;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-[480px]"
        style={{ background: 'var(--pv-bg)', borderColor: 'var(--pv-border)' }}
      >
        {/* Header */}
        <SheetHeader className="sticky top-0 z-10 border-b border-[var(--pv-border)] px-6 py-4 pr-14" style={{ background: 'var(--pv-bg)' }}>
          <div className="min-w-0">
            <SheetTitle className="truncate font-heading text-lg font-semibold text-[var(--pv-text)]">
              {prospect.name}
            </SheetTitle>
            <div className="mt-1 flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 shrink-0 text-[var(--pv-text-muted)]" />
              <span className="truncate text-sm text-[var(--pv-text-muted)]">{prospect.email}</span>
            </div>
          </div>

          {/* Source + Status row */}
          <div className="mt-3 flex items-center gap-3">
            <SourceBadge source={prospect.source} />
            <StatusSelector
              current={prospect.status}
              prospectId={prospect.id}
              onUpdate={(newStatus) => onStatusUpdate(prospect.id, newStatus)}
            />
          </div>

          {/* Timestamps */}
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-[var(--pv-text-muted)]">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              First seen {formatRelative(prospect.first_seen)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last activity {formatRelative(prospect.last_activity)}
            </span>
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="space-y-6 px-6 py-6">
          {/* Lead submission */}
          {prospect.lead_submission && (
            <Section icon={FileText} title="Project Inquiry">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Company" value={prospect.lead_submission.company_name} />
                <Field label="Phone" value={prospect.lead_submission.phone_number} />
                <Field label="Website" value={prospect.lead_submission.current_website} />
                <Field label="Interested In" value={prospect.lead_submission.interested_in} />
                <div className="sm:col-span-2">
                  <Field label="Summary" value={prospect.lead_submission.brief_summary} />
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-[var(--pv-text-muted)]">Submitted</p>
                  <p className="text-sm text-[var(--pv-text)]">
                    {formatDate(prospect.lead_submission.submitted_at)}
                  </p>
                </div>
              </div>
            </Section>
          )}

          {/* Audit request */}
          {prospect.audit_request && (
            <Section icon={Search} title="Website Review Request">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <p className="text-xs text-[var(--pv-text-muted)]">Website URL</p>
                  <a
                    href={prospect.audit_request.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-[var(--pv-primary)] underline underline-offset-2"
                  >
                    {prospect.audit_request.website_url}
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </div>
                <Field label="Phone" value={prospect.audit_request.phone_number} />
                <Field label="Focus Areas" value={prospect.audit_request.specifics} />
                <div className="sm:col-span-2">
                  <p className="text-xs text-[var(--pv-text-muted)]">Submitted</p>
                  <p className="text-sm text-[var(--pv-text)]">
                    {formatDate(prospect.audit_request.submitted_at)}
                  </p>
                </div>
              </div>
            </Section>
          )}

          {/* Calendly booking */}
          {prospect.calendly_booking && (
            <Section icon={Calendar} title="Strategy Call">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {prospect.calendly_booking.event_name && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-[var(--pv-text-muted)]">Event</p>
                    <p className="text-sm text-[var(--pv-text)]">{prospect.calendly_booking.event_name}</p>
                  </div>
                )}
                {prospect.calendly_booking.start_time && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-[var(--pv-text-muted)]">Scheduled For</p>
                    <p className="text-sm text-[var(--pv-text)]">
                      {formatDate(prospect.calendly_booking.start_time)}
                    </p>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <p className="text-xs text-[var(--pv-text-muted)]">Booked</p>
                  <p className="text-sm text-[var(--pv-text)]">
                    {formatDate(prospect.calendly_booking.booked_at)}
                  </p>
                </div>
                {(prospect.calendly_booking.cancel_url || prospect.calendly_booking.reschedule_url) && (
                  <div className="flex flex-wrap gap-2 sm:col-span-2">
                    {prospect.calendly_booking.reschedule_url && (
                      <a
                        href={prospect.calendly_booking.reschedule_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-lg border border-[var(--pv-border)] px-3 py-1.5 text-xs font-medium text-[var(--pv-text)] transition-colors hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)]"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Reschedule
                      </a>
                    )}
                    {prospect.calendly_booking.cancel_url && (
                      <a
                        href={prospect.calendly_booking.cancel_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:border-red-500/40 hover:text-red-500"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Cancel
                      </a>
                    )}
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Notes */}
          <NotesField prospectId={prospect.id} initialNotes={prospect.notes ?? ''} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
