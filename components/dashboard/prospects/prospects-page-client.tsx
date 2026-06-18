'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Users } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/api-config';
import { ProspectsStatsBar } from './prospects-stats-bar';
import { ProspectsTable, type SourceFilter, type StatusFilter } from './prospects-table';
import { ProspectDetailDrawer } from './prospect-detail-drawer';
import type { Prospect, ProspectStats, ProspectsListResponse, ProspectStatus } from './types';

const PAGE_SIZE = 25;
const API_PAGE_SIZE = 100;

export function ProspectsPageClient() {
  // ── Data state ──────────────────────────────────────────────────────────────
  const [stats, setStats] = useState<ProspectStats | null>(null);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [total, setTotal] = useState(0);

  // ── Loading / error ─────────────────────────────────────────────────────────
  const [statsLoading, setStatsLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);
  const [tableError, setTableError] = useState(false);

  // ── Filters / pagination ────────────────────────────────────────────────────
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);

  // ── Detail drawer ───────────────────────────────────────────────────────────
  const [selectedProspectSummary, setSelectedProspectSummary] = useState<Prospect | null>(null);
  const [selectedProspectDetail, setSelectedProspectDetail] = useState<Prospect | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(false);
  const listRequestRef = useRef(0);
  const detailRequestRef = useRef<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Fetch stats ─────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(false);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/prospects/stats`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ProspectStats = await res.json();
      setStats(data);
    } catch {
      setStatsError(true);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ── Fetch prospects list ────────────────────────────────────────────────────
  const fetchProspects = useCallback(async () => {
    const requestId = listRequestRef.current + 1;
    listRequestRef.current = requestId;
    setTableLoading(true);
    setTableError(false);
    try {
      const allProspects: Prospect[] = [];
      let offset = 0;
      let apiTotal = 0;

      do {
        const params = new URLSearchParams({
          offset: String(offset),
          limit: String(API_PAGE_SIZE),
        });
        if (sourceFilter !== 'all') params.set('source', sourceFilter);
        if (statusFilter !== 'all') params.set('status', statusFilter);

        const res = await fetch(`${getApiBaseUrl()}/api/prospects?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ProspectsListResponse = await res.json();
        if (listRequestRef.current !== requestId) return;
        allProspects.push(...data.prospects);
        apiTotal = data.total;
        offset += data.prospects.length;
        if (data.prospects.length === 0) break;
      } while (offset < apiTotal);

      const visibleProspects = allProspects
        .map(normalizeProspect)
        .filter((prospect) => !isTestProspect(prospect));
      const visibleTotalPages = Math.max(1, Math.ceil(visibleProspects.length / PAGE_SIZE));
      const safePage = Math.min(page, visibleTotalPages);
      const start = (safePage - 1) * PAGE_SIZE;

      if (safePage !== page) {
        setPage(safePage);
      }

      if (listRequestRef.current !== requestId) return;
      setProspects(visibleProspects.slice(start, start + PAGE_SIZE));
      setTotal(visibleProspects.length);
    } catch {
      if (listRequestRef.current !== requestId) return;
      setTableError(true);
      setProspects([]);
      setTotal(0);
    } finally {
      if (listRequestRef.current === requestId) {
        setTableLoading(false);
      }
    }
  }, [page, sourceFilter, statusFilter]);

  // ── Fetch full detail ────────────────────────────────────────────────────────
  const fetchDetail = useCallback(async (id: string) => {
    detailRequestRef.current = id;
    setDetailLoading(true);
    setDetailError(false);
    setSelectedProspectDetail(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/prospects/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Prospect = await res.json();
      if (detailRequestRef.current !== id) return;
      setSelectedProspectDetail(normalizeProspect(data));
    } catch {
      if (detailRequestRef.current !== id) return;
      // Keep the existing row data if detail fetch fails
      setDetailError(true);
    } finally {
      if (detailRequestRef.current === id) {
        setDetailLoading(false);
      }
    }
  }, []);

  // ── Initial load ────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchProspects();
  }, [fetchProspects]);

  // ── Reset page on filter change ─────────────────────────────────────────────
  const handleSourceChange = useCallback((v: SourceFilter) => {
    setSourceFilter(v);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((v: StatusFilter) => {
    setStatusFilter(v);
    setPage(1);
  }, []);

  // ── Open drawer with row data; then load full detail ────────────────────────
  const handleSelectProspect = useCallback((prospect: Prospect) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setSelectedProspectSummary(prospect);
    setSelectedProspectDetail(null);
    setDrawerOpen(true);
    setDetailLoading(true);
    setDetailError(false);
    fetchDetail(prospect.id);
  }, [fetchDetail]);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    detailRequestRef.current = null;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setSelectedProspectSummary(null);
      setSelectedProspectDetail(null);
      setDetailLoading(false);
      setDetailError(false);
      closeTimeoutRef.current = null;
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // ── Optimistic status update ─────────────────────────────────────────────────
  const handleStatusUpdate = useCallback((id: string, newStatus: ProspectStatus) => {
    const noLongerMatchesStatusFilter = statusFilter !== 'all' && newStatus !== statusFilter;

    setProspects((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        .filter((p) => !noLongerMatchesStatusFilter || p.id !== id),
    );
    if (noLongerMatchesStatusFilter) {
      setTotal((prev) => Math.max(0, prev - 1));
    }
    if (selectedProspectSummary?.id === id) {
      setSelectedProspectSummary((prev) => (prev ? { ...prev, status: newStatus } : prev));
      setSelectedProspectDetail((prev) => (prev ? { ...prev, status: newStatus } : prev));
    }
    // Refresh stats to reflect new status distribution
    fetchStats();
    fetchProspects();
  }, [fetchProspects, fetchStats, selectedProspectSummary?.id, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: 'linear-gradient(135deg, var(--pv-primary)15, var(--pv-primary)08)',
                border: '1px solid var(--pv-primary)20',
              }}
            >
              <Users className="h-5 w-5" style={{ color: 'var(--pv-primary)' }} />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-[var(--pv-text)]">Prospects</h1>
              <p className="text-sm text-[var(--pv-text-muted)]">
                Inbound leads from contact forms and Calendly
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <ProspectsStatsBar stats={stats} loading={statsLoading} error={statsError} />

      {/* Error state for table */}
      {tableError && !tableLoading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
          Failed to load prospects. The backend API may be unavailable.
        </div>
      )}

      {/* Table */}
      {!tableError && (
        <ProspectsTable
          prospects={prospects}
          total={total}
          page={page}
          totalPages={totalPages}
          loading={tableLoading}
          sourceFilter={sourceFilter}
          statusFilter={statusFilter}
          onSourceChange={handleSourceChange}
          onStatusChange={handleStatusChange}
          onPageChange={setPage}
          onSelectProspect={handleSelectProspect}
        />
      )}

      {/* Detail drawer */}
      <ProspectDetailDrawer
        prospect={selectedProspectSummary}
        detail={selectedProspectDetail}
        open={drawerOpen}
        loading={detailLoading}
        error={detailError}
        onClose={handleCloseDrawer}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}

function isTestProspect(prospect: Prospect) {
  const name = prospect.name.toLowerCase();
  const email = prospect.email.toLowerCase();
  const [localPart = '', domain = ''] = email.split('@');

  return (
    name.includes('codex smoke') ||
    localPart.includes('codex-smoke') ||
    localPart === 'test' ||
    localPart.startsWith('test+') ||
    domain === 'example.com' ||
    domain === 'test.com'
  );
}

function normalizeProspect(prospect: Prospect): Prospect {
  const leadSubmission = normalizeLeadSubmission(
    prospect.lead_submission ?? prospect.lead_submissions?.[0],
  );
  const auditRequest = normalizeAuditRequest(
    prospect.audit_request ?? prospect.audit_requests?.[0],
  );
  const calendlyBooking = normalizeCalendlyBooking(
    prospect.calendly_booking ?? prospect.calendly_bookings?.[0],
  );

  return {
    ...prospect,
    first_seen: prospect.first_seen ?? prospect.created_at,
    last_activity: prospect.last_activity ?? prospect.updated_at,
    lead_submission: leadSubmission,
    audit_request: auditRequest,
    calendly_booking: calendlyBooking,
  };
}

function normalizeLeadSubmission(submission?: Prospect['lead_submission']): Prospect['lead_submission'] {
  if (!submission) return undefined;
  return {
    ...submission,
    phone_number: submission.phone_number ?? submission.phone,
    submitted_at: submission.submitted_at ?? submission.created_at,
  };
}

function normalizeAuditRequest(request?: Prospect['audit_request']): Prospect['audit_request'] {
  if (!request) return undefined;
  return {
    ...request,
    submitted_at: request.submitted_at ?? request.created_at,
  };
}

function normalizeCalendlyBooking(booking?: Prospect['calendly_booking']): Prospect['calendly_booking'] {
  if (!booking) return undefined;
  return {
    ...booking,
    event_uri: booking.event_uri ?? booking.calendly_event_uri,
    invitee_uri: booking.invitee_uri ?? booking.calendly_invitee_uri,
    event_name: booking.event_name ?? booking.event_type_name,
    start_time: booking.start_time ?? booking.event_start_at,
    booked_at: booking.booked_at ?? booking.created_at,
  };
}
