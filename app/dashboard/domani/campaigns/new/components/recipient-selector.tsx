'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Search, Loader2, CheckSquare, Square, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { UserProfile, UserTier } from '@/lib/types/domani-users';
import { TIER_COLORS } from '@/lib/types/domani-users';
import { getDomaniUsers } from '@/lib/api/domani-users';

interface RecipientSelectorProps {
  initialUsers: UserProfile[];
  initialTotal: number;
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
}

export function RecipientSelector({
  initialUsers,
  initialTotal,
  selectedIds,
  onSelectionChange,
}: RecipientSelectorProps) {
  const [users, setUsers] = useState(initialUsers);
  const [total, setTotal] = useState(initialTotal);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<UserTier | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const isInitialMount = useRef(true);

  const fetchUsers = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    try {
      const response = await getDomaniUsers({
        limit: pageSize,
        offset: (pageNum - 1) * pageSize,
        include_deleted: false,
      });
      setUsers(response.items);
      setTotal(response.total);
    } catch {
      console.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchUsers(page);
  }, [page, fetchUsers]);

  // Client-side filtering on current page
  const filteredUsers = useMemo(() => {
    let result = users;

    if (tierFilter !== 'all') {
      result = result.filter((u) => u.tier === tierFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          (u.email || '').toLowerCase().includes(q) ||
          (u.full_name || '').toLowerCase().includes(q),
      );
    }

    return result;
  }, [users, tierFilter, search]);

  const toggleUser = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
  };

  const selectAllFiltered = () => {
    const next = new Set(selectedIds);
    filteredUsers.forEach((u) => next.add(u.id));
    onSelectionChange(next);
  };

  const deselectAll = () => {
    onSelectionChange(new Set());
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1" style={{ minWidth: '200px' }}>
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: 'var(--pv-text-muted)' }}
          />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={tierFilter} onValueChange={(v) => setTierFilter(v as UserTier | 'all')}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All tiers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tiers</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="lifetime">Lifetime</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk actions + count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={selectAllFiltered}>
            <CheckSquare className="mr-1.5 h-4 w-4" />
            Select all ({filteredUsers.length})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={deselectAll}
            disabled={selectedIds.size === 0}
          >
            <Square className="mr-1.5 h-4 w-4" />
            Deselect all
          </Button>
        </div>
        <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--pv-text-muted)' }}>
          <Users className="h-4 w-4" />
          <span>
            <strong style={{ color: 'var(--pv-text)' }}>{selectedIds.size}</strong> of {total} selected
          </span>
        </div>
      </div>

      {/* User list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--pv-primary)]" />
          <span className="ml-2 text-sm" style={{ color: 'var(--pv-text-muted)' }}>
            Loading users...
          </span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-12 text-center text-sm" style={{ color: 'var(--pv-text-muted)' }}>
          No users found matching your filters.
        </div>
      ) : (
        <div
          className="max-h-[360px] overflow-y-auto rounded-lg border"
          style={{ borderColor: 'var(--pv-border)' }}
        >
          <table className="w-full">
            <thead>
              <tr
                className="sticky top-0 text-left text-xs font-medium"
                style={{
                  background: 'var(--pv-surface)',
                  color: 'var(--pv-text-muted)',
                  borderBottom: '1px solid var(--pv-border)',
                }}
              >
                <th className="w-10 px-3 py-2.5" />
                <th className="px-3 py-2.5">Name</th>
                <th className="px-3 py-2.5">Email</th>
                <th className="px-3 py-2.5">Tier</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isSelected = selectedIds.has(user.id);
                const tierConfig = TIER_COLORS[user.tier];
                return (
                  <tr
                    key={user.id}
                    onClick={() => toggleUser(user.id)}
                    className={cn(
                      'cursor-pointer text-sm transition-colors',
                      isSelected
                        ? 'bg-[var(--pv-primary)]/5'
                        : 'hover:bg-[var(--pv-bg)]',
                    )}
                    style={{ borderBottom: '1px solid var(--pv-border)' }}
                  >
                    <td className="px-3 py-2.5">
                      <div
                        className={cn(
                          'flex h-5 w-5 items-center justify-center rounded border transition-colors',
                          isSelected
                            ? 'border-[var(--pv-primary)] bg-[var(--pv-primary)] text-white'
                            : 'border-[var(--pv-border)]',
                        )}
                      >
                        {isSelected && (
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-medium" style={{ color: 'var(--pv-text)' }}>
                      {user.full_name || 'No name'}
                    </td>
                    <td className="px-3 py-2.5" style={{ color: 'var(--pv-text-muted)' }}>
                      {user.email}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                          tierConfig.color,
                          tierConfig.bgColor,
                        )}
                      >
                        {tierConfig.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm" style={{ color: 'var(--pv-text-muted)' }}>
            Page {page} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
