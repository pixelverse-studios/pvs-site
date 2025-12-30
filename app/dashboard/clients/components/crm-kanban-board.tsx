'use client';

import { useState, useMemo, useCallback } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import {
  UserPlus,
  Search,
  FileText,
  MessageSquare,
  Trophy,
  Lightbulb,
  Code2,
  Eye,
  Bug,
  Server,
  Rocket,
  Wrench,
  Pause,
  Archive,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClientSwimlane } from './client-swimlane';
import { updateProjectStatus, reorderProjects } from '@/lib/api/projects';
import type { Client } from '@/lib/types/client';
import type { Project, ProjectStatus } from '@/lib/types/project';

// Column configuration with icons and colors
interface ColumnConfig {
  status: ProjectStatus;
  title: string;
  icon: LucideIcon;
  color: string;
}

const COLUMNS: ColumnConfig[] = [
  // Sales Phase
  { status: 'lead', title: 'Lead', icon: UserPlus, color: 'text-amber-500' },
  { status: 'discovery', title: 'Discovery', icon: Search, color: 'text-orange-500' },
  { status: 'proposal', title: 'Proposal', icon: FileText, color: 'text-yellow-500' },
  { status: 'negotiation', title: 'Negotiation', icon: MessageSquare, color: 'text-amber-600' },
  { status: 'won', title: 'Won', icon: Trophy, color: 'text-green-500' },
  { status: 'lost', title: 'Lost', icon: XCircle, color: 'text-gray-400' },
  // Project Phase
  { status: 'planning', title: 'Planning', icon: Lightbulb, color: 'text-blue-500' },
  { status: 'development', title: 'Development', icon: Code2, color: 'text-indigo-500' },
  { status: 'review', title: 'Review', icon: Eye, color: 'text-purple-500' },
  { status: 'qa', title: 'QA', icon: Bug, color: 'text-pink-500' },
  { status: 'staging', title: 'Staging', icon: Server, color: 'text-cyan-500' },
  { status: 'deployed', title: 'Deployed', icon: Rocket, color: 'text-emerald-500' },
  // Post-Launch
  { status: 'maintenance', title: 'Maintenance', icon: Wrench, color: 'text-teal-500' },
  { status: 'on_hold', title: 'On Hold', icon: Pause, color: 'text-yellow-600' },
  { status: 'archived', title: 'Archived', icon: Archive, color: 'text-gray-400' },
];

interface CRMKanbanBoardProps {
  initialClients: Client[];
  initialProjects: Project[];
  visibleColumns?: ProjectStatus[];
  onAddProject?: (clientId: string) => void;
  onEditProject?: (project: Project) => void;
}

export function CRMKanbanBoard({
  initialClients,
  initialProjects,
  visibleColumns,
  onAddProject,
  onEditProject,
}: CRMKanbanBoardProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [collapsedClients, setCollapsedClients] = useState<Set<string>>(new Set());

  // Filter columns if specified
  const columns = useMemo(
    () => (visibleColumns ? COLUMNS.filter((c) => visibleColumns.includes(c.status)) : COLUMNS),
    [visibleColumns]
  );

  // Count projects per status (for column headers)
  const statusCounts = useMemo(() => {
    const counts: Partial<Record<ProjectStatus, number>> = {};
    columns.forEach((c) => (counts[c.status] = 0));
    projects.forEach((p) => {
      if (counts[p.status] !== undefined) counts[p.status]!++;
    });
    return counts;
  }, [projects, columns]);

  // Group projects by client
  const projectsByClient = useMemo(() => {
    const groups: Record<string, Project[]> = {};
    initialClients.forEach((c) => (groups[c.id] = []));
    projects.forEach((p) => {
      if (groups[p.client_id]) groups[p.client_id].push(p);
    });
    return groups;
  }, [projects, initialClients]);

  // Handle drag end - optimistic update with rollback
  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;
      if (!destination) return;

      // Parse droppable IDs: "{clientId}-{status}"
      // Note: clientId is a UUID which contains hyphens, so we need to extract status from the end
      const sourceDroppableId = source.droppableId;
      const destDroppableId = destination.droppableId;

      // Extract status (last segment after the final hyphen that matches a status)
      const extractClientAndStatus = (droppableId: string) => {
        // Find which status the droppableId ends with
        for (const col of COLUMNS) {
          if (droppableId.endsWith(`-${col.status}`)) {
            const clientId = droppableId.slice(0, -(col.status.length + 1));
            return { clientId, status: col.status };
          }
        }
        return null;
      };

      const sourceParsed = extractClientAndStatus(sourceDroppableId);
      const destParsed = extractClientAndStatus(destDroppableId);

      if (!sourceParsed || !destParsed) return;

      const { clientId: sourceClientId, status: sourceStatus } = sourceParsed;
      const { clientId: destClientId, status: destStatus } = destParsed;

      // Only allow drops within same client (no cross-client moves)
      if (sourceClientId !== destClientId) return;

      // No-op if same position
      if (sourceStatus === destStatus && source.index === destination.index) return;

      // Optimistic update
      setProjects((prevProjects) => {
        const newProjects = prevProjects.map((p) => ({ ...p }));
        const draggedProject = newProjects.find((p) => p.id === draggableId);
        if (!draggedProject) return prevProjects;

        // Update status if changed
        if (sourceStatus !== destStatus) {
          draggedProject.status = destStatus;
        }

        // Recalculate priorities in destination column
        const destGroup = newProjects
          .filter(
            (p) => p.client_id === destClientId && p.status === destStatus && p.id !== draggableId
          )
          .sort((a, b) => a.priority - b.priority);

        destGroup.splice(destination.index, 0, draggedProject);
        destGroup.forEach((p, idx) => (p.priority = idx));

        return newProjects;
      });

      // API calls (fire and forget with error handling)
      try {
        const draggedProject = projects.find((p) => p.id === draggableId);
        if (!draggedProject) return;

        if (sourceStatus !== destStatus) {
          await updateProjectStatus(draggableId, draggedProject.type, destStatus);
        }

        // Get updated priorities for reorder
        const updatedProjects = projects
          .filter((p) => p.client_id === destClientId && p.status === destStatus)
          .sort((a, b) => a.priority - b.priority);

        if (updatedProjects.length > 0) {
          await reorderProjects(
            updatedProjects.map((p, idx) => ({
              id: p.id,
              type: p.type,
              priority: idx,
            }))
          );
        }
      } catch (error) {
        console.error('Failed to update project:', error);
        // Revert on error
        setProjects(initialProjects);
      }
    },
    [projects, initialProjects]
  );

  // Toggle client collapse state
  const handleToggleCollapse = useCallback((clientId: string) => {
    setCollapsedClients((prev) => {
      const next = new Set(prev);
      if (next.has(clientId)) {
        next.delete(clientId);
      } else {
        next.add(clientId);
      }
      return next;
    });
  }, []);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col">
        {/* Column Headers - Sticky */}
        <div
          className="sticky top-0 z-10 border-b"
          style={{
            background: 'var(--pv-bg)',
            borderColor: 'var(--pv-border)',
          }}
        >
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))`,
            }}
          >
            {columns.map(({ status, title, icon: Icon, color }) => (
              <div
                key={status}
                className="border-r p-3 text-center last:border-r-0"
                style={{ borderColor: 'var(--pv-border)' }}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Icon className={cn('h-4 w-4', color)} />
                  <span className="text-sm font-medium text-[var(--pv-text)]">{title}</span>
                </div>
                <span className="mt-0.5 block text-xs text-[var(--pv-text-muted)]">
                  ({statusCounts[status] || 0})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Swimlanes */}
        <div className="space-y-4 p-4">
          {initialClients.length === 0 ? (
            <div className="py-12 text-center text-[var(--pv-text-muted)]">
              <p>No clients to display</p>
            </div>
          ) : (
            initialClients.map((client) => (
              <ClientSwimlane
                key={client.id}
                client={client}
                projects={projectsByClient[client.id] || []}
                columns={columns.map((c) => ({ status: c.status, title: c.title }))}
                isCollapsed={collapsedClients.has(client.id)}
                onToggleCollapse={() => handleToggleCollapse(client.id)}
                onAddProject={onAddProject}
                onEditProject={onEditProject}
              />
            ))
          )}
        </div>
      </div>
    </DragDropContext>
  );
}

// Export column config for use by parent components
export { COLUMNS };
export type { ColumnConfig };
