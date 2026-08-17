import type { PublicOverviewDocument } from '@/lib/types/admin-release';

interface PublicOverviewSyncTarget {
  isFocused: boolean;
  getJSON: () => unknown;
  commands: {
    setContent: (value: PublicOverviewDocument, options: { emitUpdate: boolean }) => unknown;
  };
}

export function syncPublicOverviewValue(
  editor: PublicOverviewSyncTarget,
  value: PublicOverviewDocument,
) {
  if (editor.isFocused || JSON.stringify(editor.getJSON()) === JSON.stringify(value)) return false;

  editor.commands.setContent(value, { emitUpdate: false });
  return true;
}
