'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const STORAGE_KEY = 'pv-dark-variant';
const ACCENT_STORAGE_KEY = 'pv-dark-accent';
const MINIMIZED_STORAGE_KEY = 'pv-dark-picker-minimized';

const VARIANTS = [
  {
    id: 0,
    name: 'Slate',
    description: 'Soft purple-dark',
    bg: '#0e0e14',
    surface: '#18182a',
    border: '#252540',
  },
  {
    id: 1,
    name: 'Dusk',
    description: 'Warm charcoal',
    bg: '#141110',
    surface: '#1e1b18',
    border: '#2e2926',
  },
  {
    id: 2,
    name: 'Ink',
    description: 'Pure neutral',
    bg: '#111111',
    surface: '#1a1a1a',
    border: '#2a2a2a',
  },
  {
    id: 3,
    name: 'Violet',
    description: 'Deep indigo-purple',
    bg: '#11101e',
    surface: '#1b1933',
    border: '#252347',
  },
  {
    id: 4,
    name: 'Plum',
    description: 'Warm violet',
    bg: '#130f18',
    surface: '#1f1828',
    border: '#2e2240',
  },
] as const;

const ACCENTS = [
  {
    id: 0,
    name: 'Original',
    description: 'Full-strength brand blue',
    color: '#3f00e9',
    color2: '#c947ff',
  },
  {
    id: 1,
    name: 'Electric',
    description: 'Vivid, high contrast',
    color: '#7c4dff',
    color2: '#d060ff',
  },
  {
    id: 2,
    name: 'Soft',
    description: 'Balanced, approachable',
    color: '#9575f5',
    color2: '#cc6aff',
  },
  {
    id: 3,
    name: 'Muted',
    description: 'Gentle lavender',
    color: '#b09cf8',
    color2: '#d47aff',
  },
] as const;

type VariantId = (typeof VARIANTS)[number]['id'];
type AccentId = (typeof ACCENTS)[number]['id'];

export function DarkThemePicker() {
  const { resolvedTheme } = useTheme();
  const [active, setActive] = useState<VariantId>(0);
  const [activeAccent, setActiveAccent] = useState<AccentId>(1);
  const [minimized, setMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedVariant = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10);
    const validVariant = (VARIANTS.find((v) => v.id === savedVariant)?.id ?? 0) as VariantId;
    applyVariant(validVariant);
    setActive(validVariant);

    const savedAccent = parseInt(localStorage.getItem(ACCENT_STORAGE_KEY) ?? '1', 10);
    const validAccent = (ACCENTS.find((a) => a.id === savedAccent)?.id ?? 1) as AccentId;
    applyAccent(validAccent);
    setActiveAccent(validAccent);

    const savedMinimized = localStorage.getItem(MINIMIZED_STORAGE_KEY) === 'true';
    setMinimized(savedMinimized);
  }, []);

  function applyVariant(id: VariantId) {
    document.documentElement.setAttribute('data-dark-variant', String(id));
    localStorage.setItem(STORAGE_KEY, String(id));
  }

  function applyAccent(id: AccentId) {
    document.documentElement.setAttribute('data-dark-accent', String(id));
    localStorage.setItem(ACCENT_STORAGE_KEY, String(id));
  }

  function select(id: VariantId) {
    setActive(id);
    applyVariant(id);
  }

  function selectAccent(id: AccentId) {
    setActiveAccent(id);
    applyAccent(id);
  }

  function toggleMinimized() {
    const next = !minimized;
    setMinimized(next);
    localStorage.setItem(MINIMIZED_STORAGE_KEY, String(next));
  }

  if (!mounted || resolvedTheme !== 'dark') return null;

  const currentAccent = ACCENTS[activeAccent];

  // ── Minimized pill ──────────────────────────────────────────────────
  if (minimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 select-none">
        <button
          onClick={toggleMinimized}
          aria-label="Open dark theme picker"
          className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${currentAccent.color}, ${currentAccent.color2})`,
            boxShadow: `0 0 0 2px rgba(255,255,255,0.1), 0 8px 20px -4px ${currentAccent.color}70`,
          }}
        >
          {/* Palette dot pattern */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="5" cy="5" r="2" fill="rgba(255,255,255,0.9)" />
            <circle cx="11" cy="5" r="2" fill="rgba(255,255,255,0.6)" />
            <circle cx="5" cy="11" r="2" fill="rgba(255,255,255,0.6)" />
            <circle cx="11" cy="11" r="2" fill="rgba(255,255,255,0.3)" />
          </svg>
        </button>
      </div>
    );
  }

  // ── Expanded widget ─────────────────────────────────────────────────
  return (
    <div
      role="group"
      aria-label="Dark theme variant picker"
      className="fixed bottom-6 right-6 z-50 select-none"
    >
      <div
        className="rounded-2xl border p-3"
        style={{
          background: 'rgba(18, 18, 28, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          boxShadow: '0 24px 48px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {/* Header row: label + minimize button */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <p
            className="text-[0.625rem] font-semibold uppercase tracking-[0.2em]"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            Dark Theme
          </p>
          <button
            onClick={toggleMinimized}
            aria-label="Minimize dark theme picker"
            className="flex h-6 w-6 items-center justify-center rounded transition-opacity duration-150 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            {/* Minus icon */}
            <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor" aria-hidden="true">
              <rect width="10" height="2" rx="1" />
            </svg>
          </button>
        </div>

        {/* Theme swatches */}
        <div className="flex gap-2.5">
          {VARIANTS.map((variant) => {
            const isActive = active === variant.id;
            return (
              <button
                key={variant.id}
                onClick={() => select(variant.id)}
                aria-pressed={isActive}
                aria-label={`${variant.name}: ${variant.description}`}
                className="group flex flex-col items-center gap-1.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:rounded-lg"
              >
                <div
                  className="relative h-14 w-12 overflow-hidden rounded-xl transition-all duration-200"
                  style={{
                    background: variant.bg,
                    border: isActive
                      ? `2px solid ${currentAccent.color}`
                      : `2px solid ${variant.border}`,
                    transform: isActive ? 'scale(1.08)' : 'scale(1)',
                    boxShadow: isActive
                      ? `0 0 0 3px ${currentAccent.color}40, 0 8px 20px -4px rgba(0,0,0,0.5)`
                      : '0 4px 12px -4px rgba(0,0,0,0.4)',
                  }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 h-5"
                    style={{ background: variant.surface }}
                  />
                  <div
                    className="absolute left-1/2 top-2.5 h-2 w-2 -translate-x-1/2 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${currentAccent.color}, ${currentAccent.color2})`,
                      opacity: isActive ? 1 : 0.5,
                    }}
                  />
                  {isActive && (
                    <div
                      className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full"
                      style={{ background: currentAccent.color }}
                    />
                  )}
                </div>
                <span
                  className="text-[0.6875rem] font-medium transition-colors duration-200"
                  style={{
                    color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
                  }}
                >
                  {variant.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div
          className="my-3 h-px"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          aria-hidden="true"
        />

        {/* Accent row */}
        <p
          className="mb-3 text-center text-[0.625rem] font-semibold uppercase tracking-[0.2em]"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          Accent
        </p>

        <div className="flex justify-center gap-4">
          {ACCENTS.map((accent) => {
            const isActive = activeAccent === accent.id;
            return (
              <button
                key={accent.id}
                onClick={() => selectAccent(accent.id)}
                aria-pressed={isActive}
                aria-label={`Accent: ${accent.name} — ${accent.description}`}
                className="flex flex-col items-center gap-1.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:rounded-full"
              >
                <div
                  className="relative rounded-full transition-all duration-200"
                  style={{
                    width: 28,
                    height: 28,
                    background: `linear-gradient(135deg, ${accent.color}, ${accent.color2})`,
                    border: isActive
                      ? '2px solid rgba(255,255,255,0.7)'
                      : '2px solid rgba(255,255,255,0.12)',
                    transform: isActive ? 'scale(1.15)' : 'scale(1)',
                    boxShadow: isActive
                      ? `0 0 0 3px ${accent.color}35, 0 4px 12px -2px ${accent.color}60`
                      : 'none',
                    opacity: isActive ? 1 : 0.55,
                  }}
                />
                <span
                  className="text-[0.6rem] font-medium uppercase tracking-[0.1em] transition-colors duration-200"
                  style={{
                    color: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {accent.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
