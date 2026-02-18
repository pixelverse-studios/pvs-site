'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { LayoutGrid, List, Rows3 } from 'lucide-react';

export type BulletVariant = 'cards' | 'timeline' | 'panels';

const VARIANTS: { key: BulletVariant; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'cards', label: 'Cards', icon: LayoutGrid },
  { key: 'timeline', label: 'Timeline', icon: List },
  { key: 'panels', label: 'Panels', icon: Rows3 },
];

const BulletVariantContext = createContext<{
  variant: BulletVariant;
  setVariant: (v: BulletVariant) => void;
}>({
  variant: 'cards',
  setVariant: () => {},
});

export function useBulletVariant() {
  return useContext(BulletVariantContext);
}

export function BulletVariantProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<BulletVariant>('cards');

  return (
    <BulletVariantContext.Provider value={{ variant, setVariant }}>
      {children}
      <BulletVariantSwitcher />
    </BulletVariantContext.Provider>
  );
}

function BulletVariantSwitcher() {
  const { variant, setVariant } = useBulletVariant();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggle = useCallback(() => setIsExpanded((prev) => !prev), []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Variant options — shown when expanded */}
      {isExpanded && (
        <div className="flex flex-col gap-1.5 rounded-2xl border border-[var(--pv-border)] bg-[var(--pv-bg)]/95 p-2 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md">
          <p className="px-2 pb-1 pt-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[var(--pv-text-muted)]">
            Layout
          </p>
          {VARIANTS.map(({ key, label, icon: Icon }) => {
            const isActive = variant === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setVariant(key);
                  setIsExpanded(false);
                }}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[var(--pv-primary)] text-white shadow-[0_4px_12px_-4px_rgba(63,0,233,0.5)]'
                    : 'text-[var(--pv-text-muted)] hover:bg-[var(--pv-surface)] hover:text-[var(--pv-text)]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={toggle}
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-[var(--pv-gradient)] text-white shadow-[0_8px_24px_-8px_rgba(63,0,233,0.6)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_32px_-8px_rgba(63,0,233,0.7)]"
        aria-label="Switch bullet point layout variant"
      >
        <LayoutGrid className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
      </button>
    </div>
  );
}
