'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Mail,
  Plus,
  Loader2,
  Search,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { getCampaignsClient } from '@/lib/api/email-campaigns';
import type { Campaign } from '@/lib/types/email-campaign';
import {
  DELIVERY_STATUS_COLORS,
  TEMPLATE_TYPE_COLORS,
} from '@/lib/types/email-campaign';
import { CampaignDetailModal } from './campaign-detail-modal';

interface CampaignsPageClientProps {
  initialCampaigns: Campaign[];
  initialTotal: number;
}

const DEFAULT_PAGE_SIZE = 20;

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function CampaignsPageClient({
  initialCampaigns,
  initialTotal,
}: CampaignsPageClientProps) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [total, setTotal] = useState(initialTotal);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const isInitialMount = useRef(true);

  const fetchData = useCallback(async (page: number, size: number) => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * size;
      const response = await getCampaignsClient({ limit: size, offset });
      setCampaigns(response.campaigns);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize, fetchData]);

  const filteredCampaigns = useMemo(() => {
    if (!search.trim()) return campaigns;
    const q = search.toLowerCase();
    return campaigns.filter(
      (c) =>
        (c.subject || '').toLowerCase().includes(q) ||
        (c.sent_by || '').toLowerCase().includes(q),
    );
  }, [campaigns, search]);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Empty state
  if (total === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div
          className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(63, 0, 233, 0.1), rgba(201, 71, 255, 0.05))',
            border: '1px solid rgba(63, 0, 233, 0.15)',
          }}
        >
          <Mail className="h-6 w-6" style={{ color: 'var(--pv-primary)' }} />
        </div>
        <h2
          className="mb-1 text-lg font-semibold"
          style={{ color: 'var(--pv-text)' }}
        >
          No campaigns yet
        </h2>
        <p
          className="mb-6 text-sm"
          style={{ color: 'var(--pv-text-muted)' }}
        >
          Send your first email campaign to Domani users.
        </p>
        <Link href="/dashboard/domani/campaigns/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--pv-text)' }}
          >
            Campaigns
          </h1>
          <p className="text-sm" style={{ color: 'var(--pv-text-muted)' }}>
            Email campaign history for Domani users
          </p>
        </div>
        <Link href="/dashboard/domani/campaigns/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <div className="relative" style={{ maxWidth: '320px' }}>
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: 'var(--pv-text-muted)' }}
          />
          <Input
            placeholder="Search by subject or sender..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-lg border-none pl-10 text-sm shadow-none"
            style={{ background: 'var(--pv-surface)', color: 'var(--pv-text)' }}
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--pv-primary)]" />
          <span className="ml-2 text-sm text-[var(--pv-text-muted)]">
            Loading campaigns...
          </span>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div
          className="py-16 text-center text-sm"
          style={{ color: 'var(--pv-text-muted)' }}
        >
          No campaigns match your search.
        </div>
      ) : (
        <>
          {/* Table */}
          <div
            className="overflow-hidden rounded-xl"
            style={{
              background: 'var(--pv-surface)',
              boxShadow:
                '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className="text-left text-xs font-medium"
                    style={{
                      color: 'var(--pv-text-muted)',
                      borderBottom: '1px solid var(--pv-border)',
                    }}
                  >
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Subject</th>
                    <th className="px-5 py-3.5">Type</th>
                    <th className="px-5 py-3.5 text-center">Recipients</th>
                    <th className="px-5 py-3.5 text-center">Sent</th>
                    <th className="px-5 py-3.5 text-center">Failed</th>
                    <th className="px-5 py-3.5">Sent By</th>
                    <th className="w-10 px-3 py-3.5" />
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map((campaign) => {
                    const templateConfig = TEMPLATE_TYPE_COLORS[
                      campaign.template_type
                    ] ?? {
                      label:
                        (campaign.template_type || 'custom')
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, (c) => c.toUpperCase()),
                      color: 'text-gray-600 dark:text-gray-400',
                      bgColor: 'bg-gray-100 dark:bg-gray-800/50',
                    };

                    return (
                      <tr
                        key={campaign.id}
                        onClick={() => setSelectedCampaign(campaign)}
                        className="cursor-pointer text-sm transition-colors hover:bg-[var(--pv-bg)]"
                        style={{
                          borderBottom: '1px solid var(--pv-border)',
                        }}
                      >
                        <td
                          className="whitespace-nowrap px-5 py-3.5"
                          style={{ color: 'var(--pv-text-muted)' }}
                        >
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                            {formatDate(campaign.created_at)}
                          </div>
                        </td>
                        <td
                          className="max-w-[280px] truncate px-5 py-3.5 font-medium"
                          style={{ color: 'var(--pv-text)' }}
                        >
                          {campaign.subject}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                              templateConfig.color,
                              templateConfig.bgColor,
                            )}
                          >
                            {templateConfig.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <div
                            className="flex items-center justify-center gap-1.5"
                            style={{ color: 'var(--pv-text)' }}
                          >
                            <Users className="h-3.5 w-3.5 text-[var(--pv-text-muted)]" />
                            {campaign.recipient_count}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                              DELIVERY_STATUS_COLORS.success.color,
                              DELIVERY_STATUS_COLORS.success.bgColor,
                            )}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            {campaign.successful}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          {campaign.failed > 0 ? (
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                                DELIVERY_STATUS_COLORS.failed.color,
                                DELIVERY_STATUS_COLORS.failed.bgColor,
                              )}
                            >
                              <XCircle className="h-3 w-3" />
                              {campaign.failed}
                            </span>
                          ) : (
                            <span
                              className="text-xs"
                              style={{ color: 'var(--pv-text-muted)' }}
                            >
                              —
                            </span>
                          )}
                        </td>
                        <td
                          className="max-w-[160px] truncate px-5 py-3.5 text-xs"
                          style={{ color: 'var(--pv-text-muted)' }}
                        >
                          {campaign.sent_by}
                        </td>
                        <td className="px-3 py-3.5">
                          <ChevronRight
                            className="h-4 w-4"
                            style={{ color: 'var(--pv-text-muted)' }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalItems={total}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[10, 20, 50]}
            />
          </div>
        </>
      )}

      {/* Detail Modal */}
      <CampaignDetailModal
        campaign={selectedCampaign}
        isOpen={selectedCampaign !== null}
        onClose={() => setSelectedCampaign(null)}
      />
    </>
  );
}
