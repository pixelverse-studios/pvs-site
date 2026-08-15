import { describe, expect, it } from 'vitest';
import type { AdminReleaseDetail, AdminReleaseNote } from '../../../../../lib/types/admin-release';
import {
  emptyReleaseForm,
  deriveReleaseType,
  firstFieldError,
  formatReleasedDate,
  lifecycleOptions,
  noteFormError,
  publicationReadiness,
  releaseFormError,
  releaseTypeLabel,
  wouldRemoveLastPublicNote,
  type ReleaseFormState,
} from './release-rules';

const note = (overrides: Partial<AdminReleaseNote> = {}): AdminReleaseNote => ({
  id: 'note-1',
  releaseId: 'release-1',
  noteType: 'feature',
  publicTitle: 'Clear mornings',
  publicBody: 'Plan the night before.',
  technicalNotes: null,
  platforms: ['ios', 'android'],
  isPublic: true,
  sortOrder: 0,
  sourcePrdId: null,
  sourceConversionRunId: null,
  rowVersion: 1,
  createdAt: '2026-08-13T00:00:00.000Z',
  updatedAt: '2026-08-13T00:00:00.000Z',
  archivedAt: null,
  ...overrides,
});

const release = (overrides: Partial<AdminReleaseDetail> = {}): AdminReleaseDetail => ({
  id: 'release-1',
  version: '1.2.0',
  slug: 'clear-mornings',
  title: 'Clear mornings',
  releaseType: 'minor',
  lifecycleStatus: 'planned',
  visibility: 'private',
  publicOverview: {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Plan tomorrow tonight.' }] }],
  },
  publicSummary: 'Plan tomorrow tonight.',
  internalSummary: null,
  targetMonth: null,
  targetDate: null,
  confirmedDate: null,
  releasedAt: null,
  ownerUserId: null,
  rowVersion: 1,
  createdAt: '2026-08-13T00:00:00.000Z',
  updatedAt: '2026-08-13T00:00:00.000Z',
  archivedAt: null,
  notes: [note()],
  sources: [],
  allowedActions: ['edit', 'publish_preview'],
  ...overrides,
});

const form = (overrides: Partial<ReleaseFormState> = {}): ReleaseFormState => ({
  ...emptyReleaseForm,
  version: '1.2.0',
  title: 'Clear mornings',
  publicOverview: {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Plan tomorrow tonight.' }] }],
  },
  ...overrides,
});

describe('release identity and lifecycle rules', () => {
  it('derives the release type from canonical semantic versions', () => {
    expect(deriveReleaseType('2.0.0')).toBe('major');
    expect(deriveReleaseType('1.2.0')).toBe('minor');
    expect(deriveReleaseType('1.2.1')).toBe('patch');
    expect(releaseTypeLabel('1.2.1')).toBe('Patch / bug fix');
    expect(deriveReleaseType('1.2')).toBeNull();
  });

  it('rejects malformed identity fields', () => {
    expect(releaseFormError(form({ version: '01.2.0' }), true)).toMatch(/valid X\.Y\.Z/);
    expect(releaseFormError(form({ version: '1.2' }), true)).toMatch(/valid X\.Y\.Z/);
    expect(releaseFormError(form({ title: ' ' }), true)).toBe('Enter a release title.');
  });

  it('requires a rich quick description for visible releases', () => {
    const emptyOverview = { type: 'doc' as const, content: [{ type: 'paragraph' as const }] };
    expect(
      releaseFormError(form({ publicOverview: emptyOverview }), false, 'public_preview'),
    ).toMatch(/require a quick description/);
    expect(releaseFormError(form({ publicOverview: emptyOverview }), false, 'private')).toBeNull();
  });

  it('only offers DEV-1005 lifecycle transitions', () => {
    expect(lifecycleOptions(release({ lifecycleStatus: 'draft' }))).toEqual([
      'draft',
      'planned',
      'canceled',
    ]);
    expect(lifecycleOptions(release({ lifecycleStatus: 'planned' }))).toEqual([
      'planned',
      'in_progress',
      'canceled',
    ]);
    expect(
      lifecycleOptions(release({ lifecycleStatus: 'planned', visibility: 'public_preview' })),
    ).toEqual(['planned', 'in_progress']);
    expect(lifecycleOptions(release({ lifecycleStatus: 'released' }))).toEqual(['released']);
  });
});

describe('publication and note rules', () => {
  it('requires a public summary and active public note before publication', () => {
    expect(publicationReadiness(release())).toEqual({ ready: true, message: null });
    expect(publicationReadiness(release({ publicOverview: null, notes: [] }))).toEqual({
      ready: false,
      message:
        'Before publishing, add a quick description and at least one public release highlight.',
    });
    expect(
      publicationReadiness(release({ notes: [note({ archivedAt: '2026-08-13' })] })).ready,
    ).toBe(false);
  });

  it('enforces note field limits after Markdown normalization', () => {
    expect(noteFormError(' ', 'body', '')).toMatch(/title/);
    expect(noteFormError('Title', ' \r\n ', '')).toMatch(/content/);
    expect(noteFormError('Title', 'x'.repeat(4001), '')).toMatch(/4,000/);
    expect(noteFormError('Title', 'Body', 'x'.repeat(20001))).toMatch(/20,000/);
    expect(noteFormError('Title', 'Body', 'Implementation detail')).toBeNull();
  });

  it('protects the last public note on visible releases', () => {
    expect(
      wouldRemoveLastPublicNote(release({ visibility: 'public_preview' }), 'note-1', false),
    ).toBe(true);
    expect(wouldRemoveLastPublicNote(release(), 'note-1', false)).toBe(false);
    expect(
      wouldRemoveLastPublicNote(
        release({ visibility: 'published', notes: [note(), note({ id: 'note-2' })] }),
        'note-1',
        false,
      ),
    ).toBe(false);
  });
});

describe('error and date presentation', () => {
  it('surfaces the first stable API field error', () => {
    expect(firstFieldError({ title: [], publicBody: ['Public body is too long'] })).toBe(
      'Public body is too long',
    );
    expect(firstFieldError({})).toBeNull();
  });

  it('formats released timestamps using the UTC calendar date', () => {
    expect(formatReleasedDate('2026-08-13T00:30:00+14:00')).toBe('Aug 12, 2026');
  });
});
