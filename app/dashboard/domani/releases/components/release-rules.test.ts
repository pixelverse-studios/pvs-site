import { describe, expect, it } from 'vitest';
import type { AdminReleaseDetail, AdminReleaseNote } from '../../../../../lib/types/admin-release';
import {
  deriveReleaseType,
  destinationMessage,
  domaniReleaseCalendarDate,
  domaniReleaseCalendarMonth,
  emptyReleaseEditorForm,
  formatReleasedDate,
  releaseDestination,
  releaseEditorFormError,
  releaseEditorFormFromRelease,
  releaseEditorFormsEqual,
  releaseEditorPayload,
  releaseTypeLabel,
  type ReleaseEditorFormState,
} from './release-rules';

const overview = {
  type: 'doc' as const,
  content: [
    {
      type: 'paragraph' as const,
      content: [{ type: 'text' as const, text: 'Plan tomorrow tonight.' }],
    },
  ],
};

const note = (overrides: Partial<AdminReleaseNote> = {}): AdminReleaseNote => ({
  id: '00000000-0000-4000-8000-000000000002',
  releaseId: '00000000-0000-4000-8000-000000000001',
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
  id: '00000000-0000-4000-8000-000000000001',
  version: '1.2.0',
  slug: 'clear-mornings',
  title: 'Clear mornings',
  releaseType: 'minor',
  status: 'draft',
  timing: { kind: 'date', value: '2026-08-30' },
  platforms: ['ios', 'android'],
  lifecycleStatus: 'draft',
  visibility: 'private',
  publicOverview: overview,
  publicSummary: 'Plan tomorrow tonight.',
  internalSummary: null,
  targetMonth: '2026-08',
  targetDate: '2026-08-30',
  confirmedDate: null,
  releasedAt: null,
  ownerUserId: null,
  rowVersion: 1,
  createdAt: '2026-08-13T00:00:00.000Z',
  updatedAt: '2026-08-13T00:00:00.000Z',
  archivedAt: null,
  notes: [note()],
  sources: [],
  allowedActions: ['edit', 'archive'],
  ...overrides,
});

const form = (overrides: Partial<ReleaseEditorFormState> = {}): ReleaseEditorFormState => ({
  ...emptyReleaseEditorForm(),
  version: '1.2.0',
  title: 'Clear mornings',
  publicOverview: overview,
  timing: { kind: 'date', value: '2026-08-30' },
  highlights: [
    {
      id: '00000000-0000-4000-8000-000000000002',
      rowVersion: 1,
      noteType: 'feature',
      publicTitle: 'Clear mornings',
      publicBody: 'Plan the night before.',
      technicalNotes: '',
      platformOverride: null,
      isPublic: true,
    },
  ],
  ...overrides,
});

describe('release identity', () => {
  it('derives the release type from X.Y.Z versions', () => {
    expect(deriveReleaseType('2.0.0')).toBe('major');
    expect(deriveReleaseType('1.2.0')).toBe('minor');
    expect(deriveReleaseType('1.2.1')).toBe('patch');
    expect(releaseTypeLabel('1.2.1')).toBe('Patch release');
    expect(deriveReleaseType('1.2')).toBeNull();
  });

  it('maps saved releases into the single editor form', () => {
    const mapped = releaseEditorFormFromRelease(release());
    expect(mapped.status).toBe('draft');
    expect(mapped.timing).toEqual({ kind: 'date', value: '2026-08-30' });
    expect(mapped.highlights[0].platformOverride).toBeNull();
  });

  it('does not mark equivalent rich content dirty when JSON keys are reordered', () => {
    const left = form();
    const right = form({
      publicOverview: {
        content: [
          { content: [{ text: 'Plan tomorrow tonight.', type: 'text' }], type: 'paragraph' },
        ],
        type: 'doc',
      },
    });
    expect(releaseEditorFormsEqual(left, right)).toBe(true);
    expect(releaseEditorFormsEqual(left, { ...right, title: 'Changed' })).toBe(false);
  });
});

describe('publishing and placement', () => {
  it('keeps drafts private and places published releases by timing', () => {
    expect(releaseDestination(form(), '2026-08-16')).toBe('private');
    expect(
      releaseDestination(
        form({ status: 'published', timing: { kind: 'date', value: '2026-08-16' } }),
        '2026-08-16',
      ),
    ).toBe('changelog');
    expect(
      releaseDestination(
        form({ status: 'published', timing: { kind: 'date', value: '2026-08-17' } }),
        '2026-08-16',
      ),
    ).toBe('coming-soon');
    expect(
      releaseDestination(
        form({ status: 'published', timing: { kind: 'tbd', value: null } }),
        '2026-08-16',
      ),
    ).toBe('coming-soon');
    expect(destinationMessage(form())).toMatch(/Only your team/);
  });

  it('requires customer content only when publishing', () => {
    const noOverview = { type: 'doc' as const, content: [{ type: 'paragraph' as const }] };
    expect(releaseEditorFormError(form({ publicOverview: noOverview }))).toBeNull();
    expect(
      releaseEditorFormError(form({ status: 'published', publicOverview: noOverview })),
    ).toMatch(/quick description/);
    expect(
      releaseEditorFormError(
        form({
          status: 'published',
          highlights: form().highlights.map((item) => ({ ...item, isPublic: false })),
        }),
      ),
    ).toMatch(/public highlight/);
  });

  it('rejects past draft dates and past release months', () => {
    expect(releaseEditorFormError(form({ timing: { kind: 'date', value: '2000-01-01' } }))).toMatch(
      /today or a future release date/,
    );
    expect(releaseEditorFormError(form({ timing: { kind: 'month', value: '2000-01' } }))).toMatch(
      /current month or a future month/,
    );
    expect(
      releaseEditorFormError(
        form({ status: 'published', timing: { kind: 'date', value: '2000-01-01' } }),
      ),
    ).toBeNull();
  });

  it('allows an existing historical timing value while rejecting a newly selected one', () => {
    const historicalDate = form({ timing: { kind: 'date', value: '2000-01-01' } });
    expect(releaseEditorFormError(historicalDate, historicalDate)).toBeNull();
    expect(releaseEditorFormError(historicalDate, form())).toMatch(
      /today or a future release date/,
    );

    const historicalMonth = form({ timing: { kind: 'month', value: '2000-01' } });
    expect(releaseEditorFormError(historicalMonth, historicalMonth)).toBeNull();
    expect(releaseEditorFormError(historicalMonth, form())).toMatch(
      /current month or a future month/,
    );
  });

  it('sends release platforms by default and preserves explicit highlight platforms', () => {
    const inherited = releaseEditorPayload(form({ platforms: ['ios'] }));
    expect(inherited.highlights[0].platforms).toEqual(['ios']);

    const overridden = releaseEditorPayload(
      form({
        platforms: ['ios', 'android'],
        highlights: form().highlights.map((item) => ({ ...item, platformOverride: ['android'] })),
      }),
    );
    expect(overridden.highlights[0].platforms).toEqual(['android']);
  });
});

describe('date presentation', () => {
  it('formats released timestamps using the New York business calendar', () => {
    expect(formatReleasedDate('2026-08-13T00:30:00+14:00')).toBe('Aug 12, 2026');
  });

  it('keeps UTC timestamps before New York midnight on the prior business date', () => {
    const beforeMidnight = new Date('2026-08-17T02:30:00.000Z');
    expect(domaniReleaseCalendarDate(beforeMidnight)).toBe('2026-08-16');
    expect(domaniReleaseCalendarMonth(beforeMidnight)).toBe('2026-08');
  });

  it('rolls the business date at New York midnight', () => {
    expect(domaniReleaseCalendarDate(new Date('2026-08-17T04:30:00.000Z'))).toBe('2026-08-17');
  });
});
