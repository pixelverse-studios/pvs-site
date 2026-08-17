import type {
  AdminReleaseDetail,
  AdminReleaseCapabilities,
  AdminReleaseNote,
  AdminReleaseSource,
  ConvertMarkdownResponse,
  CreateReleaseInput,
  ImportMarkdownResponse,
  ReleaseDetailResponse,
  ReleaseLifecycle,
  ReleaseListResponse,
  ReleaseMutationResponse,
  ReleaseNoteType,
  ReleasePlatform,
  ReleaseIntendedSurface,
  ReleaseSourceType,
  SaveReleaseEditorInput,
  ReleaseType,
  ReleaseVisibility,
  UpdateReleaseInput,
} from '@/lib/types/admin-release';

export class ReleaseApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly fieldErrors: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = 'ReleaseApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/admin/releases${path}`, {
    cache: 'no-store',
    ...init,
    headers: {
      ...(init?.body && !(init.body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...init?.headers,
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ReleaseApiError(
      body.error?.message || body.message || `Release request failed (${response.status})`,
      response.status,
      body.error?.code,
      body.error?.fieldErrors,
    );
  }
  return body as T;
}

export async function importReleaseMarkdown(input: {
  markdown?: string;
  file?: File;
  releaseId?: string;
  releaseRowVersion?: number;
  releaseVersion?: string;
  releaseTitle?: string;
  sourceType: ReleaseSourceType;
  sourceReference: string;
  intendedSurface: ReleaseIntendedSurface;
}): Promise<ImportMarkdownResponse['data']> {
  const common = {
    releaseId: input.releaseId,
    releaseVersion: input.releaseVersion,
    releaseTitle: input.releaseTitle,
    sourceType: input.sourceType,
    sourceReference: input.sourceReference,
    intendedSurface: input.intendedSurface,
  };
  const headers = input.releaseRowVersion
    ? { 'If-Match': `\"${input.releaseRowVersion}\"` }
    : undefined;
  let body: BodyInit;
  if (input.file) {
    const form = new FormData();
    form.set('file', input.file);
    Object.entries(common).forEach(([key, value]) => {
      if (value !== undefined) form.set(key, String(value));
    });
    body = form;
  } else {
    body = JSON.stringify({ ...common, markdown: input.markdown || '' });
  }
  const response = await request<ImportMarkdownResponse>('/import-markdown', {
    method: 'POST',
    headers,
    body,
  });
  return response.data;
}

export async function convertReleaseMarkdown(
  releaseId: string,
  source: Pick<AdminReleaseSource, 'id' | 'rowVersion'>,
  releaseRowVersion: number,
): Promise<ConvertMarkdownResponse['data']> {
  const response = await request<ConvertMarkdownResponse>(
    `/${releaseId}/prds/${source.id}/convert`,
    {
      method: 'POST',
      headers: { 'If-Match': `\"${source.rowVersion}\"` },
      body: JSON.stringify({ rewriteMode: 'deterministic', releaseRowVersion }),
    },
  );
  return response.data;
}

export function approveConvertedSource(
  releaseId: string,
  source: Pick<AdminReleaseSource, 'id' | 'rowVersion'>,
  releaseRowVersion: number,
  notes: AdminReleaseNote[],
) {
  return request<ReleaseMutationResponse>(`/${releaseId}/prds/${source.id}/approve`, {
    method: 'POST',
    headers: { 'If-Match': `\"${source.rowVersion}\"` },
    body: JSON.stringify({
      releaseRowVersion,
      noteRowVersions: notes.map(({ id, rowVersion }) => ({ id, rowVersion })),
    }),
  });
}

export async function listReleases(filters?: {
  lifecycle?: ReleaseLifecycle;
  visibility?: ReleaseVisibility;
  releaseType?: ReleaseType;
  platform?: ReleasePlatform;
  version?: string;
  archived?: boolean;
}) {
  const releases: ReleaseListResponse['data']['releases'] = [];
  let capabilities: AdminReleaseCapabilities = {
    canCreateRelease: false,
    canViewArchivedReleases: false,
  };
  const seenCursors = new Set<string>();
  let cursor: string | null = null;
  let lastResponse: ReleaseListResponse | null = null;

  do {
    const params = new URLSearchParams({ limit: '100' });
    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
    });
    if (cursor) params.set('cursor', cursor);

    lastResponse = await request<ReleaseListResponse>(`?${params}`);
    releases.push(...lastResponse.data.releases);
    capabilities = lastResponse.data.capabilities || capabilities;

    const nextCursor = lastResponse.meta.nextCursor;
    if (nextCursor && seenCursors.has(nextCursor)) {
      throw new ReleaseApiError('Release pagination returned a repeated cursor', 502);
    }
    if (nextCursor) seenCursors.add(nextCursor);
    cursor = nextCursor;
  } while (cursor);

  return {
    data: { releases, capabilities },
    meta: {
      requestId: lastResponse?.meta.requestId || '',
      nextCursor: null,
    },
  } satisfies ReleaseListResponse;
}

export async function getRelease(id: string, includeArchived = false): Promise<AdminReleaseDetail> {
  const response = await request<ReleaseDetailResponse>(
    `/${id}${includeArchived ? '?includeArchived=true' : ''}`,
  );
  return response.data.release;
}

export async function getReleaseCapabilities(): Promise<AdminReleaseCapabilities> {
  const response = await request<ReleaseListResponse>('?limit=1');
  return response.data.capabilities;
}

export async function createRelease(input: CreateReleaseInput): Promise<string> {
  const response = await request<ReleaseMutationResponse>('', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  const release = (response.data.release || response.data) as { id?: string };
  if (!release.id) throw new ReleaseApiError('Release was created without an ID', 500);
  return release.id;
}

export function updateRelease(id: string, rowVersion: number, input: UpdateReleaseInput) {
  return request<ReleaseMutationResponse>(`/${id}`, {
    method: 'PATCH',
    headers: { 'If-Match': `\"${rowVersion}\"` },
    body: JSON.stringify(input),
  });
}

export async function saveReleaseEditor(
  id: string | undefined,
  rowVersion: number | undefined,
  input: SaveReleaseEditorInput,
): Promise<AdminReleaseDetail> {
  const response = await request<ReleaseMutationResponse>(id ? `/${id}/editor` : '/editor', {
    method: 'POST',
    headers: id && rowVersion ? { 'If-Match': `\"${rowVersion}\"` } : undefined,
    body: JSON.stringify(input),
  });
  const release = response.data.release as AdminReleaseDetail | undefined;
  if (!release?.id) throw new ReleaseApiError('The saved release could not be loaded', 500);
  return release;
}

export function setReleaseVisibility(
  id: string,
  rowVersion: number,
  visibility: ReleaseVisibility,
) {
  return request<ReleaseMutationResponse>(`/${id}/visibility`, {
    method: 'POST',
    headers: { 'If-Match': `\"${rowVersion}\"` },
    body: JSON.stringify({ visibility }),
  });
}

export function runReleaseAction(
  id: string,
  rowVersion: number,
  action:
    'mark-released' | 'publish-preview' | 'return-to-private' | 'publish' | 'unpublish' | 'archive',
  input?: { releasedDate: string },
) {
  return request<ReleaseMutationResponse>(`/${id}/${action}`, {
    method: 'POST',
    headers: { 'If-Match': `\"${rowVersion}\"` },
    body: JSON.stringify(input || {}),
  });
}

export function createReleaseNote(
  release: AdminReleaseDetail,
  input: {
    noteType: ReleaseNoteType;
    publicTitle: string;
    publicBody: string;
    technicalNotes: string | null;
    platforms: ReleasePlatform[];
    isPublic: boolean;
  },
) {
  return request<ReleaseMutationResponse>(`/${release.id}/notes`, {
    method: 'POST',
    headers: { 'If-Match': `\"${release.rowVersion}\"` },
    body: JSON.stringify(input),
  });
}

export function updateReleaseNote(
  release: AdminReleaseDetail,
  note: AdminReleaseNote,
  input: Partial<
    Pick<
      AdminReleaseNote,
      'noteType' | 'publicTitle' | 'publicBody' | 'technicalNotes' | 'platforms' | 'isPublic'
    >
  >,
) {
  return request<ReleaseMutationResponse>(`/${release.id}/notes/${note.id}`, {
    method: 'PATCH',
    headers: { 'If-Match': `\"${note.rowVersion}\"` },
    body: JSON.stringify({ ...input, releaseRowVersion: release.rowVersion }),
  });
}

export function archiveReleaseNote(release: AdminReleaseDetail, note: AdminReleaseNote) {
  return request<ReleaseMutationResponse>(`/${release.id}/notes/${note.id}/archive`, {
    method: 'POST',
    headers: { 'If-Match': `\"${note.rowVersion}\"` },
    body: JSON.stringify({ releaseRowVersion: release.rowVersion }),
  });
}

export function reorderReleaseNotes(release: AdminReleaseDetail, notes: AdminReleaseNote[]) {
  return request<ReleaseMutationResponse>(`/${release.id}/notes/reorder`, {
    method: 'POST',
    headers: { 'If-Match': `\"${release.rowVersion}\"` },
    body: JSON.stringify({ notes: notes.map(({ id, rowVersion }) => ({ id, rowVersion })) }),
  });
}
