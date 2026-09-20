'use client';

import React, { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { getDomaniUser, UsersRequestError } from '@/lib/api/domani-users';
import type { UserProfile } from '@/lib/types/domani-users';
import { ExactDate } from './users-table';

const display = (value?: string | null) => (value ? value.replaceAll('_', ' ') : 'Not recorded');
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-[var(--pv-text-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm">{children}</dd>
    </div>
  );
}
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 border-t border-[var(--pv-border)] pt-5">
      <h3 className="text-base font-semibold">{title}</h3>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

export function UserDetailDrawer({
  id,
  onClose,
  returnFocus,
}: {
  id: string | null;
  onClose: () => void;
  returnFocus: () => void;
}) {
  return (
    <Sheet
      open={!!id}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocus();
        }}
        className="block w-full overflow-y-auto motion-reduce:animate-none sm:w-3/4 sm:max-w-none lg:w-1/2 lg:max-w-none xl:max-w-none"
      >
        <SheetHeader className="mb-6 pr-10">
          <SheetTitle>User details</SheetTitle>
          <SheetDescription>
            Account, login and historical device context. All timestamps are UTC.
          </SheetDescription>
        </SheetHeader>
        {id && <UserDetailContent key={id} id={id} />}
      </SheetContent>
    </Sheet>
  );
}

function UserDetailContent({ id }: { id: string }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<{ status: number; message: string } | null>(null);
  const [revision, setRevision] = useState(0);
  const [copy, setCopy] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setUser(null);
    setError(null);
    getDomaniUser(id, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setUser(result);
      })
      .catch((failure) => {
        if (!controller.signal.aborted)
          setError({
            status: failure instanceof UsersRequestError ? failure.status : 503,
            message: failure instanceof Error ? failure.message : 'User details unavailable.',
          });
      });
    return () => controller.abort();
  }, [id, revision]);
  if (error)
    return (
      <div role="alert" className="space-y-4">
        <h3 className="font-semibold">
          {error.status === 404
            ? 'User not found'
            : error.status === 403
              ? 'Staff access required'
              : error.status === 401
                ? 'Session expired'
                : 'User details unavailable'}
        </h3>
        <p className="text-sm">
          {error.status === 404
            ? 'This user may have been removed. Close this drawer to return to the table.'
            : error.message}
        </p>
        {error.status === 401 ? (
          <a href="/login" className="underline">
            Sign in
          </a>
        ) : (
          ![403, 404].includes(error.status) && (
            <Button variant="outline" onClick={() => setRevision((v) => v + 1)}>
              Retry details
            </Button>
          )
        )}
      </div>
    );
  if (!user) return <p role="status">Loading user details…</p>;
  const device = user.latest_device_observation;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="break-words text-xl font-semibold">
          {user.full_name || 'Name not recorded'}
        </h2>
        <p className="mt-1 break-all text-sm text-[var(--pv-text-muted)]">
          {user.email || 'Email not recorded'}
        </p>
      </div>
      <Group title="Identity and account">
        <Field label="User ID">
          <span className="break-all font-mono">{user.id}</span>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(user.id);
                setCopy('User ID copied');
              } catch {
                setCopy('Could not copy. Select the user ID above to copy it manually.');
              }
            }}
          >
            Copy user ID
          </Button>
          <span role="status" className="block text-xs">
            {copy}
          </span>
        </Field>
        <Field label="Account status">
          {display(user.account_status)}
          <span className="mt-1 block text-xs text-[var(--pv-text-muted)]">
            Account state does not indicate recent use.
          </span>
        </Field>
        <Field label="Email verification">{display(user.email_verification_status)}</Field>
        <Field label="Email confirmed">
          <ExactDate value={user.email_confirmed_at} />
        </Field>
        <Field label="Cohort">{display(user.signup_cohort)}</Field>
        <Field label="Timezone">{display(user.timezone)}</Field>
        <Field label="Deletion requested">
          <ExactDate value={user.deleted_at} />
        </Field>
        <Field label="Deletion scheduled">
          <ExactDate value={user.deletion_scheduled_for} />
        </Field>
      </Group>
      <Group title="Joined and login">
        <Field label="Account joined">
          <ExactDate value={user.joined_at} />
        </Field>
        <Field label="Profile created">
          <ExactDate value={user.profile_created_at} />
        </Field>
        <Field label="Original signup method">{display(user.signup_method)}</Field>
        <Field label="Linked login providers">
          {user.login_providers?.length ? user.login_providers.join(', ') : 'Not recorded'}
        </Field>
        <Field label="Last successful sign-in">
          <ExactDate value={user.last_sign_in_at} />
        </Field>
      </Group>
      <Group title="App activity">
        <Field label="Last recorded app activity">
          <ExactDate value={user.last_active_at} />
        </Field>
        <Field label="Observation source">{display(user.activity_source)}</Field>
        <div className="text-xs text-[var(--pv-text-muted)] sm:col-span-2">
          Missing observations do not mean the user has never used the app. Sign-in is separate from
          app activity.
        </div>
      </Group>
      <Group title="Last reported device">
        {device ? (
          <>
            <Field label="Device">
              {[device.device_brand, device.device_model].filter(Boolean).join(' ') ||
                'Not recorded'}
            </Field>
            <Field label="Platform">{display(device.platform)}</Field>
            <Field label="OS version">{display(device.os_version)}</Field>
            <Field label="App version / build">
              {display(device.app_version)} / {display(device.app_build)}
            </Field>
            <Field label="Reported at">
              <ExactDate value={device.observed_at} />
            </Field>
            <Field label="Source">{display(device.source)}</Field>
          </>
        ) : (
          <p className="text-sm">No device observations recorded.</p>
        )}
        <div className="text-xs text-[var(--pv-text-muted)] sm:col-span-2">
          Only the latest feedback/support snapshot is available. This is not a current device
          inventory or complete login history.
        </div>
      </Group>
      <section className="space-y-3 border-t border-[var(--pv-border)] pt-5">
        <h3 className="text-base font-semibold">Related feedback</h3>
        <p className="text-sm">
          {typeof user.feedback_count === 'number'
            ? `${user.feedback_count} feedback and support submissions linked to this user ID.`
            : 'Submission count unavailable.'}
        </p>
        <a
          href={`/dashboard/domani/feedback?user_id=${encodeURIComponent(user.id)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-[var(--pv-primary)] underline"
        >
          View this user’s feedback (opens a new tab)
        </a>
      </section>
      <p className="text-xs text-[var(--pv-text-muted)]">
        Data as of <ExactDate value={user.data_as_of} />
      </p>
    </div>
  );
}
