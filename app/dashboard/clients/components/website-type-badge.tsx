'use client'

import { Globe, Code, Blocks, Wrench } from 'lucide-react'

interface WebsiteTypeBadgeProps {
  type: string
  className?: string
}

const typeConfig = {
  Static: {
    icon: Code,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    bg: 'rgba(102, 126, 234, 0.1)',
    color: '#667eea',
  },
  WordPress: {
    icon: Blocks,
    gradient: 'linear-gradient(135deg, #21759b 0%, #0073aa 100%)',
    bg: 'rgba(33, 117, 155, 0.1)',
    color: '#21759b',
  },
  Custom: {
    icon: Wrench,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    bg: 'rgba(240, 147, 251, 0.1)',
    color: '#f093fb',
  },
  Default: {
    icon: Globe,
    gradient: 'var(--pv-gradient)',
    bg: 'rgba(63, 0, 233, 0.1)',
    color: 'var(--pv-primary)',
  },
}

export function WebsiteTypeBadge({ type, className = '' }: WebsiteTypeBadgeProps) {
  const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.Default
  const Icon = config.icon

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${className}`}
      style={{
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.color}20`,
      }}
    >
      <Icon className="h-3 w-3" />
      <span>{type}</span>
    </div>
  )
}
