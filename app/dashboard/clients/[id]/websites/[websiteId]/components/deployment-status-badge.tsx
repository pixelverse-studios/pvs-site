import { IndexingStatus, DeploymentStatus } from '../types'
import { Clock, Send, CheckCircle } from 'lucide-react'

interface DeploymentStatusBadgeProps {
  status: DeploymentStatus
  indexedCount?: number
  requestedCount?: number
  totalCount?: number
  size?: 'sm' | 'md'
}

const statusConfig = {
  pending: {
    label: 'Pending',
    description: 'Needs GSC submission',
    icon: Clock,
    colors: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    dotColor: 'bg-amber-500',
    glowColor: 'bg-amber-400',
    animate: true,
  },
  requested: {
    label: 'Requested',
    description: 'Awaiting Google indexing',
    icon: Send,
    colors: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    dotColor: 'bg-blue-500',
    glowColor: 'bg-blue-400',
    animate: true,
  },
  indexed: {
    label: 'Indexed',
    description: 'Confirmed by Google',
    icon: CheckCircle,
    colors: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    dotColor: 'bg-emerald-500',
    glowColor: 'bg-emerald-400',
    animate: false,
  },
  partial: {
    label: 'Partial',
    description: 'Some URLs indexed',
    icon: Clock,
    colors: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    dotColor: 'bg-amber-500',
    glowColor: 'bg-amber-400',
    animate: true,
  },
}

export function DeploymentStatusBadge({
  status,
  indexedCount,
  requestedCount,
  totalCount,
  size = 'md',
}: DeploymentStatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  // Determine the label
  let label = config.label
  if (status === 'partial' && totalCount !== undefined) {
    if (indexedCount !== undefined && indexedCount > 0) {
      label = `${indexedCount}/${totalCount} Indexed`
    } else if (requestedCount !== undefined && requestedCount > 0) {
      label = `${requestedCount}/${totalCount} Requested`
    } else {
      label = `0/${totalCount} Indexed`
    }
  }

  const sizeClasses = size === 'sm'
    ? 'px-2 py-1 text-[10px] gap-1.5'
    : 'px-3 py-1.5 text-xs gap-2'

  const dotSize = size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2'
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium uppercase tracking-wider border
        ${config.colors}
        ${sizeClasses}
      `}
      title={config.description}
      role="status"
      aria-label={`${config.label}: ${config.description}`}
    >
      {/* Status indicator dot with optional animation */}
      <span className={`relative flex ${dotSize}`}>
        {config.animate && (
          <span
            className={`
              absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping
              ${config.glowColor}
            `}
          />
        )}
        <span
          className={`
            relative inline-flex rounded-full
            ${dotSize}
            ${config.dotColor}
          `}
        />
      </span>

      {/* Status label */}
      <span className="font-mono">{label}</span>

      {/* Icon for larger badges */}
      {size === 'md' && status === 'indexed' && (
        <Icon className={`${iconSize} ml-0.5`} />
      )}
    </span>
  )
}

interface UrlStatusIndicatorProps {
  status: IndexingStatus
  showLabel?: boolean
}

export function UrlStatusIndicator({ status, showLabel = true }: UrlStatusIndicatorProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div
      className={`
        flex items-center gap-1.5 text-xs font-medium
        ${status === 'pending' ? 'text-amber-500' : ''}
        ${status === 'requested' ? 'text-blue-500' : ''}
        ${status === 'indexed' ? 'text-emerald-500' : ''}
      `}
      title={config.description}
    >
      <Icon className="h-3.5 w-3.5" />
      {showLabel && <span>{config.label}</span>}
    </div>
  )
}
