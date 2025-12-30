'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  GripVertical,
  Globe,
  ExternalLink,
  BarChart3,
  Pencil,
  Database,
  Code2,
  Smartphone,
  Layout,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Project, WebsiteProject, AppProject, ProjectStatus } from '@/lib/types/project';
import { STATUS_COLORS, isProjectInactive, formatRelativeTime } from '@/lib/types/project';

interface ProjectKanbanCardProps {
  project: Project;
  clientId: string;
  isDragging?: boolean;
  onEdit?: (project: Project) => void;
}

// Type badge configurations
const WEBSITE_TYPE_CONFIG: Record<string, { color: string; icon: typeof Globe }> = {
  Static: { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: Globe },
  CMS: { color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', icon: Database },
  Custom: { color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20', icon: Code2 },
};

const APP_PLATFORM_CONFIG: Record<string, { color: string; icon: typeof Smartphone }> = {
  iOS: { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: Smartphone },
  Android: { color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: Smartphone },
  Web: { color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20', icon: Layout },
};

function TypeBadge({ project }: { project: Project }) {
  if (project.type === 'website') {
    const config = WEBSITE_TYPE_CONFIG[project.websiteType] ?? WEBSITE_TYPE_CONFIG.Static;
    const Icon = config.icon;
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
          config.color
        )}
      >
        <Icon className="h-3 w-3" />
        {project.websiteType}
      </span>
    );
  }

  // App
  const config = APP_PLATFORM_CONFIG[project.platform] ?? APP_PLATFORM_CONFIG.Web;
  const Icon = config.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
        config.color
      )}
    >
      <Icon className="h-3 w-3" />
      {project.platform}
    </span>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  if (project.type === 'website') {
    const fullUrl = `https://${project.domain}`;
    return (
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group/link inline-flex items-center gap-1.5 text-sm text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-primary)]"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="truncate">{project.domain}</span>
        <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover/link:opacity-100" />
      </a>
    );
  }

  // App - show store links
  const appProject = project as AppProject;
  const hasStoreLinks = appProject.appStoreUrl || appProject.playStoreUrl;

  if (!hasStoreLinks) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-[var(--pv-text-muted)]">
        <Smartphone className="h-3.5 w-3.5" />
        <span>No store links</span>
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {appProject.appStoreUrl && (
        <a
          href={appProject.appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-primary)]"
        >
          App Store
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
      {appProject.playStoreUrl && (
        <a
          href={appProject.playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-primary)]"
        >
          Play Store
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}

export function ProjectKanbanCard({
  project,
  clientId,
  isDragging = false,
  onEdit,
}: ProjectKanbanCardProps) {
  const statusColor = STATUS_COLORS[project.status];
  const isInactive = isProjectInactive(project.status);
  const relativeTime = useMemo(
    () => formatRelativeTime(project.updated_at),
    [project.updated_at]
  );

  // Build detail page URL
  const detailUrl = useMemo(() => {
    if (project.type === 'website') {
      return `/dashboard/clients/${clientId}/websites/${project.id}`;
    }
    return `/dashboard/clients/${clientId}/apps/${project.id}`;
  }, [project, clientId]);

  // SEO URL (websites only)
  const seoUrl = useMemo(() => {
    if (project.type === 'website' && project.seo_focus) {
      return `/dashboard/clients/${clientId}/websites/${project.id}/seo-focus`;
    }
    return null;
  }, [project, clientId]);

  return (
    <div
      className={cn(
        'group relative rounded-lg border bg-[var(--pv-surface)] transition-all duration-200',
        isDragging && 'rotate-2 shadow-xl opacity-90',
        isInactive && 'opacity-60',
        !isDragging && 'hover:shadow-md'
      )}
      style={{
        borderColor: 'var(--pv-border)',
        borderLeftWidth: '3px',
        borderLeftColor: statusColor,
      }}
    >
      {/* Card Content */}
      <div className="p-3">
        {/* Header: Drag handle + Title + Type Badge */}
        <div className="mb-2 flex items-start gap-2">
          {/* Drag Handle */}
          <div className="mt-0.5 cursor-grab opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-[var(--pv-text-muted)]" />
          </div>

          {/* Title */}
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-medium text-[var(--pv-text)]">
              {project.title}
            </h4>
          </div>

          {/* Type Badge */}
          <TypeBadge project={project} />
        </div>

        {/* Domain / Store Links */}
        <div className="mb-2 pl-6">
          <ProjectLinks project={project} />
        </div>

        {/* Timestamp */}
        <div className="mb-3 flex items-center gap-1.5 pl-6 text-xs text-[var(--pv-text-muted)]">
          <Clock className="h-3 w-3" />
          <span>Updated {relativeTime}</span>
        </div>

        {/* Quick Actions - visible on hover */}
        <div className="flex items-center gap-1.5 pl-6 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
            <Link href={detailUrl}>
              <ExternalLink className="mr-1 h-3 w-3" />
              View
            </Link>
          </Button>

          {seoUrl && (
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
              <Link href={seoUrl}>
                <BarChart3 className="mr-1 h-3 w-3" />
                SEO
              </Link>
            </Button>
          )}

          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => onEdit(project)}
            >
              <Pencil className="mr-1 h-3 w-3" />
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
