'use client';

import { useState } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DateRangePreset = 'all' | 'today' | '7d' | '30d' | 'custom';

export interface DateRange {
  preset: DateRangePreset;
  startDate: string | null;
  endDate: string | null;
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  className?: string;
}

const PRESETS: { value: DateRangePreset; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom range' },
];

function getPresetDates(preset: DateRangePreset): { startDate: string | null; endDate: string | null } {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  switch (preset) {
    case 'today':
      return { startDate: today, endDate: today };
    case '7d': {
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return { startDate: sevenDaysAgo.toISOString().split('T')[0], endDate: today };
    }
    case '30d': {
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return { startDate: thirtyDaysAgo.toISOString().split('T')[0], endDate: today };
    }
    case 'all':
    case 'custom':
    default:
      return { startDate: null, endDate: null };
  }
}

export function getDateRangeLabel(value: DateRange): string {
  if (value.preset === 'custom' && value.startDate && value.endDate) {
    const start = new Date(value.startDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const end = new Date(value.endDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    return `${start} - ${end}`;
  }
  return PRESETS.find((p) => p.value === value.preset)?.label || 'All time';
}

export function DateRangeFilter({ value, onChange, className }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomInputs, setShowCustomInputs] = useState(value.preset === 'custom');

  const handlePresetClick = (preset: DateRangePreset) => {
    if (preset === 'custom') {
      setShowCustomInputs(true);
      onChange({ preset: 'custom', startDate: value.startDate, endDate: value.endDate });
    } else {
      setShowCustomInputs(false);
      const dates = getPresetDates(preset);
      onChange({ preset, ...dates });
      setIsOpen(false);
    }
  };

  const handleCustomDateChange = (field: 'startDate' | 'endDate', dateValue: string) => {
    onChange({
      ...value,
      preset: 'custom',
      [field]: dateValue || null,
    });
  };

  const handleApplyCustom = () => {
    if (value.startDate && value.endDate) {
      setIsOpen(false);
    }
  };

  const displayLabel = getDateRangeLabel(value);
  const isActive = value.preset !== 'all';

  return (
    <div className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-10 items-center gap-2 rounded-lg border px-3 text-sm transition-colors',
          isActive
            ? 'border-[var(--pv-primary)] bg-[var(--pv-primary)]/10 text-[var(--pv-primary)]'
            : 'border-[var(--pv-border)] hover:border-[var(--pv-primary)]'
        )}
        style={{
          color: isActive ? undefined : 'var(--pv-text)',
          background: isActive ? undefined : 'var(--pv-surface)',
        }}
      >
        <Calendar className="h-4 w-4" />
        <span className="max-w-[120px] truncate">{displayLabel}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown Content */}
          <div
            className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border shadow-lg"
            style={{
              borderColor: 'var(--pv-border)',
              background: 'var(--pv-bg)',
            }}
          >
            {/* Preset Options */}
            <div className="p-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handlePresetClick(preset.value)}
                  className={cn(
                    'flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors',
                    value.preset === preset.value
                      ? 'bg-[var(--pv-primary)]/10 text-[var(--pv-primary)]'
                      : 'text-[var(--pv-text)] hover:bg-[var(--pv-surface)]'
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Date Inputs */}
            {showCustomInputs && (
              <div
                className="border-t p-3"
                style={{ borderColor: 'var(--pv-border)' }}
              >
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-[var(--pv-text-muted)]">
                      Start date
                    </label>
                    <input
                      type="date"
                      value={value.startDate || ''}
                      onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                      className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[var(--pv-primary)]"
                      style={{
                        borderColor: 'var(--pv-border)',
                        background: 'var(--pv-surface)',
                        color: 'var(--pv-text)',
                      }}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[var(--pv-text-muted)]">
                      End date
                    </label>
                    <input
                      type="date"
                      value={value.endDate || ''}
                      onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                      min={value.startDate || undefined}
                      className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[var(--pv-primary)]"
                      style={{
                        borderColor: 'var(--pv-border)',
                        background: 'var(--pv-surface)',
                        color: 'var(--pv-text)',
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCustom}
                    disabled={!value.startDate || !value.endDate}
                    className={cn(
                      'w-full rounded-md py-2 text-sm font-medium transition-colors',
                      value.startDate && value.endDate
                        ? 'bg-[var(--pv-primary)] text-white hover:opacity-90'
                        : 'cursor-not-allowed bg-[var(--pv-border)] text-[var(--pv-text-muted)]'
                    )}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Helper to create initial date range state
export function createDateRange(preset: DateRangePreset = 'all'): DateRange {
  const dates = getPresetDates(preset);
  return { preset, ...dates };
}
