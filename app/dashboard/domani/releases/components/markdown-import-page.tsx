'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Select, TextInput, Textarea } from '@mantine/core';
import { ArrowLeft, FileText, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { importReleaseMarkdown, listReleases } from '@/lib/api/admin-releases';
import type {
  AdminRelease,
  ReleaseIntendedSurface,
  ReleaseSourceType,
} from '@/lib/types/admin-release';
import { cn } from '@/lib/utils';
import { mantineFieldClassNames, mantineSelectClassNames, panelClass } from './release-ui';

const MAX_MARKDOWN_BYTES = 1_048_576;
const versionPattern = /^(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})$/;

const sourceOptions = [
  { value: 'linear_epic', label: 'Linear epic' },
  { value: 'linear_ticket', label: 'Linear ticket' },
  { value: 'milestone', label: 'Milestone' },
  { value: 'manual', label: 'Manual source' },
];

export function MarkdownImportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInput = useRef<HTMLInputElement>(null);
  const requestedReleaseId = searchParams.get('releaseId') || '';
  const [releases, setReleases] = useState<AdminRelease[]>([]);
  const [targetMode, setTargetMode] = useState<'existing' | 'new'>(
    requestedReleaseId ? 'existing' : 'new',
  );
  const [releaseId, setReleaseId] = useState(requestedReleaseId);
  const [version, setVersion] = useState('');
  const [title, setTitle] = useState('');
  const [sourceType, setSourceType] = useState<ReleaseSourceType>('milestone');
  const [sourceReference, setSourceReference] = useState('');
  const [intendedSurface, setIntendedSurface] = useState<ReleaseIntendedSurface>('changelog');
  const [markdown, setMarkdown] = useState('');
  const [file, setFile] = useState<File | undefined>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listReleases()
      .then((response) => setReleases(response.data.releases))
      .catch((caught) =>
        setError(caught instanceof Error ? caught.message : 'Unable to load releases.'),
      )
      .finally(() => setLoading(false));
  }, []);

  const selectedRelease = useMemo(
    () => releases.find((release) => release.id === releaseId),
    [releaseId, releases],
  );

  const chooseFile = async (nextFile?: File) => {
    if (!nextFile) return;
    setError(null);
    if (!nextFile.name.toLowerCase().endsWith('.md')) {
      setError('Choose a Markdown file ending in .md.');
      return;
    }
    if (nextFile.size > MAX_MARKDOWN_BYTES) {
      setError('Keep the Markdown source at or below 1 MB.');
      return;
    }
    try {
      const text = await nextFile.text();
      setFile(nextFile);
      setMarkdown(text);
    } catch {
      setError('This file could not be read. Choose a valid UTF-8 Markdown file.');
    }
  };

  const submit = async () => {
    setError(null);
    if (!markdown.trim()) return setError('Paste Markdown or choose a .md file.');
    if (new TextEncoder().encode(markdown).byteLength > MAX_MARKDOWN_BYTES) {
      return setError('Keep the Markdown source at or below 1 MB.');
    }
    if (!sourceReference.trim()) return setError('Add the source reference.');
    if (targetMode === 'existing' && !selectedRelease) {
      return setError('Choose the release that should receive this source.');
    }
    if (targetMode === 'new' && !versionPattern.test(version)) {
      return setError('Enter a complete version such as 1.2.0.');
    }
    if (targetMode === 'new' && !title.trim()) return setError('Add the release title.');

    setSubmitting(true);
    try {
      const result = await importReleaseMarkdown({
        ...(file ? { file } : { markdown }),
        ...(targetMode === 'existing'
          ? { releaseId: selectedRelease!.id, releaseRowVersion: selectedRelease!.rowVersion }
          : { releaseVersion: version, releaseTitle: title.trim() }),
        sourceType,
        sourceReference: sourceReference.trim(),
        intendedSurface,
      });
      router.push(`/dashboard/domani/releases/${result.release.id}/sources/${result.source.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Markdown import failed.');
    } finally {
      setSubmitting(false);
    }
  };

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
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
              Release source
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-[var(--pv-text)] sm:text-4xl">
              Import Markdown
            </h1>
            <p className="mt-2 text-sm text-[var(--pv-text-muted)]">
              Save the original source unchanged, then convert it into private notes for review.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => void submit()}
            disabled={submitting || loading}
            className="min-w-44 bg-violet-600 text-white hover:bg-violet-700"
          >
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            Create private draft
          </Button>
        </header>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(22rem,0.78fr)_minmax(0,1.22fr)]">
          <section className={cn(panelClass, 'p-6')}>
            <h2 className="text-lg font-bold text-[var(--pv-text)]">Source and destination</h2>
            <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
              Choose where this source belongs and record where it came from.
            </p>

            <div className="mt-6 grid grid-cols-2 rounded-xl bg-[var(--pv-surface)] p-1">
              {(['new', 'existing'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTargetMode(mode)}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-semibold transition',
                    targetMode === mode
                      ? 'bg-[var(--pv-card)] text-[var(--pv-text)] shadow-sm'
                      : 'text-[var(--pv-text-muted)]',
                  )}
                >
                  {mode === 'new' ? 'Create new release' : 'Existing release'}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-5">
              {targetMode === 'existing' ? (
                <Select
                  label="Release"
                  value={releaseId}
                  onChange={(value) => setReleaseId(value || '')}
                  data={releases.map((release) => ({
                    value: release.id,
                    label: `${release.version} · ${release.title}`,
                  }))}
                  searchable
                  disabled={loading}
                  placeholder={loading ? 'Loading releases…' : 'Choose a release'}
                  classNames={mantineSelectClassNames}
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput
                    label="Version"
                    value={version}
                    onChange={(event) => setVersion(event.currentTarget.value)}
                    placeholder="1.2.0"
                    classNames={mantineFieldClassNames}
                  />
                  <TextInput
                    label="Release title"
                    value={title}
                    onChange={(event) => setTitle(event.currentTarget.value)}
                    placeholder="Clearer daily planning"
                    classNames={mantineFieldClassNames}
                  />
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Source type"
                  value={sourceType}
                  onChange={(value) => value && setSourceType(value as ReleaseSourceType)}
                  data={sourceOptions}
                  allowDeselect={false}
                  classNames={mantineSelectClassNames}
                />
                <TextInput
                  label="Source reference"
                  value={sourceReference}
                  onChange={(event) => setSourceReference(event.currentTarget.value)}
                  placeholder="DEV-1004 or 1.1-changelog"
                  classNames={mantineFieldClassNames}
                />
              </div>

              <Select
                label="Intended public page"
                value={intendedSurface}
                onChange={(value) => value && setIntendedSurface(value as ReleaseIntendedSurface)}
                data={[
                  { value: 'changelog', label: 'Changelog' },
                  { value: 'coming_soon', label: 'Coming Soon' },
                  { value: 'both', label: 'Both pages' },
                ]}
                allowDeselect={false}
                classNames={mantineSelectClassNames}
              />

              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  void chooseFile(event.dataTransfer.files[0]);
                }}
                className="flex min-h-40 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-violet-300 bg-violet-50/50 px-5 text-center transition hover:border-violet-500 hover:bg-violet-50 dark:bg-violet-500/5"
              >
                <Upload className="h-6 w-6 text-violet-600" />
                <span className="mt-3 text-sm font-bold text-[var(--pv-text)]">
                  Drop a Markdown file or choose one
                </span>
                <span className="mt-1 text-xs text-[var(--pv-text-muted)]">
                  .md files up to 1 MB
                </span>
                {file && (
                  <span className="mt-3 text-xs font-semibold text-violet-700">{file.name}</span>
                )}
              </button>
              <input
                ref={fileInput}
                type="file"
                accept=".md,text/markdown,text/plain"
                className="sr-only"
                onChange={(event) => void chooseFile(event.target.files?.[0])}
              />
            </div>

            <div className="mt-6 border-t border-[var(--pv-border)] pt-5 text-xs leading-5 text-[var(--pv-text-muted)]">
              <p className="font-bold text-[var(--pv-text)]">Import rules</p>
              <p className="mt-1">The raw source is stored exactly as submitted.</p>
              <p>No note becomes public until a person reviews and publishes the release.</p>
            </div>
          </section>

          <section className={cn(panelClass, 'flex min-h-[42rem] flex-col p-6')}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--pv-text)]">Markdown preview</h2>
                <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
                  Paste content here or use the file picker.
                </p>
              </div>
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                {new TextEncoder().encode(markdown).byteLength.toLocaleString()} bytes
              </span>
            </div>
            <Textarea
              aria-label="Raw Markdown"
              value={markdown}
              onChange={(event) => {
                setMarkdown(event.currentTarget.value);
                setFile(undefined);
              }}
              placeholder="# Release title\n\n## Feature\n\nDescribe what changed…"
              autosize={false}
              classNames={{
                ...mantineFieldClassNames,
                input:
                  'mt-5 min-h-[35rem] resize-y rounded-2xl border-[#312c3b] bg-[#292432] p-6 font-mono text-sm leading-7 text-[#f3eefb] placeholder:text-[#8e869b] focus:border-violet-400',
              }}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
