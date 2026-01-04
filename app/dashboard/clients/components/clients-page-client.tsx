'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
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
import { PipelineKanbanBoard } from './pipeline-kanban-board';
import { PipelineListView } from './pipeline-list-view';
import { ClientsEmptyState } from './clients-empty-state';
import { Pagination } from './pagination';
import type { ClientListItem, Client } from '@/lib/types/client';
import type { Project, ProjectStatus } from '@/lib/types/project';
import { STATUS_PHASES } from '@/lib/types/project';
import { updateProjectStatus } from '@/lib/api/projects';

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
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
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

  const handlePhaseFilterChange = (phase: PhaseFilter) => {
    setPhaseFilter(phase);
  };

  // Determine which board component to show:
  // - "All Phases" = grouped list view (15 statuses too many for kanban)
  // - Specific phase = kanban board (4-6 columns, manageable)
  const showKanban = viewMode === 'board' && phaseFilter !== 'all';

  // Local projects state for optimistic updates in list view
  const [localProjects, setLocalProjects] = useState<Project[]>(projects);

  // Sync local projects with props when props change
  useEffect(() => {
    setLocalProjects(projects);
  }, [projects]);

  // Handle status change for list view (optimistic update + API call)
  const handleListStatusChange = useCallback(
    async (projectId: string, projectType: 'website' | 'app', newStatus: ProjectStatus) => {
      const project = localProjects.find((p) => p.id === projectId);
      if (!project || project.status === newStatus) return;

      // Optimistic update
      setLocalProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p)),
      );

      // API call
      try {
        await updateProjectStatus(projectId, projectType, newStatus);
        // Refresh to get server state
        router.refresh();
      } catch (error) {
        console.error('Failed to update project status:', error);
        // Revert on error
        setLocalProjects(projects);
      }
    },
    [localProjects, projects, router],
  );

  // Filter projects for board view (use localProjects for optimistic updates in list view)
  const filteredProjects = useMemo(() => {
    let filtered = localProjects;

    // Client filter
    if (selectedClientIds.length > 0) {
      filtered = filtered.filter((p) => selectedClientIds.includes(p.client_id));
    }

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
        // Also search by client name
        const client = clients.find((c) => c.id === p.client_id);
        const clientName = client
          ? `${client.firstname || ''} ${client.lastname || ''} ${client.client || ''}`.toLowerCase()
          : '';
        return (
          title.includes(query) || (domain && domain.includes(query)) || clientName.includes(query)
        );
      });
    }

    return filtered;
  }, [localProjects, selectedClientIds, typeFilter, phaseFilter, searchQuery, clients]);

  // Visible statuses based on phase filter (for board view)
  const visibleStatuses = phaseFilter === 'all' ? undefined : PHASE_STATUSES[phaseFilter];

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
                  {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}{' '}
                  {selectedClientIds.length > 0 && (
                    <>
                      from {selectedClientIds.length} client
                      {selectedClientIds.length !== 1 ? 's' : ''}
                    </>
                  )}
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
        onPhaseFilterChange={handlePhaseFilterChange}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        clients={clients}
        selectedClientIds={selectedClientIds}
        onClientFilterChange={setSelectedClientIds}
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
      ) : projects.length === 0 ? (
        <ClientsEmptyState />
      ) : showKanban ? (
        <>
          {/* Kanban View - for specific phase (4-6 columns) */}
          <PipelineKanbanBoard
            projects={filteredProjects}
            clients={clients}
            visibleStatuses={visibleStatuses}
            onEditProject={(project) => {
              router.push(`/dashboard/clients/${project.client_id}`);
            }}
          />
        </>
      ) : (
        <>
          {/* Grouped List View - for "All Phases" (15 statuses) */}
          <PipelineListView
            projects={filteredProjects}
            clients={clients}
            visibleStatuses={visibleStatuses}
            onEditProject={(project) => {
              router.push(`/dashboard/clients/${project.client_id}`);
            }}
            onStatusChange={handleListStatusChange}
          />
        </>
      )}
    </div>
  );
}
