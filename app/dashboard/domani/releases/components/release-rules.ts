import type {
  AdminReleaseDetail,
  PublicOverviewDocument,
  PublicOverviewNode,
  ReleaseNoteType,
  ReleasePlatform,
  ReleaseStatus,
  ReleaseTiming,
  ReleaseType,
  SaveReleaseEditorInput,
} from '../../../../../lib/types/admin-release';

export interface ReleaseHighlightFormState {
  id: string;
  rowVersion: number | null;
  noteType: ReleaseNoteType;
  publicTitle: string;
  publicBody: string;
  technicalNotes: string;
  platformOverride: ReleasePlatform[] | null;
  isPublic: boolean;
}

export interface ReleaseEditorFormState {
  version: string;
  title: string;
  status: ReleaseStatus;
  timing: ReleaseTiming;
  platforms: ReleasePlatform[];
  publicOverview: PublicOverviewDocument;
  internalSummary: string;
  highlights: ReleaseHighlightFormState[];
}

export const emptyPublicOverview: PublicOverviewDocument = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

const samePlatforms = (left: ReleasePlatform[], right: ReleasePlatform[]) =>
  [...left].sort().join(',') === [...right].sort().join(',');

export function emptyReleaseEditorForm(): ReleaseEditorFormState {
  return {
    version: '',
    title: '',
    status: 'draft',
    timing: { kind: 'tbd', value: null },
    platforms: ['ios', 'android'],
    publicOverview: emptyPublicOverview,
    internalSummary: '',
    highlights: [],
  };
}

function timingFromRelease(release: AdminReleaseDetail): ReleaseTiming {
  if (release.timing) return release.timing;
  if (release.confirmedDate || release.targetDate) {
    return { kind: 'date', value: release.confirmedDate || release.targetDate || '' };
  }
  if (release.targetMonth) return { kind: 'month', value: release.targetMonth };
  return { kind: 'tbd', value: null };
}

export function releaseEditorFormFromRelease(release: AdminReleaseDetail): ReleaseEditorFormState {
  const releasePlatforms: ReleasePlatform[] = release.platforms?.length
    ? release.platforms
    : ['ios', 'android'];
  return {
    version: release.version,
    title: release.title,
    status: release.status || (release.visibility === 'private' ? 'draft' : 'published'),
    timing: timingFromRelease(release),
    platforms: releasePlatforms,
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
    highlights: release.notes.map((note) => ({
      id: note.id,
      rowVersion: note.rowVersion,
      noteType: note.noteType,
      publicTitle: note.publicTitle,
      publicBody: note.publicBody,
      technicalNotes: note.technicalNotes || '',
      platformOverride: samePlatforms(note.platforms, releasePlatforms) ? null : note.platforms,
      isPublic: note.isPublic,
    })),
  };
}

function canonicalJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, entry]) => entry !== undefined)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, canonicalJson(entry)]),
    );
  }
  return value;
}

export function releaseEditorFormsEqual(
  left: ReleaseEditorFormState,
  right: ReleaseEditorFormState,
): boolean {
  return JSON.stringify(canonicalJson(left)) === JSON.stringify(canonicalJson(right));
}

const versionPattern = /^(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})$/;

export function publicOverviewText(document: PublicOverviewDocument | null): string {
  if (!document) return '';
  const walk = (node: PublicOverviewNode): string => {
    if (node.type === 'text') return node.text || '';
    return (node.content || []).map(walk).join(' ');
  };
  return walk(document).replace(/\s+/g, ' ').trim();
}

export function deriveReleaseType(version: string): ReleaseType | null {
  const match = version.match(versionPattern);
  if (!match) return null;
  if (Number(match[3]) > 0) return 'patch';
  if (Number(match[2]) > 0) return 'minor';
  return 'major';
}

export function releaseTypeLabel(version: string): string {
  const type = deriveReleaseType(version);
  if (type === 'patch') return 'Patch release';
  if (type === 'minor') return 'Minor release';
  if (type === 'major') return 'Major release';
  return 'Enter a complete version';
}

export type PublicReleaseDestination = 'private' | 'coming-soon' | 'changelog';

export const DOMANI_RELEASE_TIME_ZONE = 'America/New_York';

export function domaniReleaseCalendarDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: DOMANI_RELEASE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const values = Object.fromEntries(
    parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

export function domaniReleaseCalendarMonth(now = new Date()): string {
  return domaniReleaseCalendarDate(now).slice(0, 7);
}

export function domaniReleaseCalendarDateValue(now = new Date()): Date {
  return new Date(`${domaniReleaseCalendarDate(now)}T12:00:00`);
}

export function releaseDestination(
  form: Pick<ReleaseEditorFormState, 'status' | 'timing'>,
  today = domaniReleaseCalendarDate(),
): PublicReleaseDestination {
  if (form.status === 'draft') return 'private';
  if (form.timing.kind === 'date' && form.timing.value <= today) return 'changelog';
  return 'coming-soon';
}

export function destinationMessage(form: Pick<ReleaseEditorFormState, 'status' | 'timing'>) {
  const destination = releaseDestination(form);
  if (destination === 'private') return 'Only your team can see this release.';
  if (destination === 'changelog') return 'This release will appear in the public changelog.';
  return 'This release will appear on the Coming Soon page.';
}

const timingMatches = (left: ReleaseTiming, right: ReleaseTiming) =>
  left.kind === right.kind && left.value === right.value;

export function releaseEditorFormError(
  form: ReleaseEditorFormState,
  baseline?: ReleaseEditorFormState,
): string | null {
  if (!versionPattern.test(form.version)) {
    return 'Enter a complete version such as 1.2.0 or 1.2.1.';
  }
  if (!form.title.trim()) return 'Add a release title.';
  if (form.title.trim().length > 160) return 'Keep the release title under 160 characters.';
  if (!form.platforms.length) return 'Choose at least one release platform.';
  if (form.timing.kind === 'date') {
    if (!form.timing.value) return 'Choose a release date.';
    if (
      form.status === 'draft' &&
      form.timing.value < domaniReleaseCalendarDate() &&
      (!baseline || !timingMatches(form.timing, baseline.timing))
    ) {
      return 'Choose today or a future release date.';
    }
  }
  if (form.timing.kind === 'month') {
    if (!form.timing.value) return 'Choose a release month.';
    if (
      form.timing.value < domaniReleaseCalendarMonth() &&
      (!baseline || !timingMatches(form.timing, baseline.timing))
    ) {
      return 'Choose the current month or a future month.';
    }
  }
  const overview = publicOverviewText(form.publicOverview);
  if (overview.length > 10000) return 'Keep the quick description under 10,000 characters.';
  if (form.internalSummary.length > 10000) return 'Keep team notes under 10,000 characters.';
  for (let index = 0; index < form.highlights.length; index += 1) {
    const highlight = form.highlights[index];
    if (!highlight.publicTitle.trim()) return `Add a title to highlight ${index + 1}.`;
    if (highlight.publicTitle.trim().length > 160) {
      return `Keep highlight ${index + 1}'s title under 160 characters.`;
    }
    if (!highlight.publicBody.trim()) return `Add content to highlight ${index + 1}.`;
    if (highlight.publicBody.trim().length > 4000) {
      return `Keep highlight ${index + 1} under 4,000 characters.`;
    }
  }
  if (form.status === 'published' && !overview) {
    return 'Add a quick description before publishing.';
  }
  if (form.status === 'published' && !form.highlights.some((highlight) => highlight.isPublic)) {
    return 'Include at least one public highlight before publishing.';
  }
  return null;
}

export function releaseEditorPayload(form: ReleaseEditorFormState): SaveReleaseEditorInput {
  return {
    version: form.version,
    title: form.title.trim(),
    status: form.status,
    timing: form.timing,
    platforms: form.platforms,
    publicOverview: form.publicOverview,
    internalSummary: form.internalSummary.trim() || null,
    highlights: form.highlights.map((highlight) => ({
      id: highlight.id,
      rowVersion: highlight.rowVersion,
      noteType: highlight.noteType,
      publicTitle: highlight.publicTitle.trim(),
      publicBody: highlight.publicBody.replace(/\r\n?/g, '\n').trim(),
      technicalNotes: highlight.technicalNotes.trim() || null,
      platforms: highlight.platformOverride || form.platforms,
      isPublic: highlight.isPublic,
    })),
  };
}

export function formatReleasedDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: DOMANI_RELEASE_TIME_ZONE,
  });
}
