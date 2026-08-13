import type {
  AdminReleaseDetail,
  PublicOverviewDocument,
  ReleaseLifecycle,
  ReleaseType,
  ReleaseVisibility,
} from '../../../../../lib/types/admin-release';

export interface ReleaseFormState {
  version: string;
  title: string;
  lifecycleStatus: ReleaseLifecycle;
  publicOverview: PublicOverviewDocument;
  internalSummary: string;
  targetMonth: string;
  targetDate: string;
}

export const emptyPublicOverview: PublicOverviewDocument = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

export const emptyReleaseForm: ReleaseFormState = {
  version: '',
  title: '',
  lifecycleStatus: 'draft',
  publicOverview: emptyPublicOverview,
  internalSummary: '',
  targetMonth: '',
  targetDate: '',
};

const versionPattern = /^(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})$/;
export function publicOverviewText(document: PublicOverviewDocument | null): string {
  if (!document) return '';
  const walk = (node: NonNullable<PublicOverviewDocument['content']>[number]): string => {
    if (node.type === 'text') return node.text || '';
    return (node.content || []).map(walk).join(node.type === 'paragraph' ? '' : ' ');
  };
  return (document.content || []).map(walk).join('\n').trim();
}

export function deriveReleaseType(version: string): ReleaseType | null {
  const match = version.match(versionPattern);
  if (!match) return null;
  const minor = Number(match[2]);
  const patch = Number(match[3]);
  if (patch > 0) return 'patch';
  if (minor > 0) return 'minor';
  return 'major';
}

export function releaseTypeLabel(version: string): string {
  const releaseType = deriveReleaseType(version);
  if (releaseType === 'patch') return 'Patch / bug fix';
  if (releaseType === 'minor') return 'Minor';
  if (releaseType === 'major') return 'Major';
  return 'Enter a valid version';
}

export function releaseFormError(
  form: ReleaseFormState,
  isNew: boolean,
  visibility: ReleaseVisibility = 'private',
): string | null {
  if (isNew && !versionPattern.test(form.version)) {
    return 'Enter a valid X.Y.Z version, such as 1.2.0 or 1.2.1.';
  }
  if (!form.title.trim()) return 'Enter a release title.';
  if (form.title.trim().length > 160) return 'Keep the release title to 160 characters or fewer.';
  const overviewText = publicOverviewText(form.publicOverview);
  if (overviewText.length > 10000) {
    return 'Keep the public overview to 10,000 characters or fewer.';
  }
  if (visibility !== 'private' && !overviewText) {
    return 'Public preview and published releases require a public overview.';
  }
  if (form.internalSummary.length > 10000) {
    return 'Keep the internal log to 10,000 characters or fewer.';
  }
  return null;
}

export function lifecycleOptions(release: AdminReleaseDetail | null): ReleaseLifecycle[] {
  if (!release) return ['draft'];

  const options = new Set<ReleaseLifecycle>([release.lifecycleStatus]);
  if (release.visibility !== 'private') {
    if (release.visibility === 'public_preview' && release.lifecycleStatus === 'planned') {
      options.add('in_progress');
    }
    return Array.from(options);
  }

  if (release.lifecycleStatus === 'draft') {
    options.add('planned');
    options.add('canceled');
  } else if (release.lifecycleStatus === 'planned') {
    options.add('in_progress');
    options.add('canceled');
  } else if (release.lifecycleStatus === 'in_progress') {
    options.add('planned');
    options.add('canceled');
  }

  return Array.from(options);
}

export function publicationReadiness(
  release: Pick<AdminReleaseDetail, 'publicOverview' | 'notes'>,
): { ready: boolean; message: string | null } {
  const missing: string[] = [];
  if (!publicOverviewText(release.publicOverview)) missing.push('a public overview');
  if (!release.notes.some((note) => note.isPublic && !note.archivedAt)) {
    missing.push('at least one public release note');
  }
  return {
    ready: missing.length === 0,
    message: missing.length ? `Before publishing, add ${missing.join(' and ')}.` : null,
  };
}

export function noteFormError(title: string, body: string, technical: string): string | null {
  const normalizedTitle = title.trim();
  const normalizedBody = body.replace(/\r\n?/g, '\n').trim();
  if (!normalizedTitle) return 'Enter a public note title.';
  if (normalizedTitle.length > 160) return 'Keep the public note title to 160 characters or fewer.';
  if (!normalizedBody) return 'Enter public note content.';
  if (normalizedBody.length > 4000) {
    return 'Keep the public note content to 4,000 characters or fewer.';
  }
  if (technical.length > 20000) {
    return 'Keep technical notes to 20,000 characters or fewer.';
  }
  return null;
}

export function wouldRemoveLastPublicNote(
  release: Pick<AdminReleaseDetail, 'visibility' | 'notes'>,
  noteId: string,
  nextIsPublic: boolean,
): boolean {
  if (release.visibility === 'private' || nextIsPublic) return false;
  const note = release.notes.find((candidate) => candidate.id === noteId);
  if (!note?.isPublic) return false;
  return (
    release.notes.filter((candidate) => candidate.isPublic && !candidate.archivedAt).length === 1
  );
}

export function firstFieldError(fieldErrors: Record<string, string[]>): string | null {
  for (const messages of Object.values(fieldErrors)) {
    const message = messages.find(Boolean);
    if (message) return message;
  }
  return null;
}

export function formatReleasedDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
