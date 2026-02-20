'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const STORAGE_KEY = 'pv-dark-variant';

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

type VariantId = (typeof VARIANTS)[number]['id'];

export function DarkThemePicker() {
  const { resolvedTheme } = useTheme();
  const [active, setActive] = useState<VariantId>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10) as VariantId;
    const valid = VARIANTS.find((v) => v.id === saved)?.id ?? 0;
    applyVariant(valid);
    setActive(valid);
  }, []);

  function applyVariant(id: VariantId) {
    document.documentElement.setAttribute('data-dark-variant', String(id));
    localStorage.setItem(STORAGE_KEY, String(id));
  }

  function select(id: VariantId) {
    setActive(id);
    applyVariant(id);
  }

  if (!mounted || resolvedTheme !== 'dark') return null;

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
        {/* Header */}
        <p
          className="mb-3 text-center text-[0.625rem] font-semibold uppercase tracking-[0.2em]"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          Dark Theme
        </p>

        {/* Swatches */}
        <div className="flex gap-2.5">
          {VARIANTS.map((variant) => {
            const isActive = active === variant.id;
            return (
              <button
                key={variant.id}
                onClick={() => select(variant.id)}
                aria-pressed={isActive}
                aria-label={`${variant.name}: ${variant.description}`}
                className="group flex flex-col items-center gap-1.5 transition-all duration-200"
                style={{ outline: 'none' }}
              >
                {/* Swatch preview card */}
                <div
                  className="relative h-14 w-12 overflow-hidden rounded-xl transition-all duration-200"
                  style={{
                    background: variant.bg,
                    border: isActive
                      ? '2px solid #3f00e9'
                      : `2px solid ${variant.border}`,
                    transform: isActive ? 'scale(1.08)' : 'scale(1)',
                    boxShadow: isActive
                      ? '0 0 0 3px rgba(63,0,233,0.25), 0 8px 20px -4px rgba(0,0,0,0.5)'
                      : '0 4px 12px -4px rgba(0,0,0,0.4)',
                  }}
                >
                  {/* Surface stripe */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-5"
                    style={{ background: variant.surface }}
                  />
                  {/* Gradient accent dot */}
                  <div
                    className="absolute left-1/2 top-2.5 h-2 w-2 -translate-x-1/2 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #3f00e9, #c947ff)',
                      opacity: isActive ? 1 : 0.5,
                    }}
                  />
                  {/* Active indicator */}
                  {isActive && (
                    <div
                      className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full"
                      style={{ background: '#3f00e9' }}
                    />
                  )}
                </div>

                {/* Label */}
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
      </div>
    </div>
  );
}
