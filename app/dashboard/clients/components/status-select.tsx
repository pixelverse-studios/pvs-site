'use client';

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ProjectStatus } from '@/lib/types/project';

// Status configuration
interface StatusConfig {
  status: ProjectStatus;
  title: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const STATUS_CONFIG: Record<ProjectStatus, StatusConfig> = {
  // Sales
  lead: {
    status: 'lead',
    title: 'Lead',
    icon: UserPlus,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  discovery: {
    status: 'discovery',
    title: 'Discovery',
    icon: Search,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  proposal: {
    status: 'proposal',
    title: 'Proposal',
    icon: FileText,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  negotiation: {
    status: 'negotiation',
    title: 'Negotiation',
    icon: MessageSquare,
    color: 'text-amber-600',
    bgColor: 'bg-amber-600/10',
  },
  won: {
    status: 'won',
    title: 'Won',
    icon: Trophy,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  lost: {
    status: 'lost',
    title: 'Lost',
    icon: XCircle,
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/10',
  },
  // Project
  planning: {
    status: 'planning',
    title: 'Planning',
    icon: Lightbulb,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  development: {
    status: 'development',
    title: 'Development',
    icon: Code2,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },
  review: {
    status: 'review',
    title: 'Review',
    icon: Eye,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  qa: { status: 'qa', title: 'QA', icon: Bug, color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
  staging: {
    status: 'staging',
    title: 'Staging',
    icon: Server,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  deployed: {
    status: 'deployed',
    title: 'Deployed',
    icon: Rocket,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  // Post-Launch
  maintenance: {
    status: 'maintenance',
    title: 'Maintenance',
    icon: Wrench,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
  },
  on_hold: {
    status: 'on_hold',
    title: 'On Hold',
    icon: Pause,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-600/10',
  },
  archived: {
    status: 'archived',
    title: 'Archived',
    icon: Archive,
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/10',
  },
};

// Phase groupings for organized dropdown
const PHASES = [
  {
    title: 'Sales',
    statuses: ['lead', 'discovery', 'proposal', 'negotiation', 'won', 'lost'] as ProjectStatus[],
  },
  {
    title: 'Project',
    statuses: ['planning', 'development', 'review', 'qa', 'staging', 'deployed'] as ProjectStatus[],
  },
  {
    title: 'Post-Launch',
    statuses: ['maintenance', 'on_hold', 'archived'] as ProjectStatus[],
  },
];

interface StatusSelectProps {
  status: ProjectStatus;
  onChange: (status: ProjectStatus) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function StatusSelect({ status, onChange, disabled, size = 'sm' }: StatusSelectProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <Select
      value={status}
      onValueChange={(value) => onChange(value as ProjectStatus)}
      disabled={disabled}
    >
      <SelectTrigger
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className={cn(
          'inline-flex w-auto items-center gap-1.5 rounded-full border-0 font-medium shadow-none',
          'hover:ring-[var(--pv-primary)]/20 hover:ring-2',
          'focus:ring-[var(--pv-primary)]/40 focus:ring-2',
          config.bgColor,
          config.color,
          size === 'sm' ? 'h-auto px-2 py-0.5 text-xs' : 'h-auto px-3 py-1 text-sm',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent onClick={(e) => e.stopPropagation()} className="max-h-80">
        {PHASES.map((phase, phaseIndex) => (
          <SelectGroup key={phase.title}>
            {phaseIndex > 0 && <SelectSeparator />}
            <SelectLabel>{phase.title}</SelectLabel>
            {phase.statuses.map((s) => {
              const sConfig = STATUS_CONFIG[s];
              const SIcon = sConfig.icon;
              return (
                <SelectItem key={s} value={s}>
                  <span className="flex items-center gap-2">
                    <SIcon className={cn('h-4 w-4', sConfig.color)} />
                    <span>{sConfig.title}</span>
                  </span>
                </SelectItem>
              );
            })}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}

export { STATUS_CONFIG };
