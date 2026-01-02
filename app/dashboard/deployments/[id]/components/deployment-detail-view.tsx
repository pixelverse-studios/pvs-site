'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { DeploymentStatusBadge } from '@/app/dashboard/clients/[id]/websites/[websiteId]/components/deployment-status-badge';
import { DeploymentCard } from '@/app/dashboard/clients/[id]/websites/[websiteId]/components/deployment-card';
import { ArrowLeft, Globe, Rocket, ExternalLink, Users } from 'lucide-react';
import type { DeploymentDetail, IndexingStatus } from '@/lib/types/deployment';

interface DeploymentDetailViewProps {
  deployment: DeploymentDetail;
}

export function DeploymentDetailView({ deployment }: DeploymentDetailViewProps) {
  // State for optimistic updates when URL statuses change
  const [currentDeployment, setCurrentDeployment] = useState(deployment);

  // Build navigation paths
  const clientName =
    [deployment.client.firstname, deployment.client.lastname].filter(Boolean).join(' ') || 'Client';
  const websitePath = `/dashboard/clients/${deployment.client.id}/websites/${deployment.website.id}`;
  const clientPath = `/dashboard/clients/${deployment.client.id}`;

  // Handler for status updates (passed to DeploymentCard)
  const handleStatusUpdated = (deploymentId: string, newStatus: IndexingStatus, url?: string) => {
    // Implement optimistic update logic similar to deployments-section.tsx
    setCurrentDeployment((prev) => {
      const now = new Date().toISOString();

      if (url) {
        // Update single URL
        const updatedUrls = prev.changed_urls.map((u) => {
          if (u.url !== url) return u;
          return {
            ...u,
            indexing_status: newStatus,
            indexing_requested_at:
              newStatus === 'requested' || newStatus === 'indexed'
                ? u.indexing_requested_at || now
                : u.indexing_requested_at,
            indexed_at: newStatus === 'indexed' ? now : u.indexed_at,
          };
        });

        // Recalculate deployment-level status
        const allIndexed = updatedUrls.every((u) => u.indexing_status === 'indexed');
        const anyPending = updatedUrls.some((u) => u.indexing_status === 'pending');
        const deploymentStatus: IndexingStatus = allIndexed
          ? 'indexed'
          : anyPending
            ? 'pending'
            : 'requested';

        return {
          ...prev,
          changed_urls: updatedUrls,
          indexing_status: deploymentStatus,
          indexing_requested_at:
            deploymentStatus !== 'pending'
              ? prev.indexing_requested_at || now
              : prev.indexing_requested_at,
          indexed_at: deploymentStatus === 'indexed' ? now : prev.indexed_at,
        };
      } else {
        // Update all URLs
        return {
          ...prev,
          changed_urls: prev.changed_urls.map((u) => ({
            ...u,
            indexing_status: newStatus,
            indexing_requested_at:
              newStatus === 'requested' || newStatus === 'indexed'
                ? u.indexing_requested_at || now
                : u.indexing_requested_at,
            indexed_at: newStatus === 'indexed' ? now : u.indexed_at,
          })),
          indexing_status: newStatus,
          indexing_requested_at:
            newStatus === 'requested' || newStatus === 'indexed'
              ? prev.indexing_requested_at || now
              : prev.indexing_requested_at,
          indexed_at: newStatus === 'indexed' ? now : prev.indexed_at,
        };
      }
    });
  };

  // Format timestamp for display
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Calculate status counts for display
  const pendingCount = currentDeployment.changed_urls.filter(
    (u) => u.indexing_status === 'pending',
  ).length;
  const requestedCount = currentDeployment.changed_urls.filter(
    (u) => u.indexing_status === 'requested',
  ).length;
  const indexedCount = currentDeployment.changed_urls.filter(
    (u) => u.indexing_status === 'indexed',
  ).length;
  const totalCount = currentDeployment.changed_urls.length;

  return (
    <main className="pb-16 pt-6 lg:pt-8">
      <Container className="max-w-5xl">
        {/* Back Navigation & Breadcrumbs */}
        <div className="mb-8">
          <Link
            href={websitePath}
            className="group inline-flex items-center gap-2 text-sm text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-primary)]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to {deployment.website.title}
          </Link>

          {/* Breadcrumb trail */}
          <nav className="mt-3 flex items-center gap-2 text-xs text-[var(--pv-text-muted)]">
            <Link href="/dashboard" className="transition-colors hover:text-[var(--pv-primary)]">
              Dashboard
            </Link>
            <span>/</span>
            <Link
              href="/dashboard/clients"
              className="transition-colors hover:text-[var(--pv-primary)]"
            >
              Clients
            </Link>
            <span>/</span>
            <Link href={clientPath} className="transition-colors hover:text-[var(--pv-primary)]">
              {clientName}
            </Link>
            <span>/</span>
            <Link href={websitePath} className="transition-colors hover:text-[var(--pv-primary)]">
              {deployment.website.title}
            </Link>
            <span>/</span>
            <span className="text-[var(--pv-text)]">Deployment</span>
          </nav>
        </div>

        {/* Hero Section */}
        <header className="mb-8 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              {/* Title with icon */}
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: 'rgba(63, 0, 233, 0.1)' }}
                >
                  <Rocket className="h-5 w-5" style={{ color: 'var(--pv-primary)' }} />
                </div>
                <div>
                  <h1
                    className="font-heading text-xl font-semibold"
                    style={{ color: 'var(--pv-text)' }}
                  >
                    Deployment Details
                  </h1>
                  <p className="text-sm text-[var(--pv-text-muted)]">
                    {formatDate(currentDeployment.created_at)}
                  </p>
                </div>
              </div>

              {/* Website & Client context */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={websitePath}
                  className="hover:border-[var(--pv-primary)]/30 inline-flex items-center gap-2 rounded-lg border border-[var(--pv-border)] bg-[var(--pv-bg)] px-3 py-1.5 text-sm transition-colors"
                >
                  <Globe className="h-4 w-4 text-[var(--pv-text-muted)]" />
                  <span style={{ color: 'var(--pv-text)' }}>{deployment.website.title}</span>
                </Link>

                <Link
                  href={clientPath}
                  className="hover:border-[var(--pv-primary)]/30 inline-flex items-center gap-2 rounded-lg border border-[var(--pv-border)] bg-[var(--pv-bg)] px-3 py-1.5 text-sm transition-colors"
                >
                  <Users className="h-4 w-4 text-[var(--pv-text-muted)]" />
                  <span style={{ color: 'var(--pv-text)' }}>{clientName}</span>
                </Link>

                {deployment.website.domain && (
                  <a
                    href={`https://${deployment.website.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:border-[var(--pv-primary)]/30 inline-flex items-center gap-1.5 rounded-lg border border-[var(--pv-border)] bg-[var(--pv-bg)] px-3 py-1.5 text-sm text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-primary)]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {deployment.website.domain}
                  </a>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <DeploymentStatusBadge
              status={
                currentDeployment.indexing_status === 'indexed'
                  ? 'indexed'
                  : currentDeployment.indexing_status === 'requested'
                    ? 'requested'
                    : indexedCount > 0 || requestedCount > 0
                      ? 'partial'
                      : 'pending'
              }
              indexedCount={indexedCount}
              requestedCount={requestedCount}
              totalCount={totalCount}
            />
          </div>
        </header>

        {/* Deployment Card */}
        <DeploymentCard
          deployment={{
            ...currentDeployment,
            // Ensure the deployment object matches the expected type
            internal_notes: currentDeployment.internal_notes || undefined,
          }}
          index={0}
          onStatusUpdated={handleStatusUpdated}
        />

        {/* Bottom Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Link
            href={websitePath}
            className="hover:border-[var(--pv-primary)]/30 inline-flex items-center gap-2 rounded-lg border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-2 text-sm font-medium transition-colors"
            style={{ color: 'var(--pv-text)' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Website
          </Link>

          <Link
            href={`${websitePath}#deployments`}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--pv-surface)]"
            style={{ color: 'var(--pv-text-muted)' }}
          >
            View All Deployments
            <Rocket className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </main>
  );
}
