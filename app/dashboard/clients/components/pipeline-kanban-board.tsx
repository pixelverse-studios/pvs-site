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
import { PipelineColumn } from './pipeline-column';
import { updateProjectStatus } from '@/lib/api/projects';
import type { Client } from '@/lib/types/client';
import type { Project, ProjectStatus } from '@/lib/types/project';

// Column configuration with icons and colors
interface ColumnConfig {
  status: ProjectStatus;
  title: string;
  icon: LucideIcon;
  color: string;
}

const ALL_COLUMNS: ColumnConfig[] = [
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

// Phase groupings for smart column visibility
const PHASE_GROUPS = {
  sales: ['lead', 'discovery', 'proposal', 'negotiation', 'won', 'lost'] as ProjectStatus[],
  project: ['planning', 'development', 'review', 'qa', 'staging', 'deployed'] as ProjectStatus[],
  postLaunch: ['maintenance', 'on_hold', 'archived'] as ProjectStatus[],
};

interface PipelineKanbanBoardProps {
  projects: Project[];
  clients: Client[];
  visibleStatuses?: ProjectStatus[];
  onEditProject?: (project: Project) => void;
}

export function PipelineKanbanBoard({
  projects: initialProjects,
  clients,
  visibleStatuses,
  onEditProject,
}: PipelineKanbanBoardProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  // Determine which columns to show
  // Show all columns within phases that have projects, plus explicitly filtered statuses
  const columns = useMemo(() => {
    // If visibleStatuses is provided (phase filter active), show all columns in that filter
    if (visibleStatuses) {
      return ALL_COLUMNS.filter((c) => visibleStatuses.includes(c.status));
    }

    // Otherwise, show columns from phases that have at least one project
    const populatedStatuses = new Set(projects.map((p) => p.status));

    // Find which phases have projects
    const activePhases = new Set<string>();
    for (const [phase, statuses] of Object.entries(PHASE_GROUPS)) {
      if (statuses.some((s) => populatedStatuses.has(s))) {
        activePhases.add(phase);
      }
    }

    // If no projects, show the project phase columns as default
    if (activePhases.size === 0) {
      return ALL_COLUMNS.filter((c) => PHASE_GROUPS.project.includes(c.status));
    }

    // Show all columns from active phases
    return ALL_COLUMNS.filter((c) => {
      for (const [phase, statuses] of Object.entries(PHASE_GROUPS)) {
        if (activePhases.has(phase) && statuses.includes(c.status)) {
          return true;
        }
      }
      return false;
    });
  }, [visibleStatuses, projects]);

  // Group projects by status
  const projectsByStatus = useMemo(() => {
    const groups: Record<ProjectStatus, Project[]> = {} as Record<ProjectStatus, Project[]>;

    // Initialize all column statuses with empty arrays
    columns.forEach((col) => {
      groups[col.status] = [];
    });

    // Assign projects to their status groups
    projects.forEach((project) => {
      if (groups[project.status]) {
        groups[project.status].push(project);
      }
    });

    // Sort by priority within each group
    Object.values(groups).forEach((group) => {
      group.sort((a, b) => a.priority - b.priority);
    });

    return groups;
  }, [projects, columns]);

  // Handle status change from dropdown
  const handleStatusChange = useCallback(
    async (projectId: string, projectType: 'website' | 'app', newStatus: ProjectStatus) => {
      const project = projects.find((p) => p.id === projectId);
      if (!project || project.status === newStatus) return;

      // Optimistic update
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p)),
      );

      // API call
      try {
        await updateProjectStatus(projectId, projectType, newStatus);
      } catch (error) {
        console.error('Failed to update project status:', error);
        // Revert on error
        setProjects(initialProjects);
      }
    },
    [projects, initialProjects],
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;

      if (!destination) return;
      if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return;
      }

      const sourceStatus = source.droppableId as ProjectStatus;
      const destStatus = destination.droppableId as ProjectStatus;

      // Optimistic update
      setProjects((prev) => {
        const newProjects = [...prev];
        const projectIndex = newProjects.findIndex((p) => p.id === draggableId);

        if (projectIndex === -1) return prev;

        // Update the project's status
        newProjects[projectIndex] = {
          ...newProjects[projectIndex],
          status: destStatus,
        };

        return newProjects;
      });

      // API call
      try {
        const project = projects.find((p) => p.id === draggableId);
        if (project && sourceStatus !== destStatus) {
          await updateProjectStatus(draggableId, project.type, destStatus);
        }
      } catch (error) {
        console.error('Failed to update project status:', error);
        // Revert on error
        setProjects(initialProjects);
      }
    },
    [projects, initialProjects],
  );

  // Empty state
  if (projects.length === 0) {
    return (
      <div
        className="flex h-64 flex-col items-center justify-center rounded-2xl border"
        style={{
          background: 'var(--pv-surface)',
          borderColor: 'var(--pv-border)',
        }}
      >
        <p className="text-[var(--pv-text-muted)]">No projects to display</p>
        <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
          Projects will appear here once created
        </p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <PipelineColumn
            key={column.status}
            status={column.status}
            title={column.title}
            icon={column.icon}
            color={column.color}
            projects={projectsByStatus[column.status] || []}
            clients={clients}
            onEditProject={onEditProject}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </DragDropContext>
  );
}

// Export column config for use by parent components
export { ALL_COLUMNS };
export type { ColumnConfig };
