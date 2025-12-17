import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { PackageX, ArrowLeft } from 'lucide-react'

export default function DeploymentNotFound() {
  return (
    <main className="pb-16 pt-6 lg:pt-8">
      <Container className="max-w-5xl">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div
            className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl"
            style={{ background: 'var(--pv-surface)' }}
          >
            <PackageX
              className="h-10 w-10"
              style={{ color: 'var(--pv-text-muted)' }}
            />
          </div>

          <h1
            className="mb-2 font-heading text-2xl font-semibold"
            style={{ color: 'var(--pv-text)' }}
          >
            Deployment Not Found
          </h1>

          <p
            className="mb-8 max-w-md text-sm"
            style={{ color: 'var(--pv-text-muted)' }}
          >
            The deployment you&apos;re looking for doesn&apos;t exist or may have been
            removed. Check the URL or navigate back to the dashboard.
          </p>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-2 text-sm font-medium transition-colors hover:border-[var(--pv-primary)]/30"
            style={{ color: 'var(--pv-text)' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </Container>
    </main>
  )
}
