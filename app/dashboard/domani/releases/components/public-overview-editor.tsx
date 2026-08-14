'use client';

import { useEffect } from 'react';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Redo2,
  Undo2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PublicOverviewDocument } from '@/lib/types/admin-release';
import { cn } from '@/lib/utils';

export function PublicOverviewEditor({
  value,
  onChange,
  disabled = false,
}: {
  value: PublicOverviewDocument;
  onChange: (value: PublicOverviewDocument) => void;
  disabled?: boolean;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    content: value,
    editorProps: {
      attributes: {
        'aria-label': 'Release introduction content',
      },
    },
    extensions: [
      StarterKit.configure({
        blockquote: false,
        code: false,
        codeBlock: false,
        hardBreak: false,
        horizontalRule: false,
        strike: false,
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        protocols: ['http', 'https', 'mailto'],
        HTMLAttributes: { rel: 'noopener noreferrer nofollow' },
      }),
    ],
    onUpdate: ({ editor: nextEditor }) => {
      onChange(nextEditor.getJSON() as PublicOverviewDocument);
    },
  });

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor || editor.isFocused) return;
    const next = JSON.stringify(value);
    if (JSON.stringify(editor.getJSON()) !== next) editor.commands.setContent(value);
  }, [editor, value]);

  if (!editor) {
    return <div className="min-h-40 animate-pulse rounded-lg bg-[var(--pv-surface)]" />;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL', previousUrl || 'https://');
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    const normalizedUrl = url.trim();
    if (!/^(https?:\/\/|mailto:)/i.test(normalizedUrl)) {
      window.alert('Links must begin with http://, https://, or mailto:.');
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: normalizedUrl }).run();
  };

  const toolbar = [
    {
      label: 'Heading 2',
      icon: Heading2,
      active: editor.isActive('heading', { level: 2 }),
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: 'Heading 3',
      icon: Heading3,
      active: editor.isActive('heading', { level: 3 }),
      run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: 'Bold',
      icon: Bold,
      active: editor.isActive('bold'),
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: 'Italic',
      icon: Italic,
      active: editor.isActive('italic'),
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: 'Bullet list',
      icon: List,
      active: editor.isActive('bulletList'),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: 'Numbered list',
      icon: ListOrdered,
      active: editor.isActive('orderedList'),
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    { label: 'Link', icon: LinkIcon, active: editor.isActive('link'), run: setLink },
  ];

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-[var(--pv-border)] bg-[var(--pv-surface)]',
        disabled && 'opacity-60',
      )}
    >
      <div
        className="flex flex-wrap gap-1 border-b border-[var(--pv-border)] p-2"
        role="toolbar"
        aria-label="Release introduction formatting"
      >
        {toolbar.map(({ label, icon: Icon, active, run }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              'h-8 w-8',
              active && 'bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200',
            )}
            onClick={run}
            disabled={disabled}
            aria-label={label}
            aria-pressed={active}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
        <span className="mx-1 w-px bg-[var(--pv-border)]" aria-hidden="true" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().undo()}
          aria-label="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().redo()}
          aria-label="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent
        editor={editor}
        className="[&_.tiptap]:min-h-48 [&_.tiptap]:px-4 [&_.tiptap]:py-3 [&_.tiptap]:text-sm [&_.tiptap]:text-[var(--pv-text)] [&_.tiptap]:outline-none [&_a]:text-violet-600 [&_a]:underline [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6"
      />
    </div>
  );
}
