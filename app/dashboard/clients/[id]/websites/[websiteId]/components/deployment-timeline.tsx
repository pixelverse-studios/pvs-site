import { Deployment } from '../types'
import { DeploymentCard } from './deployment-card'

interface DeploymentTimelineProps {
  deployments: Deployment[]
  onUrlMarked?: () => void
}

export function DeploymentTimeline({ deployments, onUrlMarked }: DeploymentTimelineProps) {
  if (deployments.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div
        className="
          absolute left-0 top-4 bottom-4 w-px
          bg-gradient-to-b from-transparent via-[var(--pv-border)] to-transparent
          hidden md:block
        "
        style={{
          marginLeft: '0.5rem',
        }}
      />

      {/* Deployment cards */}
      <div className="relative space-y-6 md:pl-12">
        {deployments.map((deployment, index) => (
          <div key={deployment.id} className="relative">
            {/* Timeline dot indicator (desktop only) */}
            <div
              className="
                absolute -left-12 top-6
                hidden md:flex
                items-center justify-center
                w-4 h-4
                rounded-full
                bg-[var(--pv-bg)]
                border-2
                z-10
              "
              style={{
                borderColor: deployment.indexed_at
                  ? '#10b981'
                  : '#f59e0b',
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: deployment.indexed_at
                    ? '#10b981'
                    : '#f59e0b',
                }}
              />
            </div>

            {/* Deployment card */}
            <DeploymentCard
              deployment={deployment}
              index={index}
              onUrlMarked={onUrlMarked}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
