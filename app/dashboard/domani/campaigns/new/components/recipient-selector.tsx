'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Search, Loader2, Check } from 'lucide-react';
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
import type { UserProfile, SignupCohort } from '@/lib/types/domani-users';
import { COHORT_COLORS } from '@/lib/types/domani-users';
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
  const [cohortFilter, setCohortFilter] = useState<SignupCohort | 'all'>('all');
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

  const filteredUsers = useMemo(() => {
    let result = users;

    if (cohortFilter !== 'all') {
      result = result.filter((u) => u.signup_cohort === cohortFilter);
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
  }, [users, cohortFilter, search]);

  const allFilteredSelected =
    filteredUsers.length > 0 && filteredUsers.every((u) => selectedIds.has(u.id));
  const someFilteredSelected =
    filteredUsers.some((u) => selectedIds.has(u.id)) && !allFilteredSelected;

  const toggleAll = () => {
    if (allFilteredSelected) {
      const next = new Set(selectedIds);
      filteredUsers.forEach((u) => next.delete(u.id));
      onSelectionChange(next);
    } else {
      const next = new Set(selectedIds);
      filteredUsers.forEach((u) => next.add(u.id));
      onSelectionChange(next);
    }
  };

  const toggleUser = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      {/* Filter bar + count */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1" style={{ maxWidth: '320px' }}>
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: 'var(--pv-text-muted)' }}
          />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-lg border-none pl-10 text-sm shadow-none"
            style={{ background: 'var(--pv-bg)', color: 'var(--pv-text)' }}
          />
        </div>
        <Select value={cohortFilter} onValueChange={(v) => setCohortFilter(v as SignupCohort | 'all')}>
          <SelectTrigger
            className="h-9 w-[160px] rounded-lg border-none text-sm shadow-none"
            style={{ background: 'var(--pv-bg)', color: 'var(--pv-text-muted)' }}
          >
            <SelectValue placeholder="All cohorts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cohorts</SelectItem>
            <SelectItem value="friends_family">Friends & Family</SelectItem>
            <SelectItem value="early_adopter">Early Adopter</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-4">
          <span className="text-xs" style={{ color: 'var(--pv-text-muted)' }}>
            {filteredUsers.length} of {total} shown
          </span>
          <span className="text-xs" style={{ color: 'var(--pv-text-muted)' }}>
            <strong style={{ color: 'var(--pv-primary)' }}>{selectedIds.size}</strong> selected
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
          className="max-h-[420px] overflow-y-auto rounded-xl"
          style={{ background: 'var(--pv-bg)' }}
        >
          <table className="w-full">
            <thead>
              <tr
                className="sticky top-0 text-left text-xs font-medium"
                style={{
                  background: 'var(--pv-bg)',
                  color: 'var(--pv-text-muted)',
                }}
              >
                <th className="w-10 px-4 py-3">
                  <button
                    onClick={toggleAll}
                    className={cn(
                      'flex h-[18px] w-[18px] items-center justify-center rounded transition-all',
                      allFilteredSelected
                        ? 'bg-[var(--pv-primary)] text-white'
                        : someFilteredSelected
                          ? 'border-2 border-[var(--pv-primary)]'
                          : 'border border-[var(--pv-border)] hover:border-[var(--pv-text-muted)]',
                    )}
                    title={allFilteredSelected ? 'Deselect all' : 'Select all'}
                  >
                    {allFilteredSelected && (
                      <Check className="h-3 w-3" strokeWidth={3} />
                    )}
                    {someFilteredSelected && !allFilteredSelected && (
                      <div
                        className="h-0.5 w-2 rounded-full"
                        style={{ background: 'var(--pv-primary)' }}
                      />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Cohort</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isSelected = selectedIds.has(user.id);
                const cohortConfig = COHORT_COLORS[user.signup_cohort] ?? {
                  label: user.signup_cohort || 'Unknown',
                  color: 'text-gray-600 dark:text-gray-400',
                  bgColor: 'bg-gray-100 dark:bg-gray-800/50',
                };
                return (
                  <tr
                    key={user.id}
                    onClick={() => toggleUser(user.id)}
                    className={cn(
                      'cursor-pointer text-sm transition-colors',
                      isSelected
                        ? 'bg-[var(--pv-primary)]/5'
                        : 'hover:bg-[var(--pv-surface)]',
                    )}
                  >
                    <td className="px-4 py-3">
                      <div
                        className={cn(
                          'flex h-[18px] w-[18px] items-center justify-center rounded transition-all',
                          isSelected
                            ? 'bg-[var(--pv-primary)] text-white'
                            : 'border border-[var(--pv-border)]',
                        )}
                      >
                        {isSelected && (
                          <Check className="h-3 w-3" strokeWidth={3} />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--pv-text)' }}>
                      {user.full_name || 'No name'}
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--pv-text-muted)' }}>
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                          cohortConfig.color,
                          cohortConfig.bgColor,
                        )}
                      >
                        {cohortConfig.label}
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
        <div className="flex items-center justify-center gap-2 pt-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-xs" style={{ color: 'var(--pv-text-muted)' }}>
            {page} / {totalPages}
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
