'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { Footer, type FooterProps } from './footer';

const STORAGE_KEY = 'pvs_footer_layout';
type Layout = 'a' | 'b' | 'c' | 'd';

const VALID_LAYOUTS: Layout[] = ['a', 'b', 'c', 'd'];

const LAYOUTS: { id: Layout; label: string; description: string; preview: ReactNode }[] = [
  {
    id: 'a',
    label: 'A',
    description: 'Panoramic',
    preview: (
      <span className="flex w-full flex-col gap-0.5 p-1">
        <span className="h-2 w-full rounded-sm bg-[var(--pv-border)]" />
        <span className="flex flex-1 gap-0.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex-1 rounded-sm bg-[var(--pv-border)]" />
          ))}
        </span>
      </span>
    ),
  },
  {
    id: 'b',
    label: 'B',
    description: 'Split Panel',
    preview: (
      <span className="flex w-full gap-0.5 p-1">
        <span className="flex w-[40%] flex-col gap-0.5">
          <span className="h-3 w-full rounded-sm bg-[var(--pv-border)]" />
          <span className="flex-1 rounded-sm bg-[var(--pv-border)] opacity-50" />
        </span>
        <span className="flex flex-1 flex-col gap-0.5">
          <span className="h-1.5 w-full rounded-sm bg-[var(--pv-border)]" />
          <span className="h-1.5 w-3/4 rounded-sm bg-[var(--pv-border)]" />
          <span className="mt-auto h-1.5 w-full rounded-sm bg-[var(--pv-border)]" />
        </span>
      </span>
    ),
  },
  {
    id: 'c',
    label: 'C',
    description: 'Stacked Strips',
    preview: (
      <span className="flex w-full flex-col gap-0.5 p-1">
        <span className="flex items-center justify-between">
          <span className="h-1.5 w-[45%] rounded-sm bg-[var(--pv-border)]" />
          <span className="h-1.5 w-[20%] rounded-sm bg-[var(--pv-primary)] opacity-60" />
        </span>
        <span className="h-2.5 w-full rounded-sm bg-[var(--pv-border)]" />
        <span className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="h-1 flex-1 rounded-sm bg-[var(--pv-border)]" />
          ))}
        </span>
        <span className="h-1 w-full rounded-sm bg-[var(--pv-border)] opacity-50" />
      </span>
    ),
  },
  {
    id: 'd',
    label: 'D',
    description: 'Card Trio',
    preview: (
      <span className="flex w-full flex-col gap-0.5 p-1">
        <span className="mb-0.5 flex items-center justify-between">
          <span className="h-1 w-1/3 rounded-sm bg-[var(--pv-border)]" />
          <span className="h-1 w-1/4 rounded-sm bg-[var(--pv-primary)] opacity-60" />
        </span>
        <span className="flex flex-1 gap-0.5">
          <span className="flex flex-1 flex-col gap-0.5 rounded-sm border border-[var(--pv-border)] p-0.5">
            <span className="h-2 w-full rounded-sm bg-[var(--pv-border)]" />
            <span className="h-1 w-3/4 rounded-sm bg-[var(--pv-border)] opacity-50" />
          </span>
          <span className="flex flex-1 flex-col gap-0.5 rounded-sm border border-[var(--pv-border)] p-0.5">
            <span className="h-1 w-full rounded-sm bg-[var(--pv-border)]" />
            <span className="h-1 w-2/3 rounded-sm bg-[var(--pv-border)] opacity-50" />
            <span className="h-1 w-3/4 rounded-sm bg-[var(--pv-border)] opacity-50" />
          </span>
          <span className="flex flex-1 flex-col gap-0.5 rounded-sm border border-[var(--pv-border)] p-0.5">
            <span className="h-1 w-full rounded-sm bg-[var(--pv-border)]" />
            <span className="mt-0.5 flex gap-0.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-[var(--pv-border)]" />
              ))}
            </span>
          </span>
        </span>
        <span className="h-px w-full bg-[var(--pv-border)] opacity-50" />
      </span>
    ),
  },
];

function LayoutPicker({ current, onChange }: { current: Layout; onChange: (l: Layout) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Click-outside and Escape key dismiss
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {open && (
        <div
          id="footer-layout-menu"
          role="listbox"
          aria-label="Footer layout options"
          className="absolute bottom-full right-0 mb-2 w-52 rounded-xl border border-[var(--pv-border)] bg-[var(--pv-bg)] p-2 shadow-xl"
        >
          <p className="px-2 pb-1.5 pt-1 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-[var(--pv-text-muted)]">
            Footer Layout
          </p>
          <div className="flex flex-col gap-1">
            {LAYOUTS.map((l) => (
              <button
                key={l.id}
                role="option"
                aria-selected={current === l.id}
                onClick={() => { onChange(l.id); setOpen(false); }}
                className={[
                  'flex items-center gap-2.5 rounded-lg p-2 text-left transition-colors',
                  current === l.id
                    ? 'bg-[color-mix(in_srgb,var(--pv-primary)_10%,transparent)] text-[var(--pv-primary)]'
                    : 'text-[var(--pv-text-muted)] hover:bg-[var(--pv-surface)] hover:text-[var(--pv-text)]',
                ].join(' ')}
              >
                {/* Thumbnail */}
                <span className="flex h-9 w-14 shrink-0 overflow-hidden rounded-md border border-[var(--pv-border)] bg-[var(--pv-surface)]">
                  {l.preview}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold leading-tight">Layout {l.label}</span>
                  <span className="block text-[0.65rem] leading-tight opacity-60">{l.description}</span>
                </span>
                {current === l.id && (
                  <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--pv-primary)]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="footer-layout-menu"
        title="Switch footer layout"
        className={[
          'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition-all',
          open
            ? 'border-[var(--pv-primary)] bg-[color-mix(in_srgb,var(--pv-primary)_8%,transparent)] text-[var(--pv-primary)]'
            : 'border-[var(--pv-border)] bg-[var(--pv-bg)] text-[var(--pv-text-muted)] hover:border-[var(--pv-primary)] hover:text-[var(--pv-primary)]',
        ].join(' ')}
      >
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--pv-primary)] text-[0.5rem] font-bold text-white">
          {current.toUpperCase()}
        </span>
        Footer
      </button>
    </div>
  );
}

export function FooterLayoutPicker(props: Omit<FooterProps, 'layout'>) {
  const [layout, setLayout] = useState<Layout>('a');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (VALID_LAYOUTS as string[]).includes(stored)) {
      setLayout(stored as Layout);
    }
    setMounted(true);
  }, []);

  const handleChange = useCallback((l: Layout) => {
    setLayout(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  // Reserve height to reduce CLS for returning users whose stored layout differs from default
  if (!mounted) {
    return (
      <div style={{ minHeight: '320px' }}>
        <Footer layout="a" {...props} />
      </div>
    );
  }

  return (
    <div className="relative" style={{ minHeight: '320px' }}>
      <div className="absolute bottom-4 right-4 z-50 md:right-6">
        <LayoutPicker current={layout} onChange={handleChange} />
      </div>
      <Footer layout={layout} {...props} />
    </div>
  );
}
