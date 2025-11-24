import { DeploymentStatus } from '../types'

interface DeploymentStatusBadgeProps {
  status: DeploymentStatus
  indexedCount?: number
  totalCount?: number
}

export function DeploymentStatusBadge({ status, indexedCount, totalCount }: DeploymentStatusBadgeProps) {
  const isIndexed = status === 'indexed'
  const isPartial = status === 'partial'

  // Determine colors based on status
  const colors = isIndexed
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'

  const dotColor = isIndexed ? 'bg-emerald-500' : 'bg-amber-500'
  const glowColor = isIndexed ? 'bg-emerald-400' : 'bg-amber-400'

  // Determine label
  let label = isIndexed ? 'Indexed' : 'Pending'
  if (isPartial && indexedCount !== undefined && totalCount !== undefined) {
    label = `${indexedCount}/${totalCount} Indexed`
  }

  return (
    <span
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider border
        ${colors}
      `}
    >
      {/* Status indicator dot with glow */}
      <span className="relative flex h-2 w-2">
        <span
          className={`
            absolute inline-flex h-full w-full rounded-full opacity-75
            ${glowColor}
            ${!isIndexed ? 'animate-ping' : ''}
          `}
        />
        <span
          className={`
            relative inline-flex rounded-full h-2 w-2
            ${dotColor}
          `}
        />
      </span>

      {/* Status label */}
      <span className="font-mono">
        {label}
      </span>
    </span>
  )
}
