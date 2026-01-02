'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
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
import { StatusSelect } from './status-select';
import type { Client } from '@/lib/types/client';
import type { Project, ProjectStatus } from '@/lib/types/project';

// Status configuration
interface StatusConfig {
  status: ProjectStatus;
  title: string;
  icon: LucideIcon;
  color: string;
}

const STATUS_CONFIG: Record<ProjectStatus, StatusConfig> = {
  // Sales
  lead: { status: 'lead', title: 'Lead', icon: UserPlus, color: 'text-amber-500' },
  discovery: { status: 'discovery', title: 'Discovery', icon: Search, color: 'text-orange-500' },
  proposal: { status: 'proposal', title: 'Proposal', icon: FileText, color: 'text-yellow-500' },
  negotiation: {
    status: 'negotiation',
    title: 'Negotiation',
    icon: MessageSquare,
    color: 'text-amber-600',
  },
  won: { status: 'won', title: 'Won', icon: Trophy, color: 'text-green-500' },
  lost: { status: 'lost', title: 'Lost', icon: XCircle, color: 'text-gray-400' },
  // Project
  planning: { status: 'planning', title: 'Planning', icon: Lightbulb, color: 'text-blue-500' },
  development: {
    status: 'development',
    title: 'Development',
    icon: Code2,
    color: 'text-indigo-500',
  },
  review: { status: 'review', title: 'Review', icon: Eye, color: 'text-purple-500' },
  qa: { status: 'qa', title: 'QA', icon: Bug, color: 'text-pink-500' },
  staging: { status: 'staging', title: 'Staging', icon: Server, color: 'text-cyan-500' },
  deployed: { status: 'deployed', title: 'Deployed', icon: Rocket, color: 'text-emerald-500' },
  // Post-Launch
  maintenance: {
    status: 'maintenance',
    title: 'Maintenance',
    icon: Wrench,
    color: 'text-teal-500',
  },
  on_hold: { status: 'on_hold', title: 'On Hold', icon: Pause, color: 'text-yellow-600' },
  archived: { status: 'archived', title: 'Archived', icon: Archive, color: 'text-gray-400' },
};

// Phase configuration
interface PhaseConfig {
  id: string;
  title: string;
  statuses: ProjectStatus[];
  color: string;
  bgColor: string;
}

const PHASES: PhaseConfig[] = [
  {
    id: 'sales',
    title: 'Sales Pipeline',
    statuses: ['lead', 'discovery', 'proposal', 'negotiation', 'won', 'lost'],
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    id: 'project',
    title: 'Active Projects',
    statuses: ['planning', 'development', 'review', 'qa', 'staging', 'deployed'],
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'postLaunch',
    title: 'Post-Launch',
    statuses: ['maintenance', 'on_hold', 'archived'],
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
];

interface PipelineListViewProps {
  projects: Project[];
  clients: Client[];
  visibleStatuses?: ProjectStatus[];
  onEditProject?: (project: Project) => void;
  onStatusChange?: (
    projectId: string,
    projectType: 'website' | 'app',
    newStatus: ProjectStatus,
  ) => void;
}

export function PipelineListView({
  projects,
  clients,
  visibleStatuses,
  onEditProject,
  onStatusChange,
}: PipelineListViewProps) {
  const router = useRouter();

  // Create client lookup
  const clientMap = useMemo(() => new Map(clients.map((c) => [c.id, c])), [clients]);

  // Group projects by phase and status
  const groupedProjects = useMemo(() => {
    const groups: Record<string, Record<ProjectStatus, Project[]>> = {};

    PHASES.forEach((phase) => {
      groups[phase.id] = {} as Record<ProjectStatus, Project[]>;
      phase.statuses.forEach((status) => {
        groups[phase.id][status] = [];
      });
    });

    projects.forEach((project) => {
      const phase = PHASES.find((p) => p.statuses.includes(project.status));
      if (phase && groups[phase.id][project.status]) {
        groups[phase.id][project.status].push(project);
      }
    });

    return groups;
  }, [projects]);

  // Calculate which phases have projects (for default expanded state)
  const phasesWithProjects = useMemo(() => {
    return new Set(
      PHASES.filter((phase) => {
        const phaseGroups = groupedProjects[phase.id];
        if (!phaseGroups) return false;
        return Object.values(phaseGroups).some((arr) => arr.length > 0);
      }).map((p) => p.id),
    );
  }, [groupedProjects]);

  // Only expand phases that have projects by default
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(() => phasesWithProjects);
  const [expandedStatuses, setExpandedStatuses] = useState<Set<string>>(new Set());

  // Filter phases based on visibleStatuses
  const visiblePhases = useMemo(() => {
    if (!visibleStatuses) return PHASES;
    return PHASES.filter((phase) => phase.statuses.some((s) => visibleStatuses.includes(s)));
  }, [visibleStatuses]);

  // Get phase project count
  const getPhaseCount = (phaseId: string) => {
    const phaseGroups = groupedProjects[phaseId];
    if (!phaseGroups) return 0;
    return Object.values(phaseGroups).reduce((sum, arr) => sum + arr.length, 0);
  };

  // Toggle phase expansion
  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) {
        next.delete(phaseId);
      } else {
        next.add(phaseId);
      }
      return next;
    });
  };

  // Toggle status expansion
  const toggleStatus = (statusKey: string) => {
    setExpandedStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(statusKey)) {
        next.delete(statusKey);
      } else {
        next.add(statusKey);
      }
      return next;
    });
  };

  // Handle project click
  const handleProjectClick = (project: Project) => {
    if (onEditProject) {
      onEditProject(project);
    } else {
      router.push(`/dashboard/clients/${project.client_id}`);
    }
  };

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
    <div className="space-y-4">
      {visiblePhases.map((phase) => {
        const phaseCount = getPhaseCount(phase.id);
        const isPhaseExpanded = expandedPhases.has(phase.id);
        const phaseStatuses = visibleStatuses
          ? phase.statuses.filter((s) => visibleStatuses.includes(s))
          : phase.statuses;

        return (
          <div
            key={phase.id}
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: 'var(--pv-border)' }}
          >
            {/* Phase Header */}
            <button
              onClick={() => togglePhase(phase.id)}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--pv-surface)]',
                phase.bgColor,
              )}
            >
              {isPhaseExpanded ? (
                <ChevronDown className={cn('h-5 w-5', phase.color)} />
              ) : (
                <ChevronRight className={cn('h-5 w-5', phase.color)} />
              )}
              <span className={cn('font-semibold', phase.color)}>{phase.title}</span>
              <span
                className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-sm font-medium"
                style={{
                  background: 'var(--pv-bg)',
                  color: 'var(--pv-text-muted)',
                }}
              >
                {phaseCount}
              </span>
            </button>

            {/* Phase Content */}
            {isPhaseExpanded && (
              <div
                className="divide-y"
                style={{
                  background: 'var(--pv-bg)',
                  borderColor: 'var(--pv-border)',
                }}
              >
                {phaseStatuses.map((status) => {
                  const statusConfig = STATUS_CONFIG[status];
                  const statusProjects = groupedProjects[phase.id]?.[status] || [];
                  const statusKey = `${phase.id}-${status}`;
                  const isStatusExpanded =
                    expandedStatuses.has(statusKey) || statusProjects.length <= 3;
                  const Icon = statusConfig.icon;

                  if (statusProjects.length === 0) {
                    return (
                      <div
                        key={status}
                        className="flex items-center gap-3 px-4 py-2 opacity-50"
                        style={{ borderColor: 'var(--pv-border)' }}
                      >
                        <Icon className={cn('h-4 w-4', statusConfig.color)} />
                        <span className="text-sm text-[var(--pv-text-muted)]">
                          {statusConfig.title}
                        </span>
                        <span className="ml-auto text-xs text-[var(--pv-text-muted)]">0</span>
                      </div>
                    );
                  }

                  return (
                    <div key={status} style={{ borderColor: 'var(--pv-border)' }}>
                      {/* Status Header */}
                      <button
                        onClick={() => statusProjects.length > 3 && toggleStatus(statusKey)}
                        className={cn(
                          'flex w-full items-center gap-3 px-4 py-2 transition-colors',
                          statusProjects.length > 3 &&
                            'cursor-pointer hover:bg-[var(--pv-surface)]',
                        )}
                      >
                        <Icon className={cn('h-4 w-4', statusConfig.color)} />
                        <span className="text-sm font-medium text-[var(--pv-text)]">
                          {statusConfig.title}
                        </span>
                        <span
                          className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium"
                          style={{
                            background: 'var(--pv-border)',
                            color: 'var(--pv-text-muted)',
                          }}
                        >
                          {statusProjects.length}
                        </span>
                        {statusProjects.length > 3 && (
                          <span className="ml-auto text-xs text-[var(--pv-text-muted)]">
                            {isStatusExpanded ? 'Show less' : `+${statusProjects.length - 3} more`}
                          </span>
                        )}
                      </button>

                      {/* Project Cards */}
                      <div className="grid gap-2 px-4 pb-3 pt-1 sm:grid-cols-2 lg:grid-cols-3">
                        {(isStatusExpanded ? statusProjects : statusProjects.slice(0, 3)).map(
                          (project) => {
                            const client = clientMap.get(project.client_id);
                            return (
                              <div
                                key={project.id}
                                onClick={() => handleProjectClick(project)}
                                className="flex cursor-pointer flex-col items-start rounded-lg border p-3 text-left transition-all hover:shadow-md"
                                style={{
                                  background: 'var(--pv-surface)',
                                  borderColor: 'var(--pv-border)',
                                }}
                              >
                                <span className="font-medium text-[var(--pv-text)]">
                                  {project.title}
                                </span>
                                {'domain' in project && project.domain && (
                                  <span className="mt-0.5 text-xs text-[var(--pv-text-muted)]">
                                    {project.domain}
                                  </span>
                                )}
                                {client && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <div
                                      className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium"
                                      style={{
                                        background:
                                          'linear-gradient(135deg, var(--pv-primary), var(--pv-primary-2))',
                                        color: 'white',
                                      }}
                                    >
                                      {getClientInitials(client)}
                                    </div>
                                    <span className="text-xs text-[var(--pv-text-muted)]">
                                      {getClientDisplayName(client)}
                                    </span>
                                  </div>
                                )}
                                {/* Status & Type Row */}
                                <div className="mt-2 flex w-full items-center justify-between gap-2">
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
                            );
                          },
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
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
