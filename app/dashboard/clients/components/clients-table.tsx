'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Mail, Eye, Edit3 } from 'lucide-react';
import { ClientStatusBadge } from './client-status-badge';
import { ClientsEmptyState } from './clients-empty-state';
import { Button } from '@/components/ui/button';

interface Client {
  client_id: string;
  firstname: string;
  lastname: string;
  client_email: string | null;
  client_active: boolean | null;
  website_count: number;
  deployment_count_30d: number;
}

interface ClientsTableProps {
  clients: Client[];
}

export function ClientsTable({ clients }: ClientsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Filter clients based on search and status
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const fullName = `${client.firstname || ''} ${client.lastname || ''}`.toLowerCase();
      const email = (client.client_email || '').toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch = fullName.includes(query) || email.includes(query);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && client.client_active === true) ||
        (statusFilter === 'inactive' && client.client_active !== true);

      return matchesSearch && matchesStatus;
    });
  }, [clients, searchQuery, statusFilter]);

  // Show empty state if no clients
  if (clients.length === 0) {
    return <ClientsEmptyState />;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--pv-text-muted)]" />
              <Input
                type="text"
                placeholder="Search clients by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`rounded-pv-sm px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-[var(--pv-primary)] text-white'
                    : 'bg-[var(--pv-surface)] text-[var(--pv-text-muted)] hover:bg-[var(--pv-border)]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`rounded-pv-sm px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === 'active'
                    ? 'bg-[var(--pv-success)] text-white'
                    : 'bg-[var(--pv-surface)] text-[var(--pv-text-muted)] hover:bg-[var(--pv-border)]'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('inactive')}
                className={`rounded-pv-sm px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === 'inactive'
                    ? 'bg-[var(--pv-text-muted)] text-white'
                    : 'bg-[var(--pv-surface)] text-[var(--pv-text-muted)] hover:bg-[var(--pv-border)]'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-[var(--pv-text-muted)]">
            Showing {filteredClients.length} of {clients.length} clients
          </div>
        </CardContent>
      </Card>

      {/* Table / Cards */}
      {filteredClients.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-[var(--pv-text-muted)]">No clients match your search criteria</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--pv-border)] bg-[var(--pv-surface)]">
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                        Client
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider text-[var(--pv-text-muted)]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--pv-border)]">
                    {filteredClients.map((client) => (
                      <tr
                        key={client.client_id}
                        className="group transition-colors hover:bg-[var(--pv-surface)]"
                      >
                        {/* Client Name */}
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-[var(--pv-text)]">
                              {client.firstname && client.lastname
                                ? `${client.firstname} ${client.lastname}`
                                : client.firstname || client.lastname || 'Unnamed Client'}
                            </p>
                            <p className="font-mono text-sm text-[var(--pv-text-muted)]">
                              ID: {client.client_id.slice(0, 8)}...
                            </p>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-[var(--pv-text-muted)]" />
                            <span className="text-[var(--pv-text)]">
                              {client.client_email || 'No email'}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <ClientStatusBadge active={client.client_active} />
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/dashboard/clients/${client.client_id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit3 className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
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
            {filteredClients.map((client) => (
              <Card key={client.client_id} className="overflow-hidden">
                <CardContent className="p-6">
                  {/* Header with Status */}
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-[var(--pv-text)]">
                        {client.firstname && client.lastname
                          ? `${client.firstname} ${client.lastname}`
                          : client.firstname || client.lastname || 'Unnamed Client'}
                      </p>
                      <p className="font-mono text-xs text-[var(--pv-text-muted)]">
                        {client.client_id.slice(0, 8)}...
                      </p>
                    </div>
                    <ClientStatusBadge active={client.client_active} />
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 border-t border-[var(--pv-border)] pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-[var(--pv-text-muted)]" />
                      <span className="text-[var(--pv-text)]">
                        {client.client_email || 'No email'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2 border-t border-[var(--pv-border)] pt-4">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/dashboard/clients/${client.client_id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
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
