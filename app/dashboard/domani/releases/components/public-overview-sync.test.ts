import { describe, expect, it, vi } from 'vitest';
import type { PublicOverviewDocument } from '@/lib/types/admin-release';
import { syncPublicOverviewValue } from './public-overview-sync';

const savedOverview: PublicOverviewDocument = {
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Saved description' }] }],
};

function editorWith(document: PublicOverviewDocument, isFocused = false) {
  return {
    isFocused,
    getJSON: () => document,
    commands: { setContent: vi.fn() },
  };
}

describe('public overview server synchronization', () => {
  it('loads a changed server document without reporting a user edit', () => {
    const editor = editorWith({ type: 'doc', content: [{ type: 'paragraph' }] });

    expect(syncPublicOverviewValue(editor, savedOverview)).toBe(true);
    expect(editor.commands.setContent).toHaveBeenCalledWith(savedOverview, {
      emitUpdate: false,
    });
  });

  it('does not replace an equal or actively edited document', () => {
    const equalEditor = editorWith(savedOverview);
    const focusedEditor = editorWith({ type: 'doc', content: [] }, true);

    expect(syncPublicOverviewValue(equalEditor, savedOverview)).toBe(false);
    expect(syncPublicOverviewValue(focusedEditor, savedOverview)).toBe(false);
    expect(equalEditor.commands.setContent).not.toHaveBeenCalled();
    expect(focusedEditor.commands.setContent).not.toHaveBeenCalled();
  });
});
