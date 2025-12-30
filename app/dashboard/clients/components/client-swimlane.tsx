'use client';

import { useMemo } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { ChevronDown, ChevronRight, Plus, User, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ProjectKanbanCard } from './project-kanban-card';
import type { Client } from '@/lib/types/client';
import type { Project, ProjectStatus } from '@/lib/types/project';

interface ColumnConfig {
  status: ProjectStatus;
  title: string;
}

interface ClientSwimlaneProps {
  client: Client;
  projects: Project[];
  columns: ColumnConfig[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onAddProject?: (clientId: string) => void;
  onEditProject?: (project: Project) => void;
}

export function ClientSwimlane({
  client,
  projects,
  columns,
  isCollapsed = false,
  onToggleCollapse,
  onAddProject,
  onEditProject,
}: ClientSwimlaneProps) {
  // Group projects by status
  const projectsByStatus = useMemo(() => {
    const groups: Partial<Record<ProjectStatus, Project[]>> = {};

    // Initialize empty arrays for each column
    columns.forEach((col) => {
      groups[col.status] = [];
    });

    // Assign projects to their status groups
    projects.forEach((p) => {
      if (groups[p.status]) {
        groups[p.status]!.push(p);
      }
    });

    // Sort by priority within each column (lower priority = higher rank)
    Object.values(groups).forEach((group) => {
      if (group) {
        group.sort((a, b) => a.priority - b.priority);
      }
    });

    return groups;
  }, [projects, columns]);

  // Build contact display
  const contactName =
    client.firstname && client.lastname
      ? `${client.firstname} ${client.lastname}`
      : client.firstname || client.lastname || null;

  // Count total projects
  const projectCount = projects.length;

  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{
        background: 'var(--pv-surface)',
        borderColor: 'var(--pv-border)',
      }}
    >
      {/* Swimlane Header */}
      <div
        className="flex items-center justify-between gap-4 border-b px-4 py-3"
        style={{ borderColor: 'var(--pv-border)' }}
      >
        {/* Left: Collapse toggle + Client name */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex items-center justify-center rounded p-1 transition-colors hover:bg-[var(--pv-border)]"
            aria-label={isCollapsed ? 'Expand swimlane' : 'Collapse swimlane'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-[var(--pv-text-muted)]" />
            ) : (
              <ChevronDown className="h-5 w-5 text-[var(--pv-text-muted)]" />
            )}
          </button>

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-[var(--pv-text)]">
              {client.client}
            </h3>
            {projectCount > 0 && (
              <p className="text-xs text-[var(--pv-text-muted)]">
                {projectCount} {projectCount === 1 ? 'project' : 'projects'}
              </p>
            )}
          </div>
        </div>

        {/* Center: Contact info */}
        <div className="hidden items-center gap-4 md:flex">
          {contactName && (
            <div className="flex items-center gap-1.5 text-sm text-[var(--pv-text-muted)]">
              <User className="h-4 w-4" />
              <span>{contactName}</span>
            </div>
          )}
          {client.email && (
            <div className="flex items-center gap-1.5 text-sm text-[var(--pv-text-muted)]">
              <Mail className="h-4 w-4" />
              <span className="truncate">{client.email}</span>
            </div>
          )}
        </div>

        {/* Right: Add Project button */}
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0"
          onClick={() => onAddProject?.(client.id)}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Columns Grid (collapsible) */}
      {!isCollapsed && (
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${columns.length}, minmax(180px, 1fr))`,
          }}
        >
          {columns.map(({ status }) => (
            <Droppable droppableId={`${client.id}-${status}`} key={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    'min-h-[120px] border-r p-2 transition-colors last:border-r-0',
                    snapshot.isDraggingOver && 'bg-[var(--pv-primary)]/5'
                  )}
                  style={{ borderColor: 'var(--pv-border)' }}
                >
                  <div className="space-y-2">
                    {projectsByStatus[status]?.map((project, index) => (
                      <Draggable key={project.id} draggableId={project.id} index={index}>
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                          >
                            <ProjectKanbanCard
                              project={project}
                              clientId={client.id}
                              isDragging={dragSnapshot.isDragging}
                              onEdit={onEditProject}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      )}

      {/* Collapsed state indicator */}
      {isCollapsed && (
        <div className="px-4 py-2 text-xs text-[var(--pv-text-muted)]">
          {projectCount === 0
            ? 'No projects'
            : `${projectCount} ${projectCount === 1 ? 'project' : 'projects'} hidden`}
        </div>
      )}
    </div>
  );
}
