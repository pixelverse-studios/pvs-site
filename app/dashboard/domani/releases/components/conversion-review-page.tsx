'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Select, TextInput, Textarea } from '@mantine/core';
import { ArrowLeft, Check, FileText, Loader2, RefreshCw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  approveConvertedSource,
  convertReleaseMarkdown,
  getRelease,
  saveReleaseEditor,
} from '@/lib/api/admin-releases';
import type {
  AdminReleaseDetail,
  AdminReleaseNote,
  AdminReleaseSource,
  ReleaseNoteType,
} from '@/lib/types/admin-release';
import { cn } from '@/lib/utils';
import { releaseEditorFormFromRelease, releaseEditorPayload } from './release-rules';
import { mantineFieldClassNames, mantineSelectClassNames, panelClass } from './release-ui';

const statusLabel = (source: AdminReleaseSource) => {
  if (source.conversionStatus === 'raw') return 'Ready to convert';
  if (source.conversionStatus === 'needs_review') return 'Needs review';
  if (source.conversionStatus === 'approved') return 'Approved';
  if (source.conversionStatus === 'failed') return 'Conversion failed';
  return 'Superseded';
};

const noteTypeOptions = [
  { value: 'feature', label: 'New feature' },
  { value: 'improvement', label: 'Improvement' },
  { value: 'fix', label: 'Bug fix' },
  { value: 'breaking', label: 'Important change' },
];

export function ConversionReviewPage({
  releaseId,
  sourceId,
}: {
  releaseId: string;
  sourceId: string;
}) {
  const [release, setRelease] = useState<AdminReleaseDetail | null>(null);
  const [drafts, setDrafts] = useState<AdminReleaseNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<'convert' | 'save' | 'approve' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await getRelease(releaseId);
      const source = next.sources.find((entry) => entry.id === sourceId);
      if (!source) throw new Error('This Markdown source no longer exists.');
      const generated = next.notes.filter(
        (note) =>
          note.sourcePrdId === source.id &&
          (!source.latestConversionRunId ||
            note.sourceConversionRunId === source.latestConversionRunId),
      );
      setRelease(next);
      setDrafts(generated);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load this source.');
    } finally {
      setLoading(false);
    }
  }, [releaseId, sourceId]);

  useEffect(() => {
    void load();
  }, [load]);

  const source = release?.sources.find((entry) => entry.id === sourceId) || null;
  const originalDrafts = useMemo(() => {
    if (!release || !source) return [];
    return release.notes.filter(
      (note) =>
        note.sourcePrdId === source.id &&
        (!source.latestConversionRunId ||
          note.sourceConversionRunId === source.latestConversionRunId),
    );
  }, [release, source]);
  const dirty = JSON.stringify(drafts) !== JSON.stringify(originalDrafts);

  const convert = async () => {
    if (!release || !source) return;
    setWorking('convert');
    setError(null);
    setNotice(null);
    try {
      await convertReleaseMarkdown(release.id, source, release.rowVersion);
      await load();
      setNotice('Private release-note drafts are ready for review.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Markdown conversion failed.');
    } finally {
      setWorking(null);
    }
  };

  const saveDrafts = async () => {
    if (!release || !source) return null;
    setWorking('save');
    setError(null);
    setNotice(null);
    try {
      const form = releaseEditorFormFromRelease(release);
      form.highlights = form.highlights.map((highlight) => {
        const draft = drafts.find((entry) => entry.id === highlight.id);
        if (!draft) return highlight;
        return {
          ...highlight,
          noteType: draft.noteType,
          publicTitle: draft.publicTitle,
          publicBody: draft.publicBody,
          isPublic: false,
        };
      });
      const saved = await saveReleaseEditor(
        release.id,
        release.rowVersion,
        releaseEditorPayload(form),
      );
      setRelease(saved);
      const savedSource = saved.sources.find((entry) => entry.id === source.id);
      const savedDrafts = saved.notes.filter(
        (note) =>
          note.sourcePrdId === source.id &&
          (!savedSource?.latestConversionRunId ||
            note.sourceConversionRunId === savedSource.latestConversionRunId),
      );
      setDrafts(savedDrafts);
      setNotice('Private drafts saved.');
      return { release: saved, source: savedSource, notes: savedDrafts };
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Private drafts could not be saved.');
      return null;
    } finally {
      setWorking(null);
    }
  };

  const approve = async () => {
    if (!release || !source) return;
    setWorking('approve');
    setError(null);
    setNotice(null);
    try {
      let currentRelease = release;
      let currentSource = source;
      let currentNotes = drafts;
      if (dirty) {
        const saved = await saveDrafts();
        if (!saved?.source) return;
        currentRelease = saved.release;
        currentSource = saved.source;
        currentNotes = saved.notes;
        setWorking('approve');
      }
      await approveConvertedSource(
        currentRelease.id,
        currentSource,
        currentRelease.rowVersion,
        currentNotes,
      );
      await load();
      setNotice('Source approved. The notes are still private until you publish the release.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Source approval failed.');
    } finally {
      setWorking(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[var(--pv-text-muted)]">
        <Loader2 className="mr-3 h-5 w-5 animate-spin" /> Loading source…
      </div>
    );
  }

  if (!release || !source) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
        <FileText className="h-7 w-7 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold text-[var(--pv-text)]">
          Source could not be loaded
        </h1>
        <p className="mt-2 text-sm text-[var(--pv-text-muted)]">{error}</p>
        <Button className="mt-5" variant="outline" onClick={() => void load()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  const canConvert = ['raw', 'failed', 'needs_review', 'approved'].includes(
    source.conversionStatus,
  );
  const canApprove = source.conversionStatus === 'needs_review' && drafts.length > 0;

  return (
    <div className="w-full px-4 pb-16 pt-4 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[1800px]">
        <Link
          href={`/dashboard/domani/releases/${release.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--pv-text-muted)] hover:text-[var(--pv-text)]"
        >
          <ArrowLeft className="h-4 w-4" /> Release {release.version}
        </Link>

        <header className="mt-7 flex flex-col gap-5 border-b border-[var(--pv-border)] pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                Conversion review
              </p>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                {statusLabel(source)}
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-[var(--pv-text)] sm:text-4xl">
              Review converted draft
            </h1>
            <p className="mt-2 text-sm text-[var(--pv-text-muted)]">
              Compare the saved source with editable private notes before approving them.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {canConvert && (
              <Button
                type="button"
                variant="outline"
                onClick={() => void convert()}
                disabled={Boolean(working)}
              >
                {working === 'convert' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                {drafts.length ? 'Convert again' : 'Convert Markdown'}
              </Button>
            )}
            {drafts.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => void saveDrafts()}
                disabled={Boolean(working) || !dirty}
              >
                {working === 'save' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save drafts
              </Button>
            )}
            {canApprove && (
              <Button
                type="button"
                onClick={() => void approve()}
                disabled={Boolean(working)}
                className="bg-violet-600 text-white hover:bg-violet-700"
              >
                {working === 'approve' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Approve notes
              </Button>
            )}
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}
        {notice && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {notice}
          </div>
        )}

        <div className="mt-7 grid gap-7 xl:grid-cols-2">
          <section className={cn(panelClass, 'flex min-h-[42rem] flex-col p-6')}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--pv-text)]">Source Markdown</h2>
                <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
                  Stored exactly as submitted.
                </p>
              </div>
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                {source.sourceReference}
              </span>
            </div>
            <pre className="mt-5 min-h-[35rem] flex-1 overflow-auto whitespace-pre-wrap rounded-2xl bg-[#292432] p-6 font-mono text-sm leading-7 text-[#f3eefb]">
              {source.rawMarkdown}
            </pre>
          </section>

          <section className={cn(panelClass, 'p-6')}>
            <div>
              <h2 className="text-lg font-bold text-[var(--pv-text)]">Generated public drafts</h2>
              <p className="mt-1 text-sm text-[var(--pv-text-muted)]">
                Edit customer wording here. Every generated note remains team-only.
              </p>
            </div>

            {drafts.length ? (
              <div className="mt-5 space-y-4">
                {drafts.map((note, index) => (
                  <article
                    key={note.id}
                    className="rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-surface)] p-5"
                  >
                    <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
                      <Select
                        label={`Note ${index + 1}`}
                        value={note.noteType}
                        onChange={(value) =>
                          value &&
                          setDrafts((current) =>
                            current.map((entry) =>
                              entry.id === note.id
                                ? { ...entry, noteType: value as ReleaseNoteType }
                                : entry,
                            ),
                          )
                        }
                        data={noteTypeOptions}
                        allowDeselect={false}
                        classNames={mantineSelectClassNames}
                      />
                      <TextInput
                        label="Title"
                        value={note.publicTitle}
                        onChange={(event) =>
                          setDrafts((current) =>
                            current.map((entry) =>
                              entry.id === note.id
                                ? { ...entry, publicTitle: event.currentTarget.value }
                                : entry,
                            ),
                          )
                        }
                        maxLength={160}
                        classNames={mantineFieldClassNames}
                      />
                    </div>
                    <Textarea
                      label="Public note"
                      value={note.publicBody}
                      onChange={(event) =>
                        setDrafts((current) =>
                          current.map((entry) =>
                            entry.id === note.id
                              ? { ...entry, publicBody: event.currentTarget.value }
                              : entry,
                          ),
                        )
                      }
                      autosize
                      minRows={4}
                      maxRows={12}
                      maxLength={4000}
                      className="mt-4"
                      classNames={mantineFieldClassNames}
                    />
                    <p className="mt-3 text-xs font-semibold text-violet-700">
                      Private until the release is published
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-5 flex min-h-[30rem] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--pv-border)] px-8 text-center">
                <FileText className="h-7 w-7 text-violet-600" />
                <h3 className="mt-4 font-bold text-[var(--pv-text)]">No generated notes yet</h3>
                <p className="mt-2 max-w-sm text-sm text-[var(--pv-text-muted)]">
                  Convert the source to create private notes that you can review and edit.
                </p>
                <Button
                  className="mt-5"
                  onClick={() => void convert()}
                  disabled={!canConvert || Boolean(working)}
                >
                  Convert Markdown
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
