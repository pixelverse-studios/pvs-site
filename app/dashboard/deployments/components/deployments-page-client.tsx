'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Rocket, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  INDEXING_STATUS_LABELS,
  INDEXING_STATUS_COLORS,
  formatDeploymentDateTime,
} from '@/lib/types/deployment';
import type { IndexingStatus } from '@/lib/types/deployment';
import type { FlattenedDeployment } from '../page';

type SortField = 'created_at' | 'website_title' | 'client_name' | 'indexing_status';
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | IndexingStatus;

function SortIcon({
  field,
  sortField,
  sortDirection,
}: {
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
}) {
  if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
  return sortDirection === 'asc' ? (
    <ArrowUp className="h-3.5 w-3.5" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5" />
  );
}

function IndexingBadge({ status }: { status: IndexingStatus }) {
  const label = INDEXING_STATUS_LABELS[status] || status;
  const color = INDEXING_STATUS_COLORS[status] || '#6b7280';

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        background: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

interface DeploymentsPageClientProps {
  deployments: FlattenedDeployment[];
}

export function DeploymentsPageClient({ deployments }: DeploymentsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'created_at' ? 'desc' : 'asc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = deployments;

    if (searchQuery) {
      const query = (searchQuery || '').toLowerCase();
      result = result.filter(
        (d) =>
          (d.website_title || '').toLowerCase().includes(query) ||
          (d.client_name || '').toLowerCase().includes(query) ||
          (d.deploy_summary || '').toLowerCase().includes(query),
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((d) => d.indexing_status === statusFilter);
    }

    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'website_title':
          comparison = (a.website_title || '').localeCompare(b.website_title || '');
          break;
        case 'client_name':
          comparison = (a.client_name || '').localeCompare(b.client_name || '');
          break;
        case 'indexing_status':
          comparison = (a.indexing_status || '').localeCompare(b.indexing_status || '');
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [deployments, searchQuery, statusFilter, sortField, sortDirection]);

  if (deployments.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1
            className="font-heading text-2xl font-bold md:text-3xl"
            style={{ color: 'var(--pv-text)' }}
          >
            Deployments
          </h1>
          <p className="text-sm" style={{ color: 'var(--pv-text-muted)' }}>
            Recent deployments across all websites
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Rocket className="mb-4 h-12 w-12 text-[var(--pv-text-muted)]" />
            <p className="text-lg font-medium text-[var(--pv-text)]">No deployments yet</p>
            <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
              Deployments will appear here after pushing to main.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1
          className="font-heading text-2xl font-bold md:text-3xl"
          style={{ color: 'var(--pv-text)' }}
        >
          Deployments
        </h1>
        <p className="text-sm" style={{ color: 'var(--pv-text-muted)' }}>
          {deployments.length} deployment{deployments.length !== 1 ? 's' : ''} in the last 30 days
        </p>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--pv-text-muted)]" />
              <Input
                type="text"
                placeholder="Search by website, client, or summary..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  ['all', 'All'],
                  ['pending', 'Pending'],
                  ['requested', 'Requested'],
                  ['indexed', 'Indexed'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setStatusFilter(value)}
                  className={`rounded-pv-sm px-4 py-2 text-sm font-medium transition-colors ${
                    statusFilter === value
                      ? 'bg-[var(--pv-primary)] text-white'
                      : 'bg-[var(--pv-surface)] text-[var(--pv-text-muted)] hover:bg-[var(--pv-border)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 text-sm text-[var(--pv-text-muted)]">
            Showing {filteredAndSorted.length} of {deployments.length} deployments
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredAndSorted.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-[var(--pv-text-muted)]">No deployments match your search criteria</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)]">
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort('created_at')}
                          className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]"
                        >
                          Date <SortIcon field="created_at" sortField={sortField} sortDirection={sortDirection} />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort('website_title')}
                          className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]"
                        >
                          Website <SortIcon field="website_title" sortField={sortField} sortDirection={sortDirection} />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort('client_name')}
                          className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]"
                        >
                          Client <SortIcon field="client_name" sortField={sortField} sortDirection={sortDirection} />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                          Summary
                        </span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort('indexing_status')}
                          className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]"
                        >
                          Status <SortIcon field="indexing_status" sortField={sortField} sortDirection={sortDirection} />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--pv-border)]">
                    {filteredAndSorted.map((deployment) => (
                      <tr
                        key={deployment.deployment_id}
                        className="group transition-colors hover:bg-[var(--pv-surface)]"
                      >
                        <td className="px-6 py-4">
                          <Link
                            href={`/dashboard/deployments/${deployment.deployment_id}`}
                            className="text-sm text-[var(--pv-text)] transition-colors hover:text-[var(--pv-primary)]"
                          >
                            {formatDeploymentDateTime(deployment.created_at)}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/dashboard/clients/${deployment.client_id}/websites/${deployment.website_id}`}
                            className="text-sm font-medium text-[var(--pv-text)] transition-colors hover:text-[var(--pv-primary)]"
                          >
                            {deployment.website_title}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/dashboard/clients/${deployment.client_id}`}
                            className="text-sm text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-primary)]"
                          >
                            {deployment.client_name}
                          </Link>
                        </td>
                        <td className="max-w-xs px-6 py-4">
                          <p className="truncate text-sm text-[var(--pv-text-muted)]">
                            {deployment.deploy_summary || '—'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <IndexingBadge status={deployment.indexing_status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="grid gap-4 md:hidden">
            {filteredAndSorted.map((deployment) => (
              <Card key={deployment.deployment_id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <Link
                      href={`/dashboard/deployments/${deployment.deployment_id}`}
                      className="text-sm font-medium text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-primary)]"
                    >
                      {formatDeploymentDateTime(deployment.created_at)}
                    </Link>
                    <IndexingBadge status={deployment.indexing_status} />
                  </div>

                  <Link
                    href={`/dashboard/clients/${deployment.client_id}/websites/${deployment.website_id}`}
                    className="block font-semibold text-[var(--pv-text)] transition-colors hover:text-[var(--pv-primary)]"
                  >
                    {deployment.website_title}
                  </Link>

                  <div className="mt-3 space-y-2 border-t border-[var(--pv-border)] pt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--pv-text-muted)]">Client</span>
                      <Link
                        href={`/dashboard/clients/${deployment.client_id}`}
                        className="text-[var(--pv-text)] transition-colors hover:text-[var(--pv-primary)]"
                      >
                        {deployment.client_name}
                      </Link>
                    </div>

                    {deployment.deploy_summary && (
                      <div className="text-sm">
                        <span className="text-[var(--pv-text-muted)]">Summary</span>
                        <p className="mt-0.5 line-clamp-2 text-[var(--pv-text)]">
                          {deployment.deploy_summary}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
