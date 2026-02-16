'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ────────────────────────────────────────────────────────────────────

interface VariantOption {
  key: string;
  description: string;
}

interface SectionConfig {
  label: string;
  options: VariantOption[];
}

type SectionKey = 'hero' | 'insight';

const SECTIONS: Record<SectionKey, SectionConfig> = {
  hero: {
    label: 'Hero',
    options: [
      { key: 'A', description: 'Centered card on gradient' },
      { key: 'B', description: 'Editorial two-column' },
      { key: 'C', description: 'Full gradient statement' },
    ],
  },
  insight: {
    label: 'Insight',
    options: [
      { key: 'A', description: 'Vertical beat reveal' },
      { key: 'B', description: 'Sticky heading + beats' },
      { key: 'C', description: 'Numbered card grid' },
    ],
  },
};

// ── Context ──────────────────────────────────────────────────────────────────

interface VariantState {
  hero: string;
  insight: string;
}

interface VariantContextValue {
  variants: VariantState;
  setVariant: (section: SectionKey, key: string) => void;
}

const VariantContext = createContext<VariantContextValue | null>(null);

export function useVariant(section: SectionKey): string {
  const ctx = useContext(VariantContext);
  if (!ctx) throw new Error('useVariant must be used within VariantPanelProvider');
  return ctx.variants[section];
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function VariantPanelProvider({ children }: { children: ReactNode }) {
  const [variants, setVariants] = useState<VariantState>({
    hero: 'A',
    insight: 'A',
  });

  const setVariant = (section: SectionKey, key: string) => {
    setVariants((prev) => ({ ...prev, [section]: key }));
  };

  return (
    <VariantContext.Provider value={{ variants, setVariant }}>
      {children}
      <VariantPanel variants={variants} setVariant={setVariant} />
    </VariantContext.Provider>
  );
}

// ── Panel UI ─────────────────────────────────────────────────────────────────

function VariantPanel({
  variants,
  setVariant,
}: {
  variants: VariantState;
  setVariant: (section: SectionKey, key: string) => void;
}) {
  const [expanded, setExpanded] = useState<SectionKey | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {collapsed ? (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            onClick={() => setCollapsed(false)}
            className="hover:border-[var(--pv-primary)]/40 flex h-10 w-10 items-center justify-center rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.25)] transition-colors"
            title="Open variant panel"
          >
            <div className="h-4 w-4 rounded-full" style={{ background: 'var(--pv-gradient)' }} />
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="w-56 rounded-pv border border-[var(--pv-border)] bg-[var(--pv-bg)] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.25)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--pv-border)] px-3 py-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--pv-text-muted)]">
                Variants
              </span>
              <button
                onClick={() => setCollapsed(true)}
                className="flex h-5 w-5 items-center justify-center rounded text-[var(--pv-text-muted)] transition-colors hover:text-[var(--pv-text)]"
                title="Collapse panel"
              >
                <span className="text-xs leading-none">&times;</span>
              </button>
            </div>

            {/* Sections */}
            <div className="p-1.5">
              {(Object.entries(SECTIONS) as [SectionKey, SectionConfig][]).map(
                ([sectionKey, config]) => {
                  const isOpen = expanded === sectionKey;
                  const activeKey = variants[sectionKey];
                  const activeOption = config.options.find((o) => o.key === activeKey);

                  return (
                    <div key={sectionKey}>
                      {/* Section toggle */}
                      <button
                        onClick={() => setExpanded(isOpen ? null : sectionKey)}
                        className="flex w-full items-center justify-between rounded-pv-sm px-2.5 py-2 transition-colors hover:bg-[var(--pv-surface)]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[var(--pv-text)]">
                            {config.label}
                          </span>
                          <span className="flex h-5 w-5 items-center justify-center rounded bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-[10px] font-bold text-white">
                            {activeKey}
                          </span>
                        </div>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={12} className="text-[var(--pv-text-muted)]" />
                        </motion.div>
                      </button>

                      {/* Options */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-0.5 px-1 pb-1.5 pt-0.5">
                              {config.options.map((option) => {
                                const isActive = activeKey === option.key;
                                return (
                                  <button
                                    key={option.key}
                                    onClick={() => setVariant(sectionKey, option.key)}
                                    className={`flex items-center gap-2.5 rounded-pv-sm px-2.5 py-1.5 text-left transition-all ${
                                      isActive
                                        ? 'bg-[var(--pv-surface)]'
                                        : 'hover:bg-[var(--pv-surface)]/50'
                                    }`}
                                  >
                                    <span
                                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-[11px] font-semibold transition-all ${
                                        isActive
                                          ? 'bg-[linear-gradient(135deg,var(--pv-primary),var(--pv-primary-2))] text-white shadow-[0_2px_8px_-2px_rgba(63,0,233,0.4)]'
                                          : 'bg-[var(--pv-border)] text-[var(--pv-text-muted)]'
                                      }`}
                                    >
                                      {option.key}
                                    </span>
                                    <span
                                      className={`text-[11px] leading-tight ${
                                        isActive
                                          ? 'font-medium text-[var(--pv-text)]'
                                          : 'text-[var(--pv-text-muted)]'
                                      }`}
                                    >
                                      {option.description}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                },
              )}
            </div>

            {/* Active summary */}
            <div className="border-t border-[var(--pv-border)] px-3 py-2">
              <p className="text-[10px] text-[var(--pv-text-muted)]">
                {(Object.entries(SECTIONS) as [SectionKey, SectionConfig][])
                  .map(([key, config]) => {
                    const active = config.options.find((o) => o.key === variants[key]);
                    return `${config.label}: ${active?.description}`;
                  })
                  .join(' · ')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
