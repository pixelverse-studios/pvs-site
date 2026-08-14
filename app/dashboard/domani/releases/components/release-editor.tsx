'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Checkbox, Select, Switch, Textarea as MantineTextarea, TextInput } from '@mantine/core';
import { DateInput, MonthPickerInput } from '@mantine/dates';
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  archiveReleaseNote,
  createRelease,
  createReleaseNote,
  getRelease,
  getReleaseCapabilities,
  ReleaseApiError,
  reorderReleaseNotes,
  runReleaseAction,
  updateRelease,
  updateReleaseNote,
} from '@/lib/api/admin-releases';
import type {
  AdminReleaseDetail,
  AdminReleaseNote,
  CreateReleaseInput,
  ReleaseLifecycle,
  ReleaseNoteType,
  ReleasePlatform,
} from '@/lib/types/admin-release';
import { cn } from '@/lib/utils';
import {
  lifecycleLabels,
  panelClass,
  PlatformBadge,
  ReleaseBadge,
  visibilityLabels,
} from './release-ui';
import { PublicOverviewEditor } from './public-overview-editor';
import {
  emptyReleaseForm,
  emptyPublicOverview,
  deriveReleaseType,
  firstFieldError,
  lifecycleOptions,
  noteFormError,
  publicationReadiness,
  releaseFormError,
  releaseTypeLabel,
  wouldRemoveLastPublicNote,
  type ReleaseFormState,
} from './release-rules';

const fieldClass = 'space-y-2';
const labelClass =
  'block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--pv-text-muted)]';
const mantineFieldClassNames = {
  input:
    'border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-text)] placeholder:text-[var(--pv-text-muted)] focus:border-[var(--pv-primary)]',
  error: 'text-xs text-red-600 dark:text-red-300',
};
const mantineSelectClassNames = {
  ...mantineFieldClassNames,
  dropdown: 'border-[var(--pv-border)] bg-[var(--pv-bg)] text-[var(--pv-text)]',
  option: 'text-sm data-[checked]:bg-violet-100 data-[checked]:text-violet-800',
};
const noteTypeOptions = ['feature', 'improvement', 'fix', 'breaking'].map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

type ReleaseAction =
  | 'mark-released'
  | 'publish-preview'
  | 'return-to-private'
  | 'publish'
  | 'unpublish'
  | 'archive';

interface ConflictState {
  message: string;
  latest: AdminReleaseDetail | null;
  latestError: string | null;
}

const actionCopy: Record<ReleaseAction, { title: string; description: string; confirm: string }> = {
  'mark-released': {
    title: 'Mark this release as released?',
    description: 'This records the release date and moves the lifecycle to Released.',
    confirm: 'Mark released',
  },
  'publish-preview': {
    title: 'Publish this coming-soon preview?',
    description:
      'The public summary and every public note will become visible on Domani’s Coming Soon page.',
    confirm: 'Publish preview',
  },
  publish: {
    title: 'Publish this changelog release?',
    description:
      'The release and every public note will become visible on Domani’s public changelog.',
    confirm: 'Publish release',
  },
  'return-to-private': {
    title: 'Return this release to private?',
    description: 'The coming-soon preview will be removed from the public site.',
    confirm: 'Return to private',
  },
  unpublish: {
    title: 'Unpublish this release?',
    description: 'The release will be removed from the public changelog but retain its history.',
    confirm: 'Unpublish release',
  },
  archive: {
    title: 'Archive this release?',
    description:
      'The release will be removed from active dashboard lists and made private. Its history is retained.',
    confirm: 'Archive release',
  },
};

function formFromRelease(release: AdminReleaseDetail): ReleaseFormState {
  return {
    version: release.version,
    title: release.title,
    lifecycleStatus: release.lifecycleStatus,
    publicOverview:
      release.publicOverview ||
      (release.publicSummary
        ? {
            type: 'doc',
            content: [
              { type: 'paragraph', content: [{ type: 'text', text: release.publicSummary }] },
            ],
          }
        : emptyPublicOverview),
    internalSummary: release.internalSummary || '',
    targetMonth: release.targetMonth || '',
    targetDate: release.targetDate || '',
  };
}

function errorMessage(error: unknown) {
  if (error instanceof ReleaseApiError && error.code === 'VERSION_CONFLICT')
    return 'This release changed after you loaded it. Refresh and review the latest version before saving again.';
  if (error instanceof ReleaseApiError) {
    const fieldMessage = firstFieldError(error.fieldErrors);
    if (fieldMessage) return fieldMessage;
  }
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export function ReleaseEditor({
  releaseId,
  includeArchived = false,
}: {
  releaseId?: string;
  includeArchived?: boolean;
}) {
  const router = useRouter();
  const isNew = !releaseId;
  const [release, setRelease] = useState<AdminReleaseDetail | null>(null);
  const [form, setForm] = useState<ReleaseFormState>(emptyReleaseForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<ReleaseAction | null>(null);
  const [releasedDate, setReleasedDate] = useState(new Date().toISOString().slice(0, 10));
  const [conflict, setConflict] = useState<ConflictState | null>(null);
  const [dirtyNotes, setDirtyNotes] = useState<Record<string, boolean>>({});
  const [canCreateRelease, setCanCreateRelease] = useState(false);
  const [capabilitiesLoaded, setCapabilitiesLoaded] = useState(false);
  const [draftRevision, setDraftRevision] = useState(0);
  const [refreshBlocked, setRefreshBlocked] = useState(false);
  const allowed = new Set(release?.allowedActions || []);
  const canEdit = !refreshBlocked && (isNew ? canCreateRelease : allowed.has('edit'));
  const formDisabled = saving || !canEdit;
  const derivedReleaseType = deriveReleaseType(form.version);
  const availableLifecycleStatuses = lifecycleOptions(release);
  const hasDirtyNotes = Object.values(dirtyNotes).some(Boolean);
  const releaseDirty = Boolean(
    release && JSON.stringify(form) !== JSON.stringify(formFromRelease(release)),
  );
  const newReleaseDirty = isNew && JSON.stringify(form) !== JSON.stringify(emptyReleaseForm);
  const hasUnsavedChanges = newReleaseDirty || releaseDirty || hasDirtyNotes;
  const readiness = release
    ? publicationReadiness({ ...release, publicOverview: form.publicOverview })
    : { ready: false, message: null };
  const hasPublicationAction = allowed.has('publish_preview') || allowed.has('publish');
  const suppressNextPop = useRef(false);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const message = 'You have unsaved release changes. Leave this page and discard them?';
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    const captureLink = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const destination = new URL(anchor.href, window.location.href);
      const current = new URL(window.location.href);
      if (
        destination.origin === current.origin &&
        destination.pathname === current.pathname &&
        destination.search === current.search
      )
        return;
      if (window.confirm(message)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    const capturePopState = () => {
      if (suppressNextPop.current) {
        suppressNextPop.current = false;
        return;
      }
      if (window.confirm(message)) return;
      suppressNextPop.current = true;
      window.history.go(1);
    };

    window.addEventListener('beforeunload', beforeUnload);
    document.addEventListener('click', captureLink, true);
    window.addEventListener('popstate', capturePopState);
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      document.removeEventListener('click', captureLink, true);
      window.removeEventListener('popstate', capturePopState);
    };
  }, [hasUnsavedChanges]);

  const load = useCallback(
    async ({
      showLoading = false,
      preserveForm = false,
    }: { showLoading?: boolean; preserveForm?: boolean } = {}) => {
      if (showLoading) setLoading(true);
      setError(null);
      try {
        if (!releaseId) {
          const capabilities = await getReleaseCapabilities();
          setCanCreateRelease(capabilities.canCreateRelease);
          setCapabilitiesLoaded(true);
          setRefreshBlocked(false);
          return true;
        }
        const next = await getRelease(releaseId, includeArchived);
        setRelease(next);
        if (!preserveForm) setForm(formFromRelease(next));
        setRefreshBlocked(false);
        return true;
      } catch (caught) {
        setError(errorMessage(caught));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [includeArchived, releaseId],
  );

  useEffect(() => {
    void load({ showLoading: true });
  }, [load]);

  const refreshAfterMutation = useCallback(
    async (preserveForm = true) => {
      const refreshed = await load({ preserveForm });
      if (!refreshed) {
        setRefreshBlocked(true);
        setError(
          'Your change was saved, but the latest release could not be loaded. Editing is paused to prevent a version conflict. Retry before continuing.',
        );
      }
      return refreshed;
    },
    [load],
  );

  const retryLoad = useCallback(async () => {
    await load({ showLoading: true, preserveForm: refreshBlocked });
  }, [load, refreshBlocked]);

  const handleMutationError = async (caught: unknown) => {
    if (caught instanceof ReleaseApiError && caught.code === 'VERSION_CONFLICT' && releaseId) {
      setError(null);
      let latest: AdminReleaseDetail | null = null;
      let latestError: string | null = null;
      try {
        latest = await getRelease(releaseId, includeArchived);
      } catch (refreshError) {
        latestError = errorMessage(refreshError);
      }
      setConflict({ message: errorMessage(caught), latest, latestError });
      return;
    }
    setError(errorMessage(caught));
  };

  const setNoteDirty = useCallback((key: string, dirty: boolean) => {
    setDirtyNotes((current) => {
      if (current[key] === dirty) return current;
      if (!dirty) {
        const next = { ...current };
        delete next[key];
        return next;
      }
      return { ...current, [key]: true };
    });
  }, []);

  const setField = <K extends keyof ReleaseFormState>(field: K, value: ReleaseFormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async () => {
    if (!canEdit) {
      setError('This release is read-only for your dashboard role.');
      return;
    }
    if (!isNew && !releaseDirty) {
      setNotice('No release setting changes to save.');
      return;
    }
    const validationError = releaseFormError(form, isNew, release?.visibility);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      if (isNew) {
        const input: CreateReleaseInput = {
          version: form.version,
          title: form.title.trim(),
          publicOverview: form.publicOverview,
          internalSummary: form.internalSummary || null,
          targetMonth: form.targetMonth || null,
          targetDate: form.targetDate || null,
        };
        const id = await createRelease(input);
        router.replace(`/dashboard/domani/releases/${id}`);
        return;
      }
      if (!release) return;
      await updateRelease(release.id, release.rowVersion, {
        title: form.title.trim(),
        lifecycleStatus: form.lifecycleStatus,
        publicOverview: form.publicOverview,
        internalSummary: form.internalSummary || null,
        targetMonth: form.targetMonth || null,
        targetDate: form.targetDate || null,
      });
      if (await refreshAfterMutation(false)) setNotice('Release settings saved.');
    } catch (caught) {
      await handleMutationError(caught);
    } finally {
      setSaving(false);
    }
  };

  const handleAction = async (action: ReleaseAction) => {
    if (!release) return;
    if (refreshBlocked) {
      setError(
        'Editing is paused until the latest release is loaded. Retry before changing visibility.',
      );
      return;
    }
    if (releaseDirty) {
      setError('Save release settings before changing public visibility.');
      return;
    }
    if (hasDirtyNotes) {
      setError('Save or discard release-note drafts before changing release visibility.');
      return;
    }
    if ((action === 'publish-preview' || action === 'publish') && !readiness.ready) {
      setError(readiness.message || 'Complete the public release content before publishing.');
      return;
    }
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      await runReleaseAction(
        release.id,
        release.rowVersion,
        action,
        action === 'mark-released' ? { releasedDate } : undefined,
      );
      setPendingAction(null);
      if (action === 'archive') {
        router.replace('/dashboard/domani/releases');
        router.refresh();
        return;
      }
      if (await refreshAfterMutation()) {
        setNotice(
          action === 'mark-released'
            ? 'Release marked as released.'
            : action === 'publish-preview'
              ? 'Release is now visible as a public preview.'
              : action === 'publish'
                ? 'Release published to the changelog.'
                : 'Release visibility updated.',
        );
      }
    } catch (caught) {
      setPendingAction(null);
      await handleMutationError(caught);
    } finally {
      setSaving(false);
    }
  };

  const moveNote = async (index: number, direction: -1 | 1) => {
    if (!release || !canEdit) return;
    if (releaseDirty) {
      setError('Save release settings before reordering notes.');
      return;
    }
    if (hasDirtyNotes) {
      setError('Save or discard release-note drafts before reordering notes.');
      return;
    }
    const target = index + direction;
    if (target < 0 || target >= release.notes.length) return;
    const next = [...release.notes];
    [next[index], next[target]] = [next[target], next[index]];
    setSaving(true);
    setError(null);
    try {
      await reorderReleaseNotes(release, next);
      if (await refreshAfterMutation()) setNotice('Release highlights reordered.');
    } catch (caught) {
      await handleMutationError(caught);
    } finally {
      setSaving(false);
    }
  };

  const reloadLatest = () => {
    if (!conflict?.latest) return;
    setRelease(conflict.latest);
    setForm(formFromRelease(conflict.latest));
    setConflict(null);
    setDirtyNotes({});
    setDraftRevision((current) => current + 1);
    setError(null);
  };

  if (loading) return <EditorLoading />;
  if (!isNew && !release)
    return <EditorError message={error || 'Release not found.'} retry={retryLoad} />;

  return (
    <div className="w-full pb-10">
      <Link
        href="/dashboard/domani/releases"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--pv-text-muted)] transition hover:text-[var(--pv-primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        All releases
      </Link>
      <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pv-primary)]">
            {isNew ? 'Create release' : 'Release detail'}
          </p>
          <h2 className="font-heading text-3xl font-bold text-[var(--pv-text)]">
            {isNew ? 'New release' : `Release ${release?.version}`}
          </h2>
          <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
            {form.title || 'Set the release identity, timing, notes, and public visibility.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {release && (
            <>
              <ReleaseBadge kind="visibility" value={release.visibility} />
              <ReleaseBadge kind="lifecycle" value={release.lifecycleStatus} />
            </>
          )}
          <Button
            variant="secondary"
            onClick={() => void handleSave()}
            disabled={saving || !canEdit || (!isNew && !releaseDirty)}
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving…' : 'Save'}
          </Button>
          {release && allowed.has('mark_released') && (
            <Button
              variant="secondary"
              onClick={() => {
                setReleasedDate(new Date().toISOString().slice(0, 10));
                setPendingAction('mark-released');
              }}
              disabled={saving || refreshBlocked || releaseDirty || hasDirtyNotes}
            >
              <Check className="mr-2 h-4 w-4" />
              Mark released
            </Button>
          )}
          {release && allowed.has('publish_preview') && (
            <Button
              onClick={() => setPendingAction('publish-preview')}
              disabled={
                saving || refreshBlocked || releaseDirty || hasDirtyNotes || !readiness.ready
              }
            >
              Publish preview
            </Button>
          )}
          {release && allowed.has('publish') && (
            <Button
              onClick={() => setPendingAction('publish')}
              disabled={
                saving || refreshBlocked || releaseDirty || hasDirtyNotes || !readiness.ready
              }
            >
              Publish
            </Button>
          )}
          {release && allowed.has('return_to_private') && (
            <Button
              variant="outline"
              onClick={() => setPendingAction('return-to-private')}
              disabled={saving || refreshBlocked || releaseDirty || hasDirtyNotes}
            >
              Return private
            </Button>
          )}
          {release && allowed.has('unpublish') && (
            <Button
              variant="outline"
              onClick={() => setPendingAction('unpublish')}
              disabled={saving || refreshBlocked || releaseDirty || hasDirtyNotes}
            >
              Unpublish
            </Button>
          )}
          {release && allowed.has('archive') && (
            <Button
              variant="outline"
              onClick={() => setPendingAction('archive')}
              disabled={saving || refreshBlocked || releaseDirty || hasDirtyNotes}
              className="text-red-600 hover:text-red-700 dark:text-red-300"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Archive
            </Button>
          )}
        </div>
      </div>

      {(error || notice) && (
        <div
          className={cn(
            'mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm',
            error
              ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200'
              : 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200',
          )}
          role={error ? 'alert' : 'status'}
        >
          {error ? (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span className="min-w-0 flex-1">{error || notice}</span>
          {(isNew || refreshBlocked) && error && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="-my-1 shrink-0"
              onClick={() => void retryLoad()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          )}
        </div>
      )}

      {hasPublicationAction && !readiness.ready && readiness.message && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          {readiness.message}
        </div>
      )}

      {(releaseDirty || hasDirtyNotes) && (
        <div
          className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
          role="status"
        >
          You have unsaved{' '}
          {releaseDirty && hasDirtyNotes
            ? 'release settings and note drafts'
            : releaseDirty
              ? 'release settings'
              : 'release-note drafts'}
          . Save them before publishing, changing visibility, archiving, or reordering notes.
        </div>
      )}

      {!canEdit && !refreshBlocked && (!isNew || capabilitiesLoaded) && (
        <div className="mb-5 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-3 text-sm text-[var(--pv-text-muted)]">
          {release?.archivedAt
            ? 'Archived release. Its history remains available for review, but archived records cannot be changed.'
            : 'Read-only view. Your dashboard role can inspect this release but cannot change it.'}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(300px,0.75fr)_minmax(0,1.6fr)]">
        <section className={cn(panelClass, 'p-5 sm:p-6')}>
          <h3 className="mb-5 text-lg font-bold text-[var(--pv-text)]">Release settings</h3>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <Field label="Version">
              <TextInput
                value={form.version}
                onChange={(event) => setField('version', event.target.value)}
                disabled={!isNew || formDisabled}
                placeholder="1.2.0"
                pattern="(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})"
                aria-describedby="release-version-help"
                aria-invalid={isNew && form.version.length > 0 && !derivedReleaseType}
                error={
                  isNew && form.version.length > 0 && !derivedReleaseType
                    ? 'Enter a complete semantic version such as 1.2.0.'
                    : undefined
                }
                classNames={mantineFieldClassNames}
                required
              />
              <p id="release-version-help" className="text-xs text-[var(--pv-text-muted)]">
                Use X.Y.Z. The release type is derived automatically.
              </p>
            </Field>
            <Field label="Release type">
              <TextInput
                value={releaseTypeLabel(form.version)}
                disabled
                aria-label="Release type derived from version"
                classNames={mantineFieldClassNames}
              />
            </Field>
            <Field label="Lifecycle status">
              <Select
                value={form.lifecycleStatus}
                disabled={isNew || formDisabled}
                onChange={(value) =>
                  value && setField('lifecycleStatus', value as ReleaseLifecycle)
                }
                data={availableLifecycleStatuses.map((value) => ({
                  value,
                  label: lifecycleLabels[value],
                }))}
                allowDeselect={false}
                classNames={mantineSelectClassNames}
              />
            </Field>
            <Field label="Visibility">
              <div className="flex min-h-9 items-center">
                {release ? (
                  <ReleaseBadge kind="visibility" value={release.visibility} />
                ) : (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">
                    Private
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--pv-text-muted)]">
                Changes only through preview and publish actions.
              </p>
            </Field>
            <Field label="Target month">
              <MonthPickerInput
                value={form.targetMonth ? `${form.targetMonth}-01` : null}
                disabled={formDisabled}
                onChange={(value) => setField('targetMonth', value?.slice(0, 7) || '')}
                placeholder="Select month"
                valueFormat="MMMM YYYY"
                minDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
                clearable
                size="md"
                classNames={mantineFieldClassNames}
              />
            </Field>
            <Field label="Target date">
              <DateInput
                value={form.targetDate || null}
                disabled={formDisabled}
                onChange={(value) => setField('targetDate', value || '')}
                placeholder="Select date"
                valueFormat="MM/DD/YYYY"
                minDate={new Date().toISOString().slice(0, 10)}
                clearable
                size="md"
                classNames={mantineFieldClassNames}
              />
            </Field>
          </div>
        </section>

        <section className={cn(panelClass, 'p-5 sm:p-6')}>
          <div className="mb-5">
            <h3 className="text-lg font-bold text-[var(--pv-text)]">Public release content</h3>
            <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
              The title and introduction shown at the top of the public release.
            </p>
          </div>
          <Field label="Release title">
            <TextInput
              value={form.title}
              onChange={(event) => setField('title', event.target.value)}
              disabled={formDisabled}
              placeholder="Smarter evening planning setup"
              classNames={mantineFieldClassNames}
              required
              maxLength={160}
            />
          </Field>
          <div className="mt-4">
            <div className={fieldClass}>
              <span className={labelClass}>Introduction</span>
              <PublicOverviewEditor
                value={form.publicOverview}
                onChange={(value) => setField('publicOverview', value)}
                disabled={formDisabled}
              />
              <p className="text-xs text-[var(--pv-text-muted)]">
                Explain what the release means and why it matters. Use release highlights below for
                individual changes. Supports headings, links, and bullet or numbered lists.
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-4 text-xs text-[var(--pv-text-muted)]">
            This content stays private until you use the preview or publish actions above.
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.75fr)]">
        <section className={cn(panelClass, 'p-5 sm:p-6')}>
          <div className="mb-5">
            <h3 className="text-lg font-bold text-[var(--pv-text)]">Release highlights</h3>
            <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
              Add each feature, improvement, fix, or breaking change separately. Public highlights
              appear below the introduction and can be ordered by importance.
            </p>
          </div>
          {isNew || !release ? (
            <div className="rounded-xl border border-dashed border-[var(--pv-border)] px-4 py-8 text-center">
              <p className="text-sm font-medium text-[var(--pv-text)]">
                Save the release details to begin adding highlights.
              </p>
              <p className="mt-1 text-xs text-[var(--pv-text-muted)]">
                Highlights are separate items, so the release needs to be created first.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {release.notes.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[var(--pv-border)] px-4 py-8 text-center text-sm text-[var(--pv-text-muted)]">
                  No highlights yet. Add each customer-facing change as its own highlight.
                </div>
              ) : (
                release.notes.map((note, index) => (
                  <NoteEditor
                    key={`${draftRevision}:${note.id}`}
                    release={release}
                    note={note}
                    index={index}
                    total={release.notes.length}
                    disabled={!canEdit || releaseDirty || saving}
                    reorderDisabled={hasDirtyNotes}
                    canArchive={allowed.has('archive')}
                    onSaved={() => refreshAfterMutation()}
                    onMove={moveNote}
                    onDirtyChange={setNoteDirty}
                    onError={handleMutationError}
                    setNotice={setNotice}
                  />
                ))
              )}
              <NewNoteForm
                key={`new-note:${draftRevision}`}
                release={release}
                disabled={!canEdit || releaseDirty || saving}
                onSaved={() => refreshAfterMutation()}
                onDirtyChange={setNoteDirty}
                onError={handleMutationError}
                setNotice={setNotice}
              />
            </div>
          )}
        </section>
        <section className={cn(panelClass, 'h-fit p-5 sm:p-6')}>
          <h3 className="mb-2 text-lg font-bold text-[var(--pv-text)]">Team notes</h3>
          <p className="mb-4 text-sm text-[var(--pv-text-muted)]">
            Optional and private. Record implementation details, QA checks, support context, and
            known issues for the team.
          </p>
          <MantineTextarea
            value={form.internalSummary}
            onChange={(event) => setField('internalSummary', event.target.value)}
            disabled={formDisabled}
            rows={12}
            maxLength={10000}
            classNames={{
              ...mantineFieldClassNames,
              input: `${mantineFieldClassNames.input} font-mono`,
            }}
            placeholder={
              'QA:\n- Verify templates on iOS and Android\n\nSupport:\n- Existing tasks are unaffected\n\nTechnical:\n- Requires app version 1.2.0'
            }
          />
          <div className="mt-4 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
            Private
          </div>
        </section>
      </div>

      <Dialog
        open={Boolean(pendingAction)}
        onOpenChange={(open) => !open && setPendingAction(null)}
      >
        <DialogContent className="max-w-md p-6">
          {pendingAction && (
            <>
              <DialogHeader>
                <DialogTitle>{actionCopy[pendingAction].title}</DialogTitle>
                <DialogDescription>{actionCopy[pendingAction].description}</DialogDescription>
              </DialogHeader>
              <div className="rounded-xl border border-[var(--pv-border)] bg-[var(--pv-bg)] p-4 text-sm">
                <p className="font-semibold text-[var(--pv-text)]">
                  {release?.version} · {form.title}
                </p>
                <p className="mt-1 text-[var(--pv-text-muted)]">
                  {release?.notes.filter((note) => note.isPublic).length || 0} public highlights
                </p>
              </div>
              {pendingAction === 'mark-released' && (
                <Field label="Released date">
                  <DateInput
                    value={releasedDate}
                    onChange={(value) => setReleasedDate(value || '')}
                    maxDate={new Date().toISOString().slice(0, 10)}
                    valueFormat="MM/DD/YYYY"
                    classNames={mantineFieldClassNames}
                    required
                  />
                  <p className="text-xs text-[var(--pv-text-muted)]">
                    Today or an earlier historical release date.
                  </p>
                </Field>
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={() => void handleAction(pendingAction)}
                  disabled={saving || (pendingAction === 'mark-released' && !releasedDate)}
                  className={
                    pendingAction === 'archive' ? 'bg-red-600 hover:bg-red-700' : undefined
                  }
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {actionCopy[pendingAction].confirm}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(conflict)} onOpenChange={(open) => !open && setConflict(null)}>
        <DialogContent className="max-w-lg p-6">
          <DialogHeader>
            <DialogTitle>Review the latest release before continuing</DialogTitle>
            <DialogDescription>
              {conflict?.message} Your unsaved inputs remain on screen until you explicitly reload.
            </DialogDescription>
          </DialogHeader>
          {conflict?.latest ? (
            <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
                    Loaded copy
                  </p>
                  <p className="mt-1 font-semibold">Version {release?.rowVersion}</p>
                  <p className="mt-1 opacity-80">{release?.title}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
                    Latest copy
                  </p>
                  <p className="mt-1 font-semibold">Version {conflict.latest.rowVersion}</p>
                  <p className="mt-1 opacity-80">{conflict.latest.title}</p>
                  <p className="mt-1 text-xs opacity-70">
                    Updated {new Date(conflict.latest.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="border-t border-amber-200 pt-3 dark:border-amber-500/30">
                <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
                  Latest server notes
                </p>
                <div className="mt-2 max-h-32 space-y-1 overflow-y-auto">
                  {conflict.latest.notes.length ? (
                    conflict.latest.notes.map((note) => (
                      <p key={note.id} className="flex justify-between gap-4">
                        <span className="truncate">{note.publicTitle}</span>
                        <span className="shrink-0 text-xs opacity-70">v{note.rowVersion}</span>
                      </p>
                    ))
                  ) : (
                    <p className="opacity-70">No active notes.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
              Latest data could not be loaded: {conflict?.latestError || 'Unknown error'}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Keep my edits</Button>
            </DialogClose>
            <Button
              variant="secondary"
              onClick={() => void reloadLatest()}
              disabled={!conflict?.latest}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Discard edits and load latest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className={fieldClass}>
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function EditorLoading() {
  return (
    <div className="space-y-5" aria-label="Loading release">
      <div className="h-14 animate-pulse rounded-xl bg-[var(--pv-surface)]" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-96 animate-pulse rounded-2xl bg-[var(--pv-surface)]" />
        <div className="h-96 animate-pulse rounded-2xl bg-[var(--pv-surface)]" />
      </div>
    </div>
  );
}

function EditorError({ message, retry }: { message: string; retry: () => Promise<void> }) {
  return (
    <div
      className={cn(panelClass, 'flex flex-col items-center px-6 py-16 text-center')}
      role="alert"
    >
      <AlertTriangle className="mb-3 h-8 w-8 text-red-500" />
      <h2 className="font-semibold text-[var(--pv-text)]">Release could not be loaded</h2>
      <p className="mt-1 max-w-lg text-sm text-[var(--pv-text-muted)]">{message}</p>
      <Button variant="secondary" className="mt-5" onClick={() => void retry()}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}

function PlatformChecks({
  value,
  onChange,
  disabled = false,
}: {
  value: ReleasePlatform[];
  onChange: (value: ReleasePlatform[]) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset>
      <legend className={labelClass}>Platforms</legend>
      <Checkbox.Group
        value={value}
        onChange={(next) => next.length && onChange(next as ReleasePlatform[])}
      >
        <div className="mt-2 flex gap-4">
          <Checkbox
            value="ios"
            label="iOS"
            disabled={disabled}
            color="violet"
            classNames={{ label: 'text-sm font-medium text-[var(--pv-text)]' }}
          />
          <Checkbox
            value="android"
            label="Android"
            disabled={disabled}
            color="violet"
            classNames={{ label: 'text-sm font-medium text-[var(--pv-text)]' }}
          />
        </div>
      </Checkbox.Group>
    </fieldset>
  );
}

function NoteEditor({
  release,
  note,
  index,
  total,
  disabled,
  reorderDisabled,
  canArchive,
  onSaved,
  onMove,
  onDirtyChange,
  onError,
  setNotice,
}: {
  release: AdminReleaseDetail;
  note: AdminReleaseNote;
  index: number;
  total: number;
  disabled: boolean;
  reorderDisabled: boolean;
  canArchive: boolean;
  onSaved: () => Promise<boolean>;
  onMove: (index: number, direction: -1 | 1) => Promise<void>;
  onDirtyChange: (key: string, dirty: boolean) => void;
  onError: (error: unknown) => Promise<void>;
  setNotice: (value: string | null) => void;
}) {
  const [title, setTitle] = useState(note.publicTitle);
  const [body, setBody] = useState(note.publicBody);
  const [technical, setTechnical] = useState(note.technicalNotes || '');
  const [noteType, setNoteType] = useState<ReleaseNoteType>(note.noteType);
  const [platforms, setPlatforms] = useState<ReleasePlatform[]>(note.platforms);
  const [isPublic, setIsPublic] = useState(note.isPublic);
  const [saving, setSaving] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const controlsDisabled = disabled || saving;
  const dirty = useMemo(
    () =>
      title !== note.publicTitle ||
      body !== note.publicBody ||
      technical !== (note.technicalNotes || '') ||
      noteType !== note.noteType ||
      isPublic !== note.isPublic ||
      platforms.join(',') !== note.platforms.join(','),
    [body, isPublic, note, noteType, platforms, technical, title],
  );
  useEffect(() => {
    onDirtyChange(note.id, dirty);
    return () => onDirtyChange(note.id, false);
  }, [dirty, note.id, onDirtyChange]);

  const save = async () => {
    const validationError = noteFormError(title, body, technical);
    if (validationError) {
      await onError(new Error(validationError));
      return;
    }
    if (wouldRemoveLastPublicNote(release, note.id, isPublic)) {
      await onError(
        new Error(
          'A visible release must keep at least one public highlight. Make another highlight public first.',
        ),
      );
      return;
    }
    setSaving(true);
    try {
      const normalizedTitle = title.trim();
      const normalizedBody = body.replace(/\r\n?/g, '\n').trim();
      await updateReleaseNote(release, note, {
        publicTitle: normalizedTitle,
        publicBody: normalizedBody,
        technicalNotes: technical || null,
        noteType,
        platforms,
        isPublic,
      });
      setTitle(normalizedTitle);
      setBody(normalizedBody);
      if (await onSaved()) setNotice(`Saved “${normalizedTitle}”.`);
    } catch (caught) {
      await onError(caught);
    } finally {
      setSaving(false);
    }
  };

  const archive = async () => {
    if (wouldRemoveLastPublicNote(release, note.id, false)) {
      await onError(
        new Error(
          'A visible release must keep at least one public highlight. Make another highlight public first.',
        ),
      );
      return;
    }
    setSaving(true);
    try {
      await archiveReleaseNote(release, note);
      setArchiveOpen(false);
      if (await onSaved()) setNotice(`Archived “${title}”.`);
    } catch (caught) {
      await onError(caught);
    } finally {
      setSaving(false);
    }
  };
  return (
    <article className="rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
            {index + 1}
          </span>
          <PlatformBadge platforms={platforms} />
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Move ${title} up`}
            disabled={disabled || reorderDisabled || index === 0 || saving}
            onClick={() => void onMove(index, -1)}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Move ${title} down`}
            disabled={disabled || reorderDisabled || index === total - 1 || saving}
            onClick={() => void onMove(index, 1)}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
        <Field label="Change type">
          <Select
            value={noteType}
            disabled={controlsDisabled}
            onChange={(value) => value && setNoteType(value as ReleaseNoteType)}
            data={noteTypeOptions}
            allowDeselect={false}
            classNames={mantineSelectClassNames}
          />
        </Field>
        <Field label="Highlight title">
          <TextInput
            value={title}
            disabled={controlsDisabled}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={160}
            classNames={mantineFieldClassNames}
          />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Public description">
          <MantineTextarea
            value={body}
            disabled={controlsDisabled}
            onChange={(event) => setBody(event.target.value)}
            rows={3}
            maxLength={4000}
            classNames={mantineFieldClassNames}
          />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Private technical context">
          <MantineTextarea
            value={technical}
            disabled={controlsDisabled}
            onChange={(event) => setTechnical(event.target.value)}
            rows={2}
            maxLength={20000}
            placeholder="Private implementation context"
            classNames={mantineFieldClassNames}
          />
        </Field>
      </div>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PlatformChecks value={platforms} onChange={setPlatforms} disabled={controlsDisabled} />
        <div className="flex items-center gap-3">
          <Switch
            checked={isPublic}
            disabled={controlsDisabled}
            onChange={(event) => setIsPublic(event.currentTarget.checked)}
            label="Show publicly"
            color="violet"
            classNames={{ label: 'text-sm font-medium text-[var(--pv-text)]' }}
          />
          <Button
            size="sm"
            variant={dirty ? 'default' : 'secondary'}
            disabled={disabled || !dirty || saving || !title.trim() || !body.trim()}
            onClick={() => void save()}
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {dirty ? 'Save highlight' : 'Saved'}
          </Button>
          {canArchive && (
            <Button
              size="sm"
              variant="ghost"
              disabled={disabled || dirty || saving}
              onClick={() => setArchiveOpen(true)}
              className="text-red-600 hover:text-red-700 dark:text-red-300"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Archive
            </Button>
          )}
        </div>
      </div>
      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Archive this release highlight?</DialogTitle>
            <DialogDescription>
              “{title}” will be removed from the active highlight list. Its history is retained.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => void archive()}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Archive highlight
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );
}

function NewNoteForm({
  release,
  disabled,
  onSaved,
  onDirtyChange,
  onError,
  setNotice,
}: {
  release: AdminReleaseDetail;
  disabled: boolean;
  onSaved: () => Promise<boolean>;
  onDirtyChange: (key: string, dirty: boolean) => void;
  onError: (error: unknown) => Promise<void>;
  setNotice: (value: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [technical, setTechnical] = useState('');
  const [noteType, setNoteType] = useState<ReleaseNoteType>('feature');
  const [platforms, setPlatforms] = useState<ReleasePlatform[]>(['ios', 'android']);
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const controlsDisabled = disabled || saving;
  const dirty =
    open &&
    Boolean(
      title ||
      body ||
      technical ||
      noteType !== 'feature' ||
      platforms.join(',') !== 'ios,android' ||
      isPublic,
    );

  useEffect(() => {
    onDirtyChange('new-note', dirty);
    return () => onDirtyChange('new-note', false);
  }, [dirty, onDirtyChange]);

  const discard = () => {
    setTitle('');
    setBody('');
    setTechnical('');
    setNoteType('feature');
    setPlatforms(['ios', 'android']);
    setIsPublic(false);
    setOpen(false);
  };

  if (!open)
    return (
      <Button variant="secondary" onClick={() => setOpen(true)} disabled={disabled}>
        <Plus className="mr-2 h-4 w-4" />
        Add highlight
      </Button>
    );
  const save = async () => {
    const validationError = noteFormError(title, body, technical);
    if (validationError) {
      await onError(new Error(validationError));
      return;
    }
    setSaving(true);
    try {
      await createReleaseNote(release, {
        noteType,
        publicTitle: title,
        publicBody: body,
        technicalNotes: technical || null,
        platforms,
        isPublic,
      });
      discard();
      if (await onSaved()) setNotice('Release highlight added.');
    } catch (caught) {
      await onError(caught);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="rounded-2xl border border-dashed border-[var(--pv-primary)] bg-[rgba(99,102,241,0.04)] p-4">
      <h4 className="mb-4 font-semibold text-[var(--pv-text)]">New release highlight</h4>
      <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
        <Field label="Change type">
          <Select
            value={noteType}
            disabled={controlsDisabled}
            onChange={(value) => value && setNoteType(value as ReleaseNoteType)}
            data={noteTypeOptions}
            allowDeselect={false}
            classNames={mantineSelectClassNames}
          />
        </Field>
        <Field label="Highlight title">
          <TextInput
            value={title}
            disabled={controlsDisabled}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={160}
            classNames={mantineFieldClassNames}
          />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Public description">
          <MantineTextarea
            value={body}
            disabled={controlsDisabled}
            onChange={(event) => setBody(event.target.value)}
            rows={3}
            maxLength={4000}
            classNames={mantineFieldClassNames}
          />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Private technical context">
          <MantineTextarea
            value={technical}
            disabled={controlsDisabled}
            onChange={(event) => setTechnical(event.target.value)}
            rows={2}
            maxLength={20000}
            classNames={mantineFieldClassNames}
          />
        </Field>
      </div>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PlatformChecks value={platforms} onChange={setPlatforms} disabled={controlsDisabled} />
        <div className="flex items-center gap-3">
          <Switch
            checked={isPublic}
            disabled={controlsDisabled}
            onChange={(event) => setIsPublic(event.currentTarget.checked)}
            label="Show publicly"
            color="violet"
            classNames={{ label: 'text-sm font-medium text-[var(--pv-text)]' }}
          />
          <Button variant="ghost" size="sm" onClick={discard} disabled={saving}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={disabled || saving || !title.trim() || !body.trim()}
            onClick={() => void save()}
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Add highlight
          </Button>
        </div>
      </div>
    </div>
  );
}
