'use client';

import { useEffect } from 'react';
import Link from '@tiptap/extension-link';
import { Markdown } from '@tiptap/markdown';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Code2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Redo2,
  Undo2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ReleaseMarkdownEditor({
  value,
  onChange,
  disabled = false,
  maxLength = 4000,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  maxLength?: number;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    content: value,
    contentType: 'markdown',
    editorProps: {
      attributes: {
        'aria-label': 'Release highlight description',
      },
    },
    extensions: [
      StarterKit.configure({
        blockquote: false,
        codeBlock: false,
        hardBreak: false,
        heading: false,
        horizontalRule: false,
        link: false,
        strike: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        protocols: ['http', 'https', 'mailto'],
        HTMLAttributes: { rel: 'noopener noreferrer nofollow' },
      }),
      Markdown,
    ],
    onUpdate: ({ editor: nextEditor }) => onChange(nextEditor.getMarkdown()),
  });

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor || editor.isFocused || editor.getMarkdown() === value) return;
    editor.commands.setContent(value, { contentType: 'markdown', emitUpdate: false });
  }, [editor, value]);

  if (!editor) {
    return <div className="min-h-36 animate-pulse rounded-xl bg-[var(--pv-surface)]" />;
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
    if (!/^(https?:\/\/|mailto:|\/|#)/i.test(normalizedUrl) || normalizedUrl.startsWith('//')) {
      window.alert('Use an http, https, mailto, site-relative, or anchor link.');
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: normalizedUrl }).run();
  };

  const toolbar = [
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
      label: 'Inline code',
      icon: Code2,
      active: editor.isActive('code'),
      run: () => editor.chain().focus().toggleCode().run(),
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
        'overflow-hidden rounded-xl border border-[var(--pv-border)] bg-[var(--pv-bg)] transition-colors focus-within:border-[var(--pv-primary)]',
        disabled && 'opacity-60',
      )}
    >
      <div
        className="flex flex-wrap items-center gap-1 border-b border-[var(--pv-border)] bg-[var(--pv-surface)] px-2 py-1.5"
        role="toolbar"
        aria-label="Release highlight formatting"
      >
        {toolbar.map(({ label, icon: Icon, active, run }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              'h-8 w-8 active:scale-[0.98]',
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
        <span className="mx-1 h-5 w-px bg-[var(--pv-border)]" aria-hidden="true" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 active:scale-[0.98]"
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
          className="h-8 w-8 active:scale-[0.98]"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().redo()}
          aria-label="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent
        editor={editor}
        className="[&_.tiptap]:min-h-36 [&_.tiptap]:px-4 [&_.tiptap]:py-3 [&_.tiptap]:text-sm [&_.tiptap]:leading-relaxed [&_.tiptap]:text-[var(--pv-text)] [&_.tiptap]:outline-none [&_a]:font-medium [&_a]:text-violet-600 [&_a]:underline [&_code]:rounded [&_code]:bg-[var(--pv-surface)] [&_code]:px-1 [&_code]:py-0.5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6"
      />
      <div className="flex items-center justify-between gap-3 border-t border-[var(--pv-border)] px-3 py-2 text-[11px] text-[var(--pv-text-muted)]">
        <span>Bold, italic, links, inline code, and lists</span>
        <span className={cn(value.length > maxLength && 'font-semibold text-red-600')}>
          {value.length.toLocaleString()} / {maxLength.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
