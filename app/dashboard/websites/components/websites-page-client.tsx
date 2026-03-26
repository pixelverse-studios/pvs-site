'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Search,
  Globe,
  ExternalLink,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/types/project';
import type { ProjectStatus } from '@/lib/types/project';
import { formatRelativeTime } from '@/lib/types/project';
import type { FlattenedWebsite } from '../page';

type SortField = 'website_title' | 'client_name' | 'status' | 'recent_deploy_count' | 'domain';
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | 'active' | 'deployed' | 'development' | 'other';

interface WebsitesPageClientProps {
  websites: FlattenedWebsite[];
}

export function WebsitesPageClient({ websites }: WebsitesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortField, setSortField] = useState<SortField>('website_title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = websites;

    // Search
    if (searchQuery) {
      const query = (searchQuery || '').toLowerCase();
      result = result.filter(
        (w) =>
          (w.website_title || '').toLowerCase().includes(query) ||
          (w.client_name || '').toLowerCase().includes(query) ||
          (w.domain || '').toLowerCase().includes(query),
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((w) => {
        switch (statusFilter) {
          case 'active':
            return ['deployed', 'maintenance'].includes(w.status);
          case 'deployed':
            return w.status === 'deployed';
          case 'development':
            return ['planning', 'development', 'review', 'qa', 'staging'].includes(w.status);
          case 'other':
            return ['lead', 'discovery', 'proposal', 'negotiation', 'won', 'lost', 'on_hold', 'archived'].includes(w.status);
          default:
            return true;
        }
      });
    }

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'website_title':
          comparison = (a.website_title || '').localeCompare(b.website_title || '');
          break;
        case 'client_name':
          comparison = (a.client_name || '').localeCompare(b.client_name || '');
          break;
        case 'status':
          comparison = (a.status || '').localeCompare(b.status || '');
          break;
        case 'recent_deploy_count':
          comparison = a.recent_deploy_count - b.recent_deploy_count;
          break;
        case 'domain':
          comparison = (a.domain || '').localeCompare(b.domain || '');
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [websites, searchQuery, statusFilter, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5" />
    );
  };

  if (websites.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1
            className="font-heading text-2xl font-bold md:text-3xl"
            style={{ color: 'var(--pv-text)' }}
          >
            Websites
          </h1>
          <p className="text-sm" style={{ color: 'var(--pv-text-muted)' }}>
            All managed websites across clients
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Globe className="mb-4 h-12 w-12 text-[var(--pv-text-muted)]" />
            <p className="text-lg font-medium text-[var(--pv-text)]">No websites yet</p>
            <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
              Websites will appear here once added to client accounts.
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
          Websites
        </h1>
        <p className="text-sm" style={{ color: 'var(--pv-text-muted)' }}>
          {websites.length} website{websites.length !== 1 ? 's' : ''} across all clients
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
                placeholder="Search by name, client, or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  ['all', 'All'],
                  ['active', 'Active'],
                  ['development', 'In Progress'],
                  ['other', 'Other'],
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
            Showing {filteredAndSorted.length} of {websites.length} websites
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredAndSorted.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-[var(--pv-text-muted)]">No websites match your search criteria</p>
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
                          onClick={() => handleSort('website_title')}
                          className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]"
                        >
                          Website <SortIcon field="website_title" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort('client_name')}
                          className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]"
                        >
                          Client <SortIcon field="client_name" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort('domain')}
                          className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]"
                        >
                          Domain <SortIcon field="domain" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={() => handleSort('status')}
                          className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]"
                        >
                          Status <SortIcon field="status" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleSort('recent_deploy_count')}
                          className="ml-auto flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]"
                        >
                          Deploys (30d) <SortIcon field="recent_deploy_count" />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--pv-border)]">
                    {filteredAndSorted.map((website) => (
                      <tr
                        key={website.website_id}
                        className="group transition-colors hover:bg-[var(--pv-surface)]"
                      >
                        <td className="px-6 py-4">
                          <Link
                            href={`/dashboard/clients/${website.client_id}/websites/${website.website_id}`}
                            className="font-medium text-[var(--pv-text)] transition-colors hover:text-[var(--pv-primary)]"
                          >
                            {website.website_title}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/dashboard/clients/${website.client_id}`}
                            className="text-sm text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-primary)]"
                          >
                            {website.client_name}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          {website.domain ? (
                            <a
                              href={`https://${website.domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-primary)]"
                            >
                              {website.domain}
                              <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                            </a>
                          ) : (
                            <span className="text-sm text-[var(--pv-text-muted)]">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={website.status as ProjectStatus} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm">
                            <span className="font-medium text-[var(--pv-text)]">
                              {website.recent_deploy_count}
                            </span>
                            {website.last_deploy_date && (
                              <span className="ml-2 text-[var(--pv-text-muted)]">
                                Last {formatRelativeTime(website.last_deploy_date)}
                              </span>
                            )}
                          </div>
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
            {filteredAndSorted.map((website) => (
              <Card key={website.website_id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <Link
                      href={`/dashboard/clients/${website.client_id}/websites/${website.website_id}`}
                      className="font-semibold text-[var(--pv-text)] transition-colors hover:text-[var(--pv-primary)]"
                    >
                      {website.website_title}
                    </Link>
                    <StatusBadge status={website.status as ProjectStatus} />
                  </div>

                  <div className="space-y-2 border-t border-[var(--pv-border)] pt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--pv-text-muted)]">Client</span>
                      <Link
                        href={`/dashboard/clients/${website.client_id}`}
                        className="text-[var(--pv-text)] transition-colors hover:text-[var(--pv-primary)]"
                      >
                        {website.client_name}
                      </Link>
                    </div>

                    {website.domain && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--pv-text-muted)]">Domain</span>
                        <a
                          href={`https://${website.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[var(--pv-text)] transition-colors hover:text-[var(--pv-primary)]"
                        >
                          {website.domain}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--pv-text-muted)]">Deploys (30d)</span>
                      <span className="text-[var(--pv-text)]">
                        {website.recent_deploy_count}
                        {website.last_deploy_date && (
                          <span className="ml-1 text-[var(--pv-text-muted)]">
                            ({formatRelativeTime(website.last_deploy_date)})
                          </span>
                        )}
                      </span>
                    </div>
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

function StatusBadge({ status }: { status: ProjectStatus }) {
  const label = STATUS_LABELS[status] || status;
  const color = STATUS_COLORS[status] || '#6b7280';

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        background: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}
