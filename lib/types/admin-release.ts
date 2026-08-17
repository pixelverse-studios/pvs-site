export type ReleaseType = 'major' | 'minor' | 'patch';
export type ReleaseLifecycle = 'draft' | 'planned' | 'in_progress' | 'released' | 'canceled';
export type ReleaseVisibility = 'private' | 'public_preview' | 'published';
export type ReleaseStatus = 'draft' | 'published';
export type ReleaseTiming =
  | { kind: 'date'; value: string }
  | { kind: 'month'; value: string }
  | { kind: 'tbd'; value: null };
export type ReleaseNoteType = 'feature' | 'improvement' | 'fix' | 'breaking';
export type ReleasePlatform = 'ios' | 'android';

export interface PublicOverviewNode {
  type: 'doc' | 'paragraph' | 'heading' | 'bulletList' | 'orderedList' | 'listItem' | 'text';
  attrs?: Record<string, unknown>;
  content?: PublicOverviewNode[];
  marks?: Array<{
    type: 'bold' | 'italic' | 'link';
    attrs?: Record<string, unknown>;
  }>;
  text?: string;
}

export interface PublicOverviewDocument extends PublicOverviewNode {
  type: 'doc';
}

export interface AdminRelease {
  id: string;
  version: string;
  slug: string;
  title: string;
  releaseType: ReleaseType;
  status: ReleaseStatus;
  timing: ReleaseTiming;
  platforms: ReleasePlatform[];
  lifecycleStatus: ReleaseLifecycle;
  visibility: ReleaseVisibility;
  publicOverview: PublicOverviewDocument | null;
  publicSummary: string | null;
  internalSummary: string | null;
  targetMonth: string | null;
  targetDate: string | null;
  confirmedDate: string | null;
  releasedAt: string | null;
  ownerUserId: string | null;
  rowVersion: number;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export interface AdminReleaseNote {
  id: string;
  releaseId: string;
  noteType: ReleaseNoteType;
  publicTitle: string;
  publicBody: string;
  technicalNotes: string | null;
  platforms: ReleasePlatform[];
  isPublic: boolean;
  sortOrder: number;
  sourcePrdId: string | null;
  sourceConversionRunId: string | null;
  rowVersion: number;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export interface AdminReleaseDetail extends AdminRelease {
  notes: AdminReleaseNote[];
  sources: Array<{
    id: string;
    conversionStatus: 'raw' | 'needs_review' | 'approved' | 'failed' | 'superseded';
    sourceReference: string;
  }>;
  allowedActions: Array<
    | 'edit'
    | 'mark_released'
    | 'publish_preview'
    | 'return_to_private'
    | 'publish'
    | 'unpublish'
    | 'archive'
  >;
}

export interface AdminReleaseCapabilities {
  canCreateRelease: boolean;
  canViewArchivedReleases: boolean;
}

export interface ReleaseApiErrorBody {
  error?: {
    code?: string;
    message?: string;
    fieldErrors?: Record<string, string[]>;
    requestId?: string;
  };
  message?: string;
}

export interface ReleaseListResponse {
  data: { releases: AdminRelease[]; capabilities: AdminReleaseCapabilities };
  meta: { nextCursor: string | null; requestId: string };
}

export interface ReleaseDetailResponse {
  data: { release: AdminReleaseDetail };
  meta: { requestId: string };
}

export interface ReleaseMutationResponse {
  data: Record<string, unknown>;
  meta: { requestId: string };
}

export interface ReleaseEditorHighlightInput {
  id: string;
  rowVersion: number | null;
  noteType: ReleaseNoteType;
  publicTitle: string;
  publicBody: string;
  technicalNotes: string | null;
  platforms: ReleasePlatform[];
  isPublic: boolean;
}

export interface SaveReleaseEditorInput {
  version: string;
  title: string;
  status: ReleaseStatus;
  timing: ReleaseTiming;
  platforms: ReleasePlatform[];
  publicOverview: PublicOverviewDocument;
  internalSummary: string | null;
  highlights: ReleaseEditorHighlightInput[];
}

export interface CreateReleaseInput {
  version: string;
  title: string;
  publicOverview: PublicOverviewDocument | null;
  internalSummary: string | null;
  targetMonth: string | null;
  targetDate: string | null;
  ownerUserId?: string | null;
}

export type UpdateReleaseInput = Partial<
  Pick<
    AdminRelease,
    | 'version'
    | 'title'
    | 'lifecycleStatus'
    | 'publicOverview'
    | 'internalSummary'
    | 'targetMonth'
    | 'targetDate'
    | 'ownerUserId'
  >
>;
