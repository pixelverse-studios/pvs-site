'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ExternalLink,
  Calendar,
  FileText,
  Search,
  Mail,
  Phone,
  Globe2,
  Clock,
  MessageSquare,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Inbox,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getApiBaseUrl } from '@/lib/api-config';
import { Drawer, Select } from '@mantine/core';
import {
  Prospect,
  ProspectSource,
  ProspectStatus,
  STATUS_LABELS,
} from './types';

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

function DetailItem({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--pv-text-muted)]">
        {label}
      </p>
      <div className="text-sm leading-6 text-[var(--pv-text)]">{children}</div>
    </div>
  );
}

function FocusAreaList({ values }: { values?: string[] | string | null }) {
  const items = normalizeList(values);
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item}
          className="flex items-center gap-2 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-bg)] px-3 py-2 text-sm text-[var(--pv-text)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--pv-primary)]" />
          {item}
        </div>
      ))}
    </div>
  );
}

function safeExternalHref(value?: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
  } catch {
    try {
      const url = new URL(`https://${value}`);
      return url.toString();
    } catch {
      return null;
    }
  }
}

function normalizeList(values?: string[] | string | null) {
  if (!values) return [];
  if (Array.isArray(values)) return values.filter(Boolean);
  return values
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function formatPhone(value?: string | null) {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return value;
}

function getProspectTypeLabel(source?: ProspectSource) {
  if (source === 'review_request') return 'Website Review Request';
  if (source === 'details_form') return 'Project Inquiry';
  if (source === 'calendly_call') return 'Strategy Call';
  return 'Prospect';
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
  const [updateError, setUpdateError] = useState(false);

  useEffect(() => {
    setSaved(false);
    setUpdateError(false);
  }, [current, prospectId]);

  const handleChange = async (newStatus: ProspectStatus) => {
    if (newStatus === current) return;
    setUpdateError(false);
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
      setUpdateError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-w-[150px]">
      <Select
        aria-label="Update prospect status"
        data={(Object.keys(STATUS_LABELS) as ProspectStatus[]).map((status) => ({
          value: status,
          label: STATUS_LABELS[status],
        }))}
        value={current}
        onChange={(value) => value && handleChange(value as ProspectStatus)}
        disabled={saving}
        radius="xl"
        size="xs"
        allowDeselect={false}
        comboboxProps={{ withinPortal: true, zIndex: 10000 }}
        rightSection={
          saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--pv-text-muted)]" />
          ) : saved ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          ) : undefined
        }
        classNames={{
          input:
            'border-[var(--pv-border)] bg-[var(--pv-surface)] text-xs font-medium text-[var(--pv-text)]',
          dropdown: 'border-[var(--pv-border)] bg-[var(--pv-bg)]',
          option: 'text-sm',
        }}
      />
      {updateError && (
        <p className="mt-1 text-xs text-red-500">Failed to save — please try again.</p>
      )}
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
  const [saveError, setSaveError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(debounceRef.current);
    setNotes(initialNotes ?? '');
    setSaveError(false);
  }, [initialNotes, prospectId]);

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
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (value: string) => {
    setNotes(value);
    setSaved(false);
    setSaveError(false);
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
        {saveError && !saving && (
          <span className="ml-auto text-xs text-red-500">Failed to save</span>
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

// ─── Date formatting helpers ──────────────────────────────────────────────────

function isValidDate(str?: string | null) {
  if (!str) return false;
  return Number.isFinite(new Date(str).getTime());
}

function formatDate(str?: string | null) {
  if (!isValidDate(str)) return '—';
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(str as string));
  } catch {
    return '—';
  }
}

function formatRelative(str?: string | null) {
  if (!isValidDate(str)) return '—';
  try {
    const diff = Date.now() - new Date(str as string).getTime();
    if (!Number.isFinite(diff)) return '—';
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
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ProspectDetailDrawerProps {
  prospect: Prospect | null;
  detail: Prospect | null;
  open: boolean;
  loading: boolean;
  error: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, newStatus: ProspectStatus) => void;
}

export function ProspectDetailDrawer({
  prospect,
  detail,
  open,
  loading,
  error,
  onClose,
  onStatusUpdate,
}: ProspectDetailDrawerProps) {
  const detailProspect = detail;
  const leadWebsiteHref = safeExternalHref(detailProspect?.lead_submission?.current_website);
  const auditWebsiteHref = safeExternalHref(detailProspect?.audit_request?.website_url);
  const rescheduleHref = safeExternalHref(detailProspect?.calendly_booking?.reschedule_url);
  const cancelHref = safeExternalHref(detailProspect?.calendly_booking?.cancel_url);
  const hasDetails = Boolean(
    detailProspect?.lead_submission ||
      detailProspect?.audit_request ||
      detailProspect?.calendly_booking,
  );
  const primaryPhone =
    detailProspect?.lead_submission?.phone_number || detailProspect?.audit_request?.phone_number;
  const primaryWebsite =
    detailProspect?.lead_submission?.current_website || detailProspect?.audit_request?.website_url;
  const primaryWebsiteHref = safeExternalHref(primaryWebsite);
  const leadSubmission = detailProspect?.lead_submission;
  const auditRequest = detailProspect?.audit_request;
  const calendlyBooking = detailProspect?.calendly_booking;
  const improvementItems = normalizeList(leadSubmission?.improvements);
  const focusAreaItems = normalizeList(auditRequest?.specifics);
  const prospectTypeLabel = getProspectTypeLabel(prospect?.source);
  const submittedAt =
    leadSubmission?.submitted_at || auditRequest?.submitted_at || calendlyBooking?.booked_at;
  const drawerTitle = prospect ? (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--pv-primary)]">
        Prospect
      </p>
      <p className="mt-1 truncate font-heading text-xl font-semibold text-[var(--pv-text)]">
        {prospectTypeLabel}
      </p>
    </div>
  ) : null;

  return (
    <Drawer
      opened={open && Boolean(prospect)}
      onClose={onClose}
      position="right"
      size="lg"
      title={drawerTitle}
      transitionProps={{ transition: 'slide-left', duration: 260, timingFunction: 'ease-out' }}
    >
      {prospect && (
        <>
          {/* Header */}
          <div className="space-y-5 border-b border-[var(--pv-border)] pb-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate font-heading text-lg font-semibold text-[var(--pv-text)]">
                  {prospect.name}
                </p>
                <a
                  href={`mailto:${prospect.email}`}
                  className="mt-1.5 flex min-w-0 items-center gap-2 text-sm text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-primary)]"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{prospect.email}</span>
                </a>
                {primaryPhone && (
                  <a
                    href={`tel:${primaryPhone}`}
                    className="mt-1.5 flex min-w-0 items-center gap-2 text-sm text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-primary)]"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{formatPhone(primaryPhone)}</span>
                  </a>
                )}
              </div>
              <StatusSelector
                current={prospect.status}
                prospectId={prospect.id}
                onUpdate={(newStatus) => onStatusUpdate(prospect.id, newStatus)}
              />
            </div>

            {primaryWebsite && primaryWebsiteHref && (
              <a
                href={primaryWebsiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-w-0 items-center gap-2 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] px-3 py-2.5 text-sm text-[var(--pv-text)] transition-colors hover:border-[var(--pv-primary)]"
              >
                <Globe2 className="h-4 w-4 shrink-0 text-[var(--pv-primary)]" />
                <span className="truncate">{primaryWebsite}</span>
                <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-[var(--pv-text-muted)] transition-colors group-hover:text-[var(--pv-primary)]" />
              </a>
            )}

            <div className="rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--pv-text-muted)]">
                    First seen
                  </p>
                  <p className="flex items-center gap-1.5 text-sm text-[var(--pv-text)]">
                    <Clock className="h-3.5 w-3.5 text-[var(--pv-text-muted)]" />
                    {formatRelative(prospect.first_seen)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--pv-text-muted)]">
                    Last activity
                  </p>
                  <p className="flex items-center gap-1.5 text-sm text-[var(--pv-text)]">
                    <Clock className="h-3.5 w-3.5 text-[var(--pv-text-muted)]" />
                    {formatRelative(prospect.last_activity)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--pv-text-muted)]">
                    Submitted
                  </p>
                  <p className="flex items-center gap-1.5 text-sm text-[var(--pv-text)]">
                    <Clock className="h-3.5 w-3.5 text-[var(--pv-text-muted)]" />
                    {formatRelative(submittedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-6 py-6">
          {loading && <ProspectDetailSkeleton />}

          {error && !loading && (
            <Section icon={AlertCircle} title="Details Unavailable">
              <p className="text-sm leading-6 text-[var(--pv-text-muted)]">
                The prospect record loaded, but the full submission details could not be fetched.
              </p>
            </Section>
          )}

          {!loading && !error && !hasDetails && (
            <Section icon={Inbox} title="Submission Details">
              <p className="text-sm leading-6 text-[var(--pv-text-muted)]">
                No submission details were returned for this prospect yet.
              </p>
            </Section>
          )}

          {/* Lead submission */}
          {!loading && leadSubmission && (
            <Section icon={FileText} title="Project Inquiry">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <DetailItem label="Company">
                  {leadSubmission.company_name}
                </DetailItem>
                {leadSubmission.current_website && (
                  <DetailItem label="Website">
                    {leadWebsiteHref ? (
                      <a
                        href={leadWebsiteHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-full items-center gap-1 text-sm text-[var(--pv-primary)] underline underline-offset-2"
                      >
                        <span className="truncate">{leadSubmission.current_website}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    ) : (
                      leadSubmission.current_website
                    )}
                  </DetailItem>
                )}
                <DetailItem label="Interested In">
                  {leadSubmission.interested_in}
                </DetailItem>
                <DetailItem label="Budget">{leadSubmission.budget}</DetailItem>
                <DetailItem label="Timeline">{leadSubmission.timeline}</DetailItem>
                <DetailItem label="Promo Code">{leadSubmission.promo_code}</DetailItem>
                {improvementItems.length > 0 && (
                  <div className="sm:col-span-2">
                    <DetailItem label="Improvements">
                      <FocusAreaList values={improvementItems} />
                    </DetailItem>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <DetailItem label="Summary">{leadSubmission.brief_summary}</DetailItem>
                </div>
              </div>
            </Section>
          )}

          {/* Audit request */}
          {!loading && auditRequest && (
            <Section icon={Search} title="Website Review Request">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <DetailItem label="Website URL">
                    {auditWebsiteHref ? (
                      <a
                        href={auditWebsiteHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-full items-center gap-1 text-sm text-[var(--pv-primary)] underline underline-offset-2"
                      >
                        <span className="truncate">{auditRequest.website_url}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    ) : (
                      auditRequest.website_url
                    )}
                  </DetailItem>
                </div>
                {focusAreaItems.length > 0 && (
                  <div className="sm:col-span-2">
                    <DetailItem label="Focus Areas">
                      <FocusAreaList values={focusAreaItems} />
                    </DetailItem>
                  </div>
                )}
                {auditRequest.other_detail && (
                  <div className="sm:col-span-2">
                    <DetailItem label="Other Detail">
                      {auditRequest.other_detail}
                    </DetailItem>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Calendly booking */}
          {!loading && calendlyBooking && (
            <Section icon={Calendar} title="Strategy Call">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                {calendlyBooking.event_name && (
                  <div className="sm:col-span-2">
                    <DetailItem label="Event">{calendlyBooking.event_name}</DetailItem>
                  </div>
                )}
                {calendlyBooking.start_time && (
                  <div className="sm:col-span-2">
                    <DetailItem label="Scheduled For">
                      {formatDate(calendlyBooking.start_time)}
                    </DetailItem>
                  </div>
                )}
                {(cancelHref || rescheduleHref) && (
                  <div className="flex flex-wrap gap-2 sm:col-span-2">
                    {rescheduleHref && (
                      <a
                        href={rescheduleHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-lg border border-[var(--pv-border)] px-3 py-1.5 text-xs font-medium text-[var(--pv-text)] transition-colors hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)]"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Reschedule
                      </a>
                    )}
                    {cancelHref && (
                      <a
                        href={cancelHref}
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
          {!loading && (
            <NotesField
              prospectId={prospect.id}
              initialNotes={detailProspect?.notes ?? prospect.notes ?? ''}
            />
          )}
        </div>
        </>
      )}
    </Drawer>
  );
}

function ProspectDetailSkeleton() {
  return (
    <div className="space-y-6">
      {[0, 1].map((section) => (
        <div key={section} className="space-y-3">
          <div className="h-4 w-36 animate-pulse rounded bg-[var(--pv-border)]" />
          <div className="rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: section === 0 ? 5 : 3 }).map((_, index) => (
                <div key={index} className={index === 4 ? 'sm:col-span-2' : undefined}>
                  <div className="mb-2 h-3 w-20 animate-pulse rounded bg-[var(--pv-border)]" />
                  <div className="h-4 w-full animate-pulse rounded bg-[var(--pv-border)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
