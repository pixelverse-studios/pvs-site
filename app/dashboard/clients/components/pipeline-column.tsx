'use client';

import { Droppable, Draggable } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';
import { StatusSelect } from './status-select';
import type { Project, ProjectStatus } from '@/lib/types/project';
import type { Client } from '@/lib/types/client';
import type { LucideIcon } from 'lucide-react';

interface PipelineColumnProps {
  status: ProjectStatus;
  title: string;
  icon: LucideIcon;
  color: string;
  projects: Project[];
  clients: Client[];
  onEditProject?: (project: Project) => void;
  onStatusChange?: (
    projectId: string,
    projectType: 'website' | 'app',
    newStatus: ProjectStatus,
  ) => void;
}

export function PipelineColumn({
  status,
  title,
  icon: Icon,
  color,
  projects,
  clients,
  onEditProject,
  onStatusChange,
}: PipelineColumnProps) {
  // Create a client lookup map
  const clientMap = new Map(clients.map((c) => [c.id, c]));

  return (
    <div className="flex h-full min-w-[280px] max-w-[320px] flex-1 flex-col">
      {/* Column Header */}
      <div
        className="sticky top-0 z-10 flex items-center gap-2 rounded-t-xl border-b px-4 py-3"
        style={{
          background: 'var(--pv-surface)',
          borderColor: 'var(--pv-border)',
        }}
      >
        <Icon className={cn('h-4 w-4', color)} />
        <span className="text-sm font-semibold text-[var(--pv-text)]">{title}</span>
        <span
          className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium"
          style={{
            background: 'var(--pv-border)',
            color: 'var(--pv-text-muted)',
          }}
        >
          {projects.length}
        </span>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 overflow-y-auto rounded-b-xl border-x border-b p-3 transition-colors',
              snapshot.isDraggingOver && 'bg-[var(--pv-primary)]/5',
            )}
            style={{
              borderColor: 'var(--pv-border)',
              background: snapshot.isDraggingOver ? undefined : 'var(--pv-bg)',
              minHeight: '200px',
            }}
          >
            <div className="space-y-3">
              {projects.length === 0 ? (
                <div
                  className={cn(
                    'flex h-32 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors',
                    snapshot.isDraggingOver
                      ? 'bg-[var(--pv-primary)]/10 border-[var(--pv-primary)]'
                      : 'border-[var(--pv-border)]',
                  )}
                >
                  <p className="text-xs text-[var(--pv-text-muted)]">
                    {snapshot.isDraggingOver ? 'Release to move here' : 'Drag projects here'}
                  </p>
                </div>
              ) : (
                projects.map((project, index) => {
                  const client = clientMap.get(project.client_id);
                  return (
                    <Draggable key={project.id} draggableId={project.id} index={index}>
                      {(dragProvided, dragSnapshot) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          onClick={() => onEditProject?.(project)}
                          className={cn(
                            'cursor-pointer rounded-xl border p-4 transition-all',
                            dragSnapshot.isDragging
                              ? 'ring-[var(--pv-primary)]/20 shadow-lg ring-2'
                              : 'hover:shadow-md',
                          )}
                          style={{
                            background: 'var(--pv-surface)',
                            borderColor: 'var(--pv-border)',
                            ...dragProvided.draggableProps.style,
                          }}
                        >
                          {/* Project Title */}
                          <h4 className="font-medium text-[var(--pv-text)]">{project.title}</h4>

                          {/* Domain (for websites) */}
                          {'domain' in project && project.domain && (
                            <p className="mt-0.5 text-xs text-[var(--pv-text-muted)]">
                              {project.domain}
                            </p>
                          )}

                          {/* Client Name */}
                          {client && (
                            <div className="mt-3 flex items-center gap-2 border-t border-[var(--pv-border)] pt-3">
                              <div
                                className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium"
                                style={{
                                  background:
                                    'linear-gradient(135deg, var(--pv-primary), var(--pv-primary-2))',
                                  color: 'white',
                                }}
                              >
                                {getClientInitials(client)}
                              </div>
                              <span className="text-sm text-[var(--pv-text-muted)]">
                                {getClientDisplayName(client)}
                              </span>
                            </div>
                          )}

                          {/* Status & Type Row */}
                          <div className="mt-2 flex items-center justify-between gap-2">
                            {onStatusChange ? (
                              <StatusSelect
                                status={project.status}
                                onChange={(newStatus) =>
                                  onStatusChange(project.id, project.type, newStatus)
                                }
                              />
                            ) : (
                              <span
                                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                                style={{
                                  background: 'var(--pv-border)',
                                  color: 'var(--pv-text-muted)',
                                }}
                              >
                                {project.type === 'website' ? 'Website' : 'App'}
                              </span>
                            )}
                            <span
                              className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                              style={{
                                background: 'var(--pv-border)',
                                color: 'var(--pv-text-muted)',
                              }}
                            >
                              {project.type === 'website' ? 'Website' : 'App'}
                            </span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })
              )}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
}

// Helper functions
function getClientDisplayName(client: Client): string {
  if (client.firstname && client.lastname) {
    return `${client.firstname} ${client.lastname}`;
  }
  if (client.firstname) return client.firstname;
  if (client.lastname) return client.lastname;
  if (client.client) return client.client;
  return 'Unknown';
}

function getClientInitials(client: Client): string {
  const name = getClientDisplayName(client);
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
