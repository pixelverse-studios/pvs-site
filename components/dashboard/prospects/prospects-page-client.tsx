'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/api-config';
import { ProspectsStatsBar } from './prospects-stats-bar';
import { ProspectsTable, type SourceFilter, type StatusFilter } from './prospects-table';
import { ProspectDetailDrawer } from './prospect-detail-drawer';
import type { Prospect, ProspectStats, ProspectsListResponse, ProspectStatus } from './types';

const PAGE_SIZE = 25;

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
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    setTableLoading(true);
    setTableError(false);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });
      if (sourceFilter !== 'all') params.set('source', sourceFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`${getApiBaseUrl()}/api/prospects?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ProspectsListResponse = await res.json();
      setProspects(data.prospects);
      setTotal(data.total);
    } catch {
      setTableError(true);
      setProspects([]);
      setTotal(0);
    } finally {
      setTableLoading(false);
    }
  }, [page, sourceFilter, statusFilter]);

  // ── Fetch full detail ────────────────────────────────────────────────────────
  const fetchDetail = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/prospects/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Prospect = await res.json();
      setSelectedProspect(data);
    } catch {
      // Keep the existing row data if detail fetch fails
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
    setSelectedProspect(prospect);
    setDrawerOpen(true);
    fetchDetail(prospect.id);
  }, [fetchDetail]);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedProspect(null), 300);
  }, []);

  // ── Optimistic status update ─────────────────────────────────────────────────
  const handleStatusUpdate = useCallback((id: string, newStatus: ProspectStatus) => {
    setProspects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
    );
    if (selectedProspect?.id === id) {
      setSelectedProspect((prev) => (prev ? { ...prev, status: newStatus } : prev));
    }
    // Refresh stats to reflect new status distribution
    fetchStats();
  }, [fetchStats, selectedProspect?.id]);

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
        prospect={selectedProspect}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
