'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import {
  ClientsToolbar,
  type ViewMode,
  type PhaseFilter,
  type TypeFilter,
  getSavedViewMode,
  saveViewMode,
} from './clients-toolbar';
import { ClientsTable } from './clients-table';
import { CRMKanbanBoard } from './crm-kanban-board';
import { ClientsEmptyState } from './clients-empty-state';
import { Pagination } from './pagination';
import type { ClientListItem, Client } from '@/lib/types/client';
import type { Project, ProjectStatus } from '@/lib/types/project';
import { STATUS_PHASES } from '@/lib/types/project';

// Phase filter to status mapping
const PHASE_STATUSES: Record<Exclude<PhaseFilter, 'all'>, ProjectStatus[]> = {
  sales: STATUS_PHASES.sales,
  project: STATUS_PHASES.project,
  'post-launch': STATUS_PHASES.postLaunch,
};

interface ClientsPageClientProps {
  // For table view (paginated list)
  clientListItems: ClientListItem[];
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  // For board view (full client data)
  clients: Client[];
  projects: Project[];
}

export function ClientsPageClient({
  clientListItems,
  currentPage,
  totalPages,
  total,
  limit,
  clients,
  projects,
}: ClientsPageClientProps) {
  const router = useRouter();

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [isHydrated, setIsHydrated] = useState(false);

  // Load view preference from localStorage after hydration
  useEffect(() => {
    setViewMode(getSavedViewMode());
    setIsHydrated(true);
  }, []);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    saveViewMode(mode);
  };

  // Filter projects for board view
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((p) => p.type === typeFilter);
    }

    // Phase filter
    if (phaseFilter !== 'all') {
      const allowedStatuses = PHASE_STATUSES[phaseFilter];
      filtered = filtered.filter((p) => allowedStatuses.includes(p.status));
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => {
        const title = p.title.toLowerCase();
        const domain = 'domain' in p ? p.domain?.toLowerCase() : '';
        return title.includes(query) || (domain && domain.includes(query));
      });
    }

    return filtered;
  }, [projects, typeFilter, phaseFilter, searchQuery]);

  // Filter clients for board view - show clients with matching projects or matching search
  const filteredClients = useMemo(() => {
    const clientIdsWithProjects = new Set(filteredProjects.map((p) => p.client_id));

    return clients.filter((c) => {
      // Always show if has matching projects
      if (clientIdsWithProjects.has(c.id)) return true;

      // Also show if client name/contact matches search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const clientName = c.client.toLowerCase();
        const firstName = c.firstname?.toLowerCase() || '';
        const lastName = c.lastname?.toLowerCase() || '';
        return (
          clientName.includes(query) || firstName.includes(query) || lastName.includes(query)
        );
      }

      // When no search and no projects match filters, hide client
      return false;
    });
  }, [clients, filteredProjects, searchQuery]);

  // Visible columns based on phase filter (for board view)
  const visibleColumns = phaseFilter === 'all' ? undefined : PHASE_STATUSES[phaseFilter];

  // Calculate active count for display
  const activeCount = clientListItems.filter((c) => c.client_active === true).length;

  // Prevent hydration mismatch by not rendering view-dependent content until hydrated
  if (!isHydrated) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h1
                className="font-heading text-2xl font-bold md:text-3xl"
                style={{ color: 'var(--pv-text)' }}
              >
                Clients
              </h1>
              <p className="text-sm" style={{ color: 'var(--pv-text-muted)' }}>
                Loading...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              background:
                'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h1
              className="font-heading text-2xl font-bold md:text-3xl"
              style={{ color: 'var(--pv-text)' }}
            >
              Clients
            </h1>
            <p className="text-sm" style={{ color: 'var(--pv-text-muted)' }}>
              {viewMode === 'table' ? (
                <>
                  {total} total &middot; {activeCount} active on this page
                </>
              ) : (
                <>
                  {filteredClients.length} clients &middot; {filteredProjects.length} projects
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <ClientsToolbar
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        phaseFilter={phaseFilter}
        onPhaseFilterChange={setPhaseFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      {/* Content */}
      {viewMode === 'table' ? (
        <>
          {/* Table View - uses existing ClientsTable with its own search/filter */}
          <ClientsTable clients={clientListItems} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            limit={limit}
          />
        </>
      ) : (
        <>
          {/* Board View */}
          {filteredClients.length === 0 ? (
            <ClientsEmptyState />
          ) : (
            <CRMKanbanBoard
              initialClients={filteredClients}
              initialProjects={filteredProjects}
              visibleColumns={visibleColumns}
              onAddProject={(clientId) => {
                // Navigate to client detail page to add project
                router.push(`/dashboard/clients/${clientId}`);
              }}
              onEditProject={(project) => {
                // Navigate to project detail page
                const projectType = project.type === 'website' ? 'websites' : 'apps';
                router.push(`/dashboard/clients/${project.client_id}/${projectType}/${project.id}`);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
