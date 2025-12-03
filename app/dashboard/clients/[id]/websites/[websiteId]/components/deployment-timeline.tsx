import { Deployment, IndexingStatus } from '../types'
import { DeploymentCard } from './deployment-card'

type UrlFilter = 'all' | 'pending' | 'requested' | 'indexed'

interface DeploymentTimelineProps {
  deployments: Deployment[]
  onStatusUpdated?: (
    deploymentId: string,
    newStatus: IndexingStatus,
    url?: string
  ) => void
  urlFilter?: UrlFilter
}

// Get timeline dot color based on deployment indexing status
function getTimelineDotColor(status: IndexingStatus): string {
  switch (status) {
    case 'pending':
      return '#f59e0b' // amber
    case 'requested':
      return '#3b82f6' // blue
    case 'indexed':
      return '#10b981' // emerald
  }
}

export function DeploymentTimeline({
  deployments,
  onStatusUpdated,
  urlFilter = 'all',
}: DeploymentTimelineProps) {
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
        {deployments.map((deployment, index) => {
          const dotColor = getTimelineDotColor(deployment.indexing_status)

          return (
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
                  borderColor: dotColor,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: dotColor,
                  }}
                />
              </div>

              {/* Deployment card */}
              <DeploymentCard
                deployment={deployment}
                index={index}
                onStatusUpdated={onStatusUpdated}
                urlFilter={urlFilter}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
