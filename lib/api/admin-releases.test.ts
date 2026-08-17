import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  approveConvertedSource,
  convertReleaseMarkdown,
  importReleaseMarkdown,
} from './admin-releases';

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
    expect(fetchMock.mock.calls[0][0]).toBe('/api/admin/releases/import-markdown');
    expect(init?.headers).toMatchObject({
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
    expect(fetchMock.mock.calls[0][0]).toContain('/convert');
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({ 'If-Match': '"3"' });

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ data: {} }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    await approveConvertedSource('00000000-0000-4000-8000-000000000001', source, 5, []);
    expect(fetchMock.mock.calls[1][0]).toContain('/approve');
    expect(JSON.parse(String(fetchMock.mock.calls[1][1]?.body))).toEqual({
      releaseRowVersion: 5,
      noteRowVersions: [],
    });
  });
});
