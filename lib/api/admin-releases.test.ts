import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  approveConvertedSource,
  convertReleaseMarkdown,
  importReleaseMarkdown,
  listReleases,
  saveReleaseEditor,
} from './admin-releases';

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { getSession: async () => ({ data: { session: { access_token: 'test-token' } } }) },
  }),
}));
vi.mock('@/lib/api-config', () => ({ getApiBaseUrl: () => 'https://api.test' }));

const source = {
  id: '00000000-0000-4000-8000-000000000002',
  rowVersion: 3,
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Markdown workflow requests', () => {
  it('imports pasted Markdown with aggregate concurrency headers', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(
          JSON.stringify({ data: { release: { id: 'release' }, source, duplicate: false } }),
          { status: 201, headers: { 'content-type': 'application/json' } },
        ),
      );

    await importReleaseMarkdown({
      markdown: '# Release',
      releaseId: '00000000-0000-4000-8000-000000000001',
      releaseRowVersion: 4,
      sourceType: 'linear_epic',
      sourceReference: 'DEV-1004',
      intendedSurface: 'changelog',
    });

    const [, init] = fetchMock.mock.calls[0];
    expect(String(fetchMock.mock.calls[0][0])).toBe(
      'https://api.test/api/admin/releases/import-markdown',
    );
    expect(init?.credentials).toBe('omit');
    expect(init?.headers).toMatchObject({
      Authorization: 'Bearer test-token',
      'Content-Type': 'application/json',
      'If-Match': '"4"',
    });
    expect(JSON.parse(String(init?.body))).toMatchObject({
      markdown: '# Release',
      releaseId: '00000000-0000-4000-8000-000000000001',
      sourceType: 'linear_epic',
    });
  });

  it('keeps multipart boundaries browser-owned for .md uploads', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(
          JSON.stringify({ data: { release: { id: 'release' }, source, duplicate: false } }),
          { status: 201, headers: { 'content-type': 'application/json' } },
        ),
      );
    const file = new File(['# Release'], 'release.md', { type: 'text/markdown' });

    await importReleaseMarkdown({
      file,
      releaseVersion: '1.2.0',
      releaseTitle: 'Release title',
      sourceType: 'manual',
      sourceReference: 'manual-release',
      intendedSurface: 'changelog',
    });

    const [, init] = fetchMock.mock.calls[0];
    expect(init?.body).toBeInstanceOf(FormData);
    expect(init?.headers).not.toHaveProperty('Content-Type');
    expect((init?.body as FormData).get('file')).toBe(file);
  });

  it('keeps conversion and approval separate and versioned', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            source,
            conversionRun: { id: 'run', status: 'succeeded', resultingNoteIds: [] },
            notes: [],
            releaseRowVersion: 5,
          },
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    );

    await convertReleaseMarkdown('00000000-0000-4000-8000-000000000001', source, 4);
    expect(String(fetchMock.mock.calls[0][0])).toContain('/convert');
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({ 'If-Match': '"3"' });

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ data: {} }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    await approveConvertedSource('00000000-0000-4000-8000-000000000001', source, 5, []);
    expect(String(fetchMock.mock.calls[1][0])).toContain('/approve');
    expect(JSON.parse(String(fetchMock.mock.calls[1][1]?.body))).toEqual({
      releaseRowVersion: 5,
      noteRowVersions: [],
    });
  });
});

describe('release list mutation invalidation', () => {
  it('reuses a list but fetches again after a mutation', async () => {
    const payload = {
      data: {
        releases: [],
        capabilities: { canCreateRelease: true, canViewArchivedReleases: true },
      },
      meta: { nextCursor: null },
    };
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async () => new Response(JSON.stringify(payload)));
    await listReleases();
    await listReleases();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await approveConvertedSource('release', source, 1, []);
    await listReleases();
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});

describe('editor save version handling', () => {
  const input = {
    version: '1.3.0',
    title: 'Coming soon',
    status: 'draft' as const,
    timing: { kind: 'tbd' as const, value: null },
    platforms: ['ios' as const],
    publicOverview: { type: 'doc' as const, content: [] },
    internalSummary: null,
    highlights: [],
  };
  it('carries the saved draft version into publishing in the body and header', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { release: { id: 'release', rowVersion: 1 } } })),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { release: { id: 'release', rowVersion: 2 } } })),
      );
    const draft = await saveReleaseEditor(undefined, undefined, input);
    const published = await saveReleaseEditor(draft.id, draft.rowVersion, {
      ...input,
      status: 'published',
    });
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).not.toHaveProperty(
      'expectedRowVersion',
    );
    expect(new Headers(fetchMock.mock.calls[1][1]?.headers).get('If-Match')).toBe('"1"');
    expect(JSON.parse(String(fetchMock.mock.calls[1][1]?.body))).toMatchObject({
      expectedRowVersion: 1,
      status: 'published',
    });
    expect(published.rowVersion).toBe(2);
  });
  it.each([undefined, 0, -1, NaN, 1.5])(
    'does not send an existing save with invalid version %s',
    async (version) => {
      const fetchMock = vi.spyOn(globalThis, 'fetch');
      await expect(saveReleaseEditor('release', version, input)).rejects.toThrow(
        'missing its saved version',
      );
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
});
