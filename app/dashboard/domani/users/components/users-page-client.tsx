'use client';
import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getDomaniUsers, UsersRequestError } from '@/lib/api/domani-users';
import type { UsersListResponse, UsersQueryParams, UserSort } from '@/lib/types/domani-users';
import { UsersToolbar } from './users-toolbar';
import { UsersTable, USER_COLUMNS, DEFAULT_COLUMNS, type UserColumn } from './users-table';
import { Pagination } from '@/app/dashboard/domani/components/domani-pagination';
import { Button, Checkbox, Popover, Select } from '@mantine/core';
import { selectClassNames } from '../../components/domani-controls';
import { UserDetailDrawer } from './user-detail-drawer';
const initialQuery: UsersQueryParams = {
  limit: 50,
  offset: 0,
  sort_by: 'joined_at',
  sort_order: 'desc',
};
export function UsersPageClient() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const workspace = useRef<HTMLDivElement | null>(null);
  const detailTrigger = useRef<HTMLButtonElement | null>(null);
  const [query, setQuery] = useState(initialQuery),
    [result, setResult] = useState<UsersListResponse | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState<{ message: string; status: number; code?: string } | null>(null),
    [revision, setRevision] = useState(0);
  const [actor, setActor] = useState<string | null>(null),
    [columns, setColumns] = useState<UserColumn[]>(DEFAULT_COLUMNS);
  const actorRef = useRef<string | null>(null);
  useEffect(() => {
    const { data } = createClient().auth.onAuthStateChange((_event, session) => {
      const nextActor = session?.user.id || null;
      const changed = actorRef.current !== nextActor;
      if (changed) {
        setResult(null);
        setSelectedUser(null);
      }
      actorRef.current = nextActor;
      setActor(nextActor);
      if (changed || !session)
        setError(
          session
            ? null
            : { message: 'Your session has expired. Please sign in again.', status: 401 },
        );
    });
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    setColumns(DEFAULT_COLUMNS);
    if (!actor) return;
    try {
      const saved = JSON.parse(localStorage.getItem(`domani-users-columns:${actor}`) || 'null');
      if (Array.isArray(saved))
        setColumns(Object.keys(USER_COLUMNS).filter((c) => saved.includes(c)) as UserColumn[]);
    } catch {
      /* Corrupt/unavailable preferences use defaults. */
    }
  }, [actor]);
  const toggleColumn = (column: UserColumn) => {
    const next = Object.keys(USER_COLUMNS).filter((c) =>
      c === column ? !columns.includes(column) : columns.includes(c as UserColumn),
    ) as UserColumn[];
    setColumns(next);
    if (actor)
      try {
        localStorage.setItem(`domani-users-columns:${actor}`, JSON.stringify(next));
      } catch {
        /* Preferences are optional. */
      }
  };
  useEffect(() => {
    if (!actor) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      void getDomaniUsers(query, controller.signal)
        .then((data) => {
          if (!controller.signal.aborted && actorRef.current === actor) setResult(data);
        })
        .catch((e) => {
          if (!controller.signal.aborted) {
            setResult(null);
            setError({
              message: e instanceof Error ? e.message : 'User insights unavailable.',
              status: e instanceof UsersRequestError ? e.status : 503,
              code: e instanceof UsersRequestError ? e.code : undefined,
            });
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, actor, revision]);
  useEffect(() => {
    const node = workspace.current;
    if (!node) return;
    const measure = () => {
      const top = node.getBoundingClientRect().top + window.scrollY;
      node.style.height = `${Math.max(440, window.innerHeight - top - 16)}px`;
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    if (node.parentElement) observer?.observe(node.parentElement);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);
  return (
    <div ref={workspace} className="flex min-h-[440px] min-w-0 flex-col gap-3">
      <UsersToolbar query={query} onChange={setQuery} />
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div role="status" className="text-sm text-[var(--pv-text-muted)]">
          {loading ? (
            'Loading users…'
          ) : result ? (
            <>
              <strong className="text-[var(--pv-text)]">{result.total}</strong> matching users
              <span className="hidden text-xs sm:inline">
                {' '}
                · {result.stats.active_30d} with recorded activity in 30 days ·{' '}
                {result.stats.activity_unknown} activity not recorded
              </span>
            </>
          ) : (
            'User counts unavailable'
          )}
        </div>
        <div className="relative flex max-w-full flex-wrap items-center gap-2">
          <Select
            aria-label="Sort users by"
            classNames={selectClassNames}
            value={query.sort_by}
            allowDeselect={false}
            data={Object.entries({
              joined_at: 'Joined',
              last_sign_in_at: 'Last sign-in',
              last_active_at: 'Last app activity',
              email: 'Email',
              full_name: 'Name',
              account_status: 'Account status',
            }).map(([value, label]) => ({ value, label }))}
            onChange={(value) =>
              value && setQuery({ ...query, sort_by: value as UserSort, offset: 0 })
            }
          />
          <Button
            variant="outline"
            className="h-9 px-3"
            aria-label="Toggle sort direction"
            title={
              query.sort_order === 'asc'
                ? 'Ascending; switch to descending'
                : 'Descending; switch to ascending'
            }
            onClick={() =>
              setQuery({
                ...query,
                sort_order: query.sort_order === 'asc' ? 'desc' : 'asc',
                offset: 0,
              })
            }
          >
            <span className="sm:hidden" aria-hidden="true">
              {query.sort_order === 'asc' ? '↑' : '↓'}
            </span>
            <span className="hidden sm:inline">
              {query.sort_order === 'asc' ? 'Ascending' : 'Descending'}
            </span>
          </Button>
          <Popover position="bottom-end" width={256} trapFocus returnFocus withArrow shadow="md">
            <Popover.Target>
              <Button variant="outline">Columns</Button>
            </Popover.Target>
            <Popover.Dropdown
              className="max-h-[50dvh] overflow-y-auto"
              style={{ background: 'var(--pv-bg)', color: 'var(--pv-text)' }}
            >
              <p className="mb-2 text-xs text-[var(--pv-text-muted)]">
                Saved for your staff account
              </p>
              {Object.entries(USER_COLUMNS).map(([key, label]) => (
                <Checkbox
                  key={key}
                  className="py-1.5"
                  label={label}
                  checked={columns.includes(key as UserColumn)}
                  onChange={() => toggleColumn(key as UserColumn)}
                />
              ))}
            </Popover.Dropdown>
          </Popover>
        </div>
      </div>
      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-6"
        >
          <h2 className="font-semibold">
            {error.code === 'ORIGIN_NOT_ALLOWED'
              ? 'Local API configuration required'
              : error.status === 403
                ? 'Staff access required'
                : error.status === 401
                  ? 'Session expired'
                  : 'Users unavailable'}
          </h2>
          <p className="my-3 text-sm">{error.message}</p>
          {error.status === 401 ? (
            <a className="text-[var(--pv-primary)] underline" href="/login">
              Sign in
            </a>
          ) : error.code !== 'STAFF_ACCESS_REQUIRED' ? (
            <Button variant="outline" onClick={() => setRevision((v) => v + 1)}>
              Retry
            </Button>
          ) : null}
        </div>
      ) : result ? (
        <div aria-busy={loading} className="flex min-h-0 flex-1 flex-col gap-2">
          <UsersTable
            items={result.items}
            columns={columns}
            onOpen={(id, trigger) => {
              detailTrigger.current = trigger;
              setSelectedUser(id);
            }}
          />
          <div className="shrink-0">
            <Pagination
              className="gap-2"
              currentPage={Math.floor((query.offset || 0) / (query.limit || 50)) + 1}
              totalItems={result.total}
              pageSize={query.limit || 50}
              onPageChange={(p) => setQuery({ ...query, offset: (p - 1) * (query.limit || 50) })}
              onPageSizeChange={(limit) => setQuery({ ...query, limit, offset: 0 })}
            />
          </div>
          <p className="shrink-0 text-xs text-[var(--pv-text-muted)]">
            Data as of {new Date(result.data_as_of).toUTCString()}
          </p>
        </div>
      ) : (
        <div
          aria-busy={loading}
          className="rounded-xl border border-[var(--pv-border)] p-12 text-center text-sm text-[var(--pv-text-muted)]"
        >
          Loading user insights…
        </div>
      )}
      <UserDetailDrawer
        id={selectedUser}
        onClose={() => setSelectedUser(null)}
        returnFocus={() => {
          if (detailTrigger.current?.isConnected) detailTrigger.current.focus();
        }}
      />
    </div>
  );
}
