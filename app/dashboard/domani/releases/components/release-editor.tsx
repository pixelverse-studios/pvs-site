'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Checkbox, Select, Textarea, TextInput } from '@mantine/core';
import { DateInput, MonthPickerInput } from '@mantine/dates';
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
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
  getRelease,
  getReleaseCapabilities,
  ReleaseApiError,
  runReleaseAction,
  saveReleaseEditor,
} from '@/lib/api/admin-releases';
import type {
  AdminReleaseDetail,
  ReleaseNoteType,
  ReleasePlatform,
} from '@/lib/types/admin-release';
import { cn } from '@/lib/utils';
import { PublicOverviewEditor } from './public-overview-editor';
import { ReleaseMarkdownEditor } from './release-markdown-editor';
import {
  destinationMessage,
  domaniReleaseCalendarDate,
  domaniReleaseCalendarDateValue,
  domaniReleaseCalendarMonth,
  emptyReleaseEditorForm,
  releaseEditorFormError,
  releaseEditorFormFromRelease,
  releaseEditorFormsEqual,
  releaseEditorPayload,
  releaseTypeLabel,
  type ReleaseEditorFormState,
  type ReleaseHighlightFormState,
} from './release-rules';

const fieldClass = 'space-y-2';
const labelClass =
  'block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--pv-text-muted)]';
const panelClass =
  'rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-bg)] shadow-[0_18px_48px_-42px_rgba(20,16,35,0.48)]';
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

const noteTypeOptions: Array<{ value: ReleaseNoteType; label: string }> = [
  { value: 'feature', label: 'New feature' },
  { value: 'improvement', label: 'Improvement' },
  { value: 'fix', label: 'Bug fix' },
  { value: 'breaking', label: 'Important change' },
];

function errorMessage(error: unknown) {
  if (error instanceof ReleaseApiError && error.code === 'VERSION_CONFLICT') {
    return 'This release was changed somewhere else. Refresh the page, review the latest version, and try again.';
  }
  if (error instanceof ReleaseApiError) {
    const firstFieldMessage = Object.values(error.fieldErrors).flat().find(Boolean);
    if (firstFieldMessage) return firstFieldMessage;
  }
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

function newHighlight(): ReleaseHighlightFormState {
  return {
    id: crypto.randomUUID(),
    rowVersion: null,
    noteType: 'feature',
    publicTitle: '',
    publicBody: '',
    technicalNotes: '',
    platformOverride: null,
    isPublic: true,
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={fieldClass}>
      <span className={labelClass}>{label}</span>
      {children}
    </div>
  );
}

function PlatformChoices({
  value,
  onChange,
  disabled,
}: {
  value: ReleasePlatform[];
  onChange: (value: ReleasePlatform[]) => void;
  disabled: boolean;
}) {
  const toggle = (platform: ReleasePlatform, checked: boolean) => {
    if (checked) onChange(Array.from(new Set([...value, platform])));
    else onChange(value.filter((entry) => entry !== platform));
  };
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      <Checkbox
        label="iOS"
        checked={value.includes('ios')}
        onChange={(event) => toggle('ios', event.currentTarget.checked)}
        disabled={disabled || (value.length === 1 && value.includes('ios'))}
        color="violet"
      />
      <Checkbox
        label="Android"
        checked={value.includes('android')}
        onChange={(event) => toggle('android', event.currentTarget.checked)}
        disabled={disabled || (value.length === 1 && value.includes('android'))}
        color="violet"
      />
    </div>
  );
}

function HighlightEditor({
  highlight,
  index,
  total,
  releasePlatforms,
  expanded,
  disabled,
  onToggle,
  onChange,
  onMove,
  onRemove,
}: {
  highlight: ReleaseHighlightFormState;
  index: number;
  total: number;
  releasePlatforms: ReleasePlatform[];
  expanded: boolean;
  disabled: boolean;
  onToggle: () => void;
  onChange: (value: ReleaseHighlightFormState) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  const set = <K extends keyof ReleaseHighlightFormState>(
    key: K,
    value: ReleaseHighlightFormState[K],
  ) => onChange({ ...highlight, [key]: value });
  const inheritedPlatforms = highlight.platformOverride === null;

  return (
    <article className={cn(panelClass, 'overflow-hidden')}>
      <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          onClick={onToggle}
          aria-expanded={expanded}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
            {index + 1}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-[var(--pv-text)]">
              {highlight.publicTitle.trim() || `Untitled highlight ${index + 1}`}
            </span>
            <span className="mt-0.5 block text-xs text-[var(--pv-text-muted)]">
              {noteTypeOptions.find((entry) => entry.value === highlight.noteType)?.label}
              {' · '}
              {highlight.isPublic ? 'Shown publicly' : 'Team only'}
            </span>
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onMove(-1)}
            disabled={disabled || index === 0}
            aria-label="Move highlight up"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onMove(1)}
            disabled={disabled || index === total - 1}
            aria-label="Move highlight down"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={onToggle}
            aria-label={expanded ? 'Collapse highlight' : 'Edit highlight'}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-5 border-t border-[var(--pv-border)] px-4 py-5 sm:px-5">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_13rem]">
            <Field label="Highlight title">
              <TextInput
                value={highlight.publicTitle}
                onChange={(event) => set('publicTitle', event.currentTarget.value)}
                disabled={disabled}
                placeholder="What changed?"
                maxLength={160}
                size="md"
                classNames={mantineFieldClassNames}
              />
            </Field>
            <Field label="Type">
              <Select
                value={highlight.noteType}
                onChange={(value) => value && set('noteType', value as ReleaseNoteType)}
                data={noteTypeOptions}
                disabled={disabled}
                allowDeselect={false}
                size="md"
                classNames={mantineSelectClassNames}
              />
            </Field>
          </div>

          <Field label="Highlight details">
            <ReleaseMarkdownEditor
              value={highlight.publicBody}
              onChange={(value) => set('publicBody', value)}
              disabled={disabled}
            />
          </Field>

          <div className="rounded-xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-4">
            <Checkbox
              label="Include this highlight in the public release"
              description="Turn this off only for information your team should keep private."
              checked={highlight.isPublic}
              onChange={(event) => set('isPublic', event.currentTarget.checked)}
              disabled={disabled}
              color="violet"
            />
            <div className="mt-4 border-t border-[var(--pv-border)] pt-4">
              <Checkbox
                label="Use the release platforms"
                checked={inheritedPlatforms}
                onChange={(event) =>
                  set('platformOverride', event.currentTarget.checked ? null : [...releasePlatforms])
                }
                disabled={disabled}
                color="violet"
              />
              {!inheritedPlatforms && (
                <div className="mt-3 pl-7">
                  <PlatformChoices
                    value={highlight.platformOverride || releasePlatforms}
                    onChange={(value) => set('platformOverride', value)}
                    disabled={disabled}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-300 dark:hover:bg-red-500/10"
              onClick={onRemove}
              disabled={disabled}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove highlight
            </Button>
          </div>
        </div>
      )}
    </article>
  );
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
  const [form, setForm] = useState<ReleaseEditorFormState>(() => emptyReleaseEditorForm());
  const [baseline, setBaseline] = useState<ReleaseEditorFormState>(() => emptyReleaseEditorForm());
  const [loading, setLoading] = useState(true);
  const [canCreateRelease, setCanCreateRelease] = useState(false);
  const [saving, setSaving] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [teamNotesOpen, setTeamNotesOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const suppressNextPop = useRef(false);

  const canEdit = isNew ? canCreateRelease : Boolean(release?.allowedActions.includes('edit'));
  const disabled = saving || archiving || !canEdit || Boolean(release?.archivedAt);
  const dirty = useMemo(() => !releaseEditorFormsEqual(form, baseline), [baseline, form]);
  const placementCopy = destinationMessage(form);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (releaseId) {
        const nextRelease = await getRelease(releaseId, includeArchived);
        const nextForm = releaseEditorFormFromRelease(nextRelease);
        setRelease(nextRelease);
        setForm(nextForm);
        setBaseline(nextForm);
        setExpanded(new Set());
      } else {
        const capabilities = await getReleaseCapabilities();
        setCanCreateRelease(capabilities.canCreateRelease);
        const empty = emptyReleaseEditorForm();
        setForm(empty);
        setBaseline(empty);
      }
    } catch (nextError) {
      setError(errorMessage(nextError));
    } finally {
      setLoading(false);
    }
  }, [includeArchived, releaseId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!dirty) return;
    const message = 'You have unsaved changes. Leave this page and discard them?';
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
  }, [dirty]);

  const setField = <K extends keyof ReleaseEditorFormState>(
    key: K,
    value: ReleaseEditorFormState[K],
  ) => {
    setNotice(null);
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = async () => {
    const validationError = releaseEditorFormError(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const saved = await saveReleaseEditor(release?.id, release?.rowVersion, releaseEditorPayload(form));
      const savedForm = releaseEditorFormFromRelease(saved);
      setRelease(saved);
      setForm(savedForm);
      setBaseline(savedForm);
      setNotice(form.status === 'published' ? 'Release saved and published.' : 'Draft saved.');
      if (isNew) router.replace(`/dashboard/domani/releases/${saved.id}`);
    } catch (nextError) {
      setError(errorMessage(nextError));
    } finally {
      setSaving(false);
    }
  };

  const addHighlight = () => {
    const highlight = newHighlight();
    setForm((current) => ({ ...current, highlights: [...current.highlights, highlight] }));
    setExpanded((current) => new Set(current).add(highlight.id));
    setNotice(null);
  };

  const updateHighlight = (index: number, value: ReleaseHighlightFormState) => {
    setForm((current) => ({
      ...current,
      highlights: current.highlights.map((entry, entryIndex) =>
        entryIndex === index ? value : entry,
      ),
    }));
    setNotice(null);
  };

  const moveHighlight = (index: number, direction: -1 | 1) => {
    setForm((current) => {
      const highlights = [...current.highlights];
      const target = index + direction;
      if (target < 0 || target >= highlights.length) return current;
      [highlights[index], highlights[target]] = [highlights[target], highlights[index]];
      return { ...current, highlights };
    });
    setNotice(null);
  };

  const removeHighlight = (index: number) => {
    const highlight = form.highlights[index];
    if (!window.confirm(`Remove “${highlight.publicTitle || `highlight ${index + 1}`}”?`)) return;
    setForm((current) => ({
      ...current,
      highlights: current.highlights.filter((_, entryIndex) => entryIndex !== index),
    }));
    setExpanded((current) => {
      const next = new Set(current);
      next.delete(highlight.id);
      return next;
    });
    setNotice(null);
  };

  const archive = async () => {
    if (!release) return;
    setArchiving(true);
    setError(null);
    try {
      await runReleaseAction(release.id, release.rowVersion, 'archive');
      router.push('/dashboard/domani/releases');
    } catch (nextError) {
      setError(errorMessage(nextError));
      setArchiveOpen(false);
    } finally {
      setArchiving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center text-[var(--pv-text-muted)]">
        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
        Loading release…
      </div>
    );
  }

  if (error && releaseId && !release) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center text-center">
        <AlertTriangle className="h-7 w-7 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold text-[var(--pv-text)]">This release could not be loaded</h1>
        <p className="mt-2 text-sm text-[var(--pv-text-muted)]">{error}</p>
        <Button className="mt-5" variant="outline" onClick={() => void load()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  if (!canEdit && !release) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center text-center">
        <AlertTriangle className="h-7 w-7 text-amber-500" />
        <h1 className="mt-4 text-2xl font-bold text-[var(--pv-text)]">You cannot create releases</h1>
        <p className="mt-2 text-sm text-[var(--pv-text-muted)]">
          Ask a dashboard administrator to update your access.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pb-16 pt-4 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[1800px]">
        <Link
          href="/dashboard/domani/releases"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--pv-text-muted)] hover:text-[var(--pv-text)]"
        >
          <ArrowLeft className="h-4 w-4" /> All releases
        </Link>

        <header className="mt-7 flex flex-col gap-5 border-b border-[var(--pv-border)] pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
              {isNew ? 'New release' : 'Release details'}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="truncate text-3xl font-black tracking-[-0.035em] text-[var(--pv-text)] sm:text-4xl">
                {form.version ? `Release ${form.version}` : 'Create a release'}
              </h1>
              <span
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-bold',
                  form.status === 'published'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                    : 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
                )}
              >
                {form.status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>
            <p className="mt-2 text-sm text-[var(--pv-text-muted)]">
              {form.title.trim() || 'Add the customer-facing story for this release.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {dirty && <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Unsaved changes</span>}
            <Button
              type="button"
              onClick={() => void save()}
              disabled={disabled || !dirty}
              className="min-w-32 bg-violet-600 text-white hover:bg-violet-700"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isNew ? 'Create release' : 'Save changes'}
            </Button>
          </div>
        </header>

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {notice && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{notice}</span>
          </div>
        )}
        {release?.archivedAt && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            This release is archived and cannot be edited.
          </div>
        )}

        <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <main className="min-w-0 space-y-8">
            <section className="space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Public release content</p>
                <h2 className="mt-1 text-xl font-bold text-[var(--pv-text)]">What customers will see</h2>
              </div>
              <Field label="Release title">
                <TextInput
                  value={form.title}
                  onChange={(event) => setField('title', event.currentTarget.value)}
                  disabled={disabled}
                  placeholder="A short, clear release title"
                  maxLength={160}
                  size="lg"
                  classNames={mantineFieldClassNames}
                />
              </Field>
              <Field label="Quick description">
                <PublicOverviewEditor
                  value={form.publicOverview}
                  onChange={(value) => setField('publicOverview', value)}
                  disabled={disabled}
                />
                <p className="text-xs text-[var(--pv-text-muted)]">
                  Keep this concise. The highlights below carry the full release story.
                </p>
              </Field>
            </section>

            <section className="border-t border-[var(--pv-border)] pt-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Release highlights</p>
                  <h2 className="mt-1 text-xl font-bold text-[var(--pv-text)]">What changed</h2>
                  <p className="mt-1 max-w-2xl text-sm text-[var(--pv-text-muted)]">
                    Add each customer-facing feature, improvement, fix, or important change.
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={addHighlight} disabled={disabled}>
                  <Plus className="mr-2 h-4 w-4" /> Add highlight
                </Button>
              </div>

              <div className="mt-5 space-y-3">
                {form.highlights.length ? (
                  form.highlights.map((highlight, index) => (
                    <HighlightEditor
                      key={highlight.id}
                      highlight={highlight}
                      index={index}
                      total={form.highlights.length}
                      releasePlatforms={form.platforms}
                      expanded={expanded.has(highlight.id)}
                      disabled={disabled}
                      onToggle={() =>
                        setExpanded((current) => {
                          const next = new Set(current);
                          if (next.has(highlight.id)) next.delete(highlight.id);
                          else next.add(highlight.id);
                          return next;
                        })
                      }
                      onChange={(value) => updateHighlight(index, value)}
                      onMove={(direction) => moveHighlight(index, direction)}
                      onRemove={() => removeHighlight(index)}
                    />
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[var(--pv-border)] px-6 py-12 text-center">
                    <FileText className="mx-auto h-6 w-6 text-[var(--pv-text-muted)]" />
                    <h3 className="mt-3 text-sm font-semibold text-[var(--pv-text)]">No highlights yet</h3>
                    <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
                      Add the first change customers should know about.
                    </p>
                    <Button type="button" variant="outline" className="mt-4" onClick={addHighlight} disabled={disabled}>
                      <Plus className="mr-2 h-4 w-4" /> Add highlight
                    </Button>
                  </div>
                )}
              </div>
            </section>
          </main>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <section className={cn(panelClass, 'p-5')}>
              <h2 className="text-base font-bold text-[var(--pv-text)]">Release settings</h2>
              <p className="mt-1 text-sm text-[var(--pv-text-muted)]">Publishing, timing, and platforms.</p>
              <div className="mt-5 space-y-5">
                <Field label="Version">
                  <TextInput
                    value={form.version}
                    onChange={(event) => setField('version', event.currentTarget.value)}
                    disabled={disabled}
                    placeholder="1.2.0"
                    maxLength={32}
                    size="md"
                    classNames={mantineFieldClassNames}
                  />
                  <p className="text-xs text-[var(--pv-text-muted)]">Use X.Y.Z · {releaseTypeLabel(form.version)}</p>
                </Field>

                <Field label="Status">
                  <Select
                    value={form.status}
                    onChange={(value) => value && setField('status', value as ReleaseEditorFormState['status'])}
                    data={[
                      { value: 'draft', label: 'Draft' },
                      { value: 'published', label: 'Published' },
                    ]}
                    disabled={disabled}
                    allowDeselect={false}
                    size="md"
                    classNames={mantineSelectClassNames}
                  />
                </Field>

                <Field label="Release timing">
                  <Select
                    value={form.timing.kind}
                    onChange={(value) => {
                      if (value === 'date') setField('timing', { kind: 'date', value: domaniReleaseCalendarDate() });
                      if (value === 'month') setField('timing', { kind: 'month', value: domaniReleaseCalendarMonth() });
                      if (value === 'tbd') setField('timing', { kind: 'tbd', value: null });
                    }}
                    data={[
                      { value: 'date', label: 'Exact date' },
                      { value: 'month', label: 'Month only' },
                      { value: 'tbd', label: 'To be announced' },
                    ]}
                    disabled={disabled}
                    allowDeselect={false}
                    size="md"
                    classNames={mantineSelectClassNames}
                  />
                  {form.timing.kind === 'date' && (
                    <DateInput
                      value={form.timing.value || null}
                      onChange={(value) => setField('timing', { kind: 'date', value: value || '' })}
                      disabled={disabled}
                      minDate={form.status === 'draft' ? domaniReleaseCalendarDate() : undefined}
                      valueFormat="MMMM D, YYYY"
                      placeholder="Choose a date"
                      size="md"
                      classNames={mantineFieldClassNames}
                    />
                  )}
                  {form.timing.kind === 'month' && (
                    <MonthPickerInput
                      value={form.timing.value ? `${form.timing.value}-01` : null}
                      onChange={(value) => setField('timing', { kind: 'month', value: value?.slice(0, 7) || '' })}
                      disabled={disabled}
                      minDate={domaniReleaseCalendarDateValue()}
                      valueFormat="MMMM YYYY"
                      placeholder="Choose a month"
                      size="md"
                      classNames={mantineFieldClassNames}
                    />
                  )}
                  <p className="rounded-lg bg-[var(--pv-surface)] px-3 py-2 text-xs leading-5 text-[var(--pv-text-muted)]">
                    {placementCopy}
                  </p>
                </Field>

                <Field label="Platforms">
                  <PlatformChoices
                    value={form.platforms}
                    onChange={(value) => setField('platforms', value)}
                    disabled={disabled}
                  />
                  <p className="text-xs text-[var(--pv-text-muted)]">Highlights use these platforms unless you choose otherwise.</p>
                </Field>
              </div>
            </section>

            <section className={cn(panelClass, 'p-5')}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-[var(--pv-text)]">Team notes</h2>
                  <p className="mt-1 text-sm text-[var(--pv-text-muted)]">Private context for your team.</p>
                </div>
                <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">Private</span>
              </div>
              {form.internalSummary.trim() ? (
                <p className="mt-4 max-h-28 overflow-hidden whitespace-pre-line text-sm leading-6 text-[var(--pv-text-muted)]">
                  {form.internalSummary}
                </p>
              ) : (
                <p className="mt-4 text-sm text-[var(--pv-text-muted)]">No team notes yet.</p>
              )}
              <Button type="button" variant="outline" className="mt-4 w-full" onClick={() => setTeamNotesOpen(true)} disabled={disabled}>
                {form.internalSummary.trim() ? 'Edit team notes' : 'Add team notes'}
              </Button>
            </section>

            {release && !release.archivedAt && release.allowedActions.includes('archive') && (
              <section className="border-t border-[var(--pv-border)] pt-5">
                <h2 className="text-sm font-semibold text-[var(--pv-text)]">Release actions</h2>
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-2 justify-start px-0 text-red-600 hover:bg-transparent hover:text-red-700 dark:text-red-300"
                  onClick={() => setArchiveOpen(true)}
                  disabled={disabled || dirty}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Archive release
                </Button>
                {dirty && <p className="text-xs text-[var(--pv-text-muted)]">Save or discard your changes before archiving.</p>}
              </section>
            )}
          </aside>
        </div>
      </div>

      <Dialog open={teamNotesOpen} onOpenChange={setTeamNotesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Team notes</DialogTitle>
            <DialogDescription>
              Add private QA, support, or technical context. Customers will never see this.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={form.internalSummary}
            onChange={(event) => setField('internalSummary', event.currentTarget.value)}
            placeholder="Add helpful context for the team…"
            autosize
            minRows={8}
            maxRows={16}
            maxLength={10000}
            disabled={disabled}
            classNames={mantineFieldClassNames}
          />
          <DialogFooter>
            <DialogClose asChild><Button type="button">Done</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive this release?</DialogTitle>
            <DialogDescription>
              It will be removed from active release lists and hidden from customers. Its history will be kept.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="button" variant="destructive" onClick={() => void archive()} disabled={archiving}>
              {archiving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Archive release
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
