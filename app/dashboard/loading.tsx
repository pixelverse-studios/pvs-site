import { Container } from '@/components/ui/container';

function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl ${className}`}
      style={{ background: 'var(--pv-surface)', border: '1px solid var(--pv-border)' }}
    />
  );
}

export default function DashboardLoading() {
  return (
    <main className="pb-16 pt-6 lg:pt-8">
      <Container className="max-w-7xl">
        <div className="space-y-6">
          <div className="space-y-3">
            <SkeletonBlock className="h-8 w-56" />
            <SkeletonBlock className="h-4 w-80 max-w-full" />
          </div>
          <SkeletonBlock className="h-24 w-full" />
          <div className="grid gap-6 lg:grid-cols-3">
            <SkeletonBlock className="h-72 lg:col-span-2" />
            <SkeletonBlock className="h-72" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <SkeletonBlock className="h-44" />
            <SkeletonBlock className="h-44" />
            <SkeletonBlock className="h-44" />
          </div>
        </div>
      </Container>
    </main>
  );
}
