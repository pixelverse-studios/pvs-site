'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Undo,
  Redo,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Add details...',
  className,
  minHeight = '120px',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Underline,
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm dark:prose-invert max-w-none',
          'focus:outline-none',
          'prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5',
          'prose-blockquote:border-l-[var(--pv-primary)] prose-blockquote:text-[var(--pv-text-muted)]',
          'prose-code:bg-[var(--pv-surface)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none',
          'prose-a:text-[var(--pv-primary)] prose-a:no-underline hover:prose-a:underline',
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external content changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div
        className={cn(
          'rounded-pv-sm border border-[var(--pv-border)] bg-[var(--pv-surface)]',
          className,
        )}
        style={{ minHeight }}
      >
        <div className="animate-pulse p-4">
          <div className="h-4 w-3/4 rounded bg-[var(--pv-border)]" />
        </div>
      </div>
    );
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-pv-sm border border-[var(--pv-border)] bg-[var(--pv-surface)]',
        'focus-within:border-[var(--pv-primary)] focus-within:ring-2 focus-within:ring-[var(--pv-ring)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--pv-bg)]',
        'transition-colors-opacity-transform',
        className,
      )}
    >
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-0.5 border-b p-1.5"
        style={{ borderColor: 'var(--pv-border)', background: 'var(--pv-bg)' }}
        role="toolbar"
        aria-label="Text formatting"
      >
        {/* Text Style Group */}
        <ToolbarGroup label="Text style">
          <ToolbarButton
            icon={Bold}
            label="Bold (Ctrl+B)"
            isActive={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            icon={Italic}
            label="Italic (Ctrl+I)"
            isActive={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            icon={UnderlineIcon}
            label="Underline (Ctrl+U)"
            isActive={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
          <ToolbarButton
            icon={Strikethrough}
            label="Strikethrough"
            isActive={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          />
        </ToolbarGroup>

        <ToolbarDivider />

        {/* List Group */}
        <ToolbarGroup label="Lists">
          <ToolbarButton
            icon={List}
            label="Bullet list"
            isActive={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            icon={ListOrdered}
            label="Numbered list"
            isActive={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Block Group */}
        <ToolbarGroup label="Block formatting">
          <ToolbarButton
            icon={Quote}
            label="Blockquote"
            isActive={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
          <ToolbarButton
            icon={Code}
            label="Code block"
            isActive={editor.isActive('codeBlock')}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          />
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Link */}
        <ToolbarGroup label="Insert">
          <ToolbarButton
            icon={LinkIcon}
            label="Insert link (Ctrl+K)"
            isActive={editor.isActive('link')}
            onClick={addLink}
          />
        </ToolbarGroup>

        {/* Spacer */}
        <div className="flex-1" />

        {/* History Group */}
        <ToolbarGroup label="History">
          <ToolbarButton
            icon={Undo}
            label="Undo (Ctrl+Z)"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          />
          <ToolbarButton
            icon={Redo}
            label="Redo (Ctrl+Shift+Z)"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          />
        </ToolbarGroup>
      </div>

      {/* Editor Content */}
      <div className="px-4 py-3" style={{ minHeight }}>
        <EditorContent
          editor={editor}
          className={cn(
            'text-[var(--pv-text)]',
            '[&_.ProseMirror]:min-h-[100px] [&_.ProseMirror]:outline-none',
            '[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
            '[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-[var(--pv-text-muted)]',
            '[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none',
            '[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left',
            '[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0',
          )}
        />
      </div>
    </div>
  );
}

// Toolbar Button Component
interface ToolbarButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function ToolbarButton({ icon: Icon, label, isActive, onClick, disabled }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={isActive}
      title={label}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md',
        'text-[var(--pv-text-muted)] transition-colors',
        'hover:bg-[var(--pv-surface)] hover:text-[var(--pv-text)]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-primary)]',
        isActive && 'bg-[var(--pv-primary)]/10 text-[var(--pv-primary)]',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

// Toolbar Group Component
function ToolbarGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-0.5">
      {children}
    </div>
  );
}

// Toolbar Divider Component
function ToolbarDivider() {
  return (
    <div className="mx-1 h-6 w-px" style={{ background: 'var(--pv-border)' }} aria-hidden="true" />
  );
}
