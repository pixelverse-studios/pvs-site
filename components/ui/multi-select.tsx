'use client';

import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check, ChevronDown, X } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface MultiSelectGroup {
  label: string;
  options: MultiSelectOption[];
}

interface MultiSelectProps {
  groups: MultiSelectGroup[];
  values: string[];
  onValuesChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

export function MultiSelect({
  groups,
  values,
  onValuesChange,
  placeholder = 'Select options...',
  disabled = false,
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const contentId = React.useId();

  const allOptions = React.useMemo(
    () => groups.flatMap((g) => g.options),
    [groups]
  );

  const selectedLabels = React.useMemo(
    () =>
      values
        .map((v) => allOptions.find((o) => o.value === v)?.label)
        .filter(Boolean) as string[],
    [values, allOptions]
  );

  const handleToggle = (value: string) => {
    if (values.includes(value)) {
      onValuesChange(values.filter((v) => v !== value));
    } else {
      onValuesChange([...values, value]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValuesChange([]);
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onValuesChange(values.filter((v) => v !== value));
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={contentId}
          aria-haspopup="listbox"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          className={cn(
            'flex min-h-11 w-full items-center justify-between rounded-pv-sm border border-[var(--pv-border)] bg-[var(--pv-surface)] px-4 py-2 text-left text-base text-[var(--pv-text)] shadow-sm transition-colors-opacity-transform focus-visible:border-[var(--pv-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pv-bg)] disabled:cursor-not-allowed disabled:opacity-60',
            className
          )}
        >
          <span className="flex-1 truncate">
            {values.length === 0 ? (
              <span className="text-[var(--pv-text-muted)]">{placeholder}</span>
            ) : (
              <span>
                {values.length} {values.length === 1 ? 'item' : 'items'} selected
              </span>
            )}
          </span>
          <div className="flex items-center gap-2">
            {values.length > 0 && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onValuesChange([]);
                  }
                }}
                className="rounded p-0.5 hover:bg-[var(--pv-bg)] focus:outline-none focus:ring-1 focus:ring-[var(--pv-primary)]"
                aria-label="Clear all selections"
              >
                <X className="h-4 w-4 opacity-70" />
              </span>
            )}
            <ChevronDown
              className={cn(
                'h-4 w-4 opacity-70 transition-transform',
                open && 'rotate-180'
              )}
            />
          </div>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          id={contentId}
          role="listbox"
          aria-multiselectable="true"
          align="start"
          sideOffset={4}
          className={cn(
            'z-50 max-h-80 w-[var(--radix-popover-trigger-width)] overflow-y-auto rounded-pv border border-[var(--pv-border)] bg-[var(--pv-surface)] p-1 shadow-pv',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2'
          )}
        >
          {groups.map((group, groupIndex) => (
            <div key={group.label}>
              {groupIndex > 0 && (
                <div className="my-1 h-px bg-[var(--pv-border)]" />
              )}
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--pv-text-muted)]">
                {group.label}
              </div>
              {group.options.map((option) => {
                const isSelected = values.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className={cn(
                      'flex cursor-pointer select-none items-center gap-3 rounded-pv-sm px-3 py-2 text-sm transition-colors hover:bg-[var(--pv-bg)]',
                      isSelected && 'bg-[var(--pv-bg)]/50'
                    )}
                  >
                    <Checkbox.Root
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(option.value)}
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded border border-[var(--pv-border)] transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pv-ring)] focus-visible:ring-offset-1',
                        isSelected &&
                          'border-[var(--pv-primary)] bg-[var(--pv-primary)]'
                      )}
                    >
                      <Checkbox.Indicator>
                        <Check className="h-3 w-3 text-white" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <span className="flex-1 text-[var(--pv-text)]">
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          ))}
        </Popover.Content>
      </Popover.Portal>

      {/* Selected items badges shown below trigger */}
      {values.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selectedLabels.slice(0, 5).map((label, i) => (
            <span
              key={values[i]}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-2.5 py-0.5 text-xs text-[var(--pv-text)]"
            >
              {label}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => handleRemove(values[i], e)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-[var(--pv-bg)] focus:outline-none focus:ring-1 focus:ring-[var(--pv-primary)]"
                  aria-label={`Remove ${label}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
          {values.length > 5 && (
            <span className="inline-flex items-center rounded-full border border-[var(--pv-border)] bg-[var(--pv-surface)] px-2.5 py-0.5 text-xs text-[var(--pv-text-muted)]">
              +{values.length - 5} more
            </span>
          )}
        </div>
      )}
    </Popover.Root>
  );
}
