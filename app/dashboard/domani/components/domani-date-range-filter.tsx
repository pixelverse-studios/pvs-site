'use client';
import React, { useState } from 'react';
import { Button, Popover, Select, Stack } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  createDateRange,
  getDateRangeLabel,
  type DateRange,
  type DateRangePreset,
} from '@/components/ui/date-range-filter';
import { fieldClassNames, selectClassNames } from './domani-controls';
export { getDateRangeLabel };
export type { DateRange };
const presets = [
  { value: 'all', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom range' },
];
export function DateRangeFilter({
  value,
  onChange,
  className,
}: {
  value: DateRange;
  onChange: (value: DateRange) => void;
  className?: string;
}) {
  const [opened, setOpened] = useState(false);
  const [draft, setDraft] = useState(value);
  const valid = !!draft.startDate && !!draft.endDate && draft.startDate <= draft.endDate;
  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-start"
      width={290}
      trapFocus
      returnFocus
      shadow="md"
    >
      <Popover.Target>
        <Button
          variant="default"
          className={className}
          onClick={() => {
            setDraft(value);
            setOpened(!opened);
          }}
        >
          {getDateRangeLabel(value)}
        </Button>
      </Popover.Target>
      <Popover.Dropdown style={{ background: 'var(--pv-bg)', color: 'var(--pv-text)' }}>
        <Stack gap="sm">
          <Select
            label="Date range"
            data={presets}
            value={draft.preset}
            allowDeselect={false}
            classNames={selectClassNames}
            comboboxProps={{ withinPortal: false }}
            onChange={(value) => {
              if (!value) return;
              const preset = value as DateRangePreset;
              if (preset === 'custom') setDraft({ ...draft, preset });
              else {
                onChange(createDateRange(preset));
                setOpened(false);
              }
            }}
          />
          {draft.preset === 'custom' && (
            <>
              <DateInput
                label="Start date"
                value={draft.startDate}
                onChange={(startDate) => setDraft({ ...draft, startDate })}
                valueFormat="MMM D, YYYY"
                clearable
                classNames={fieldClassNames}
                popoverProps={{ withinPortal: false }}
              />
              <DateInput
                label="End date"
                value={draft.endDate}
                minDate={draft.startDate || undefined}
                onChange={(endDate) => setDraft({ ...draft, endDate })}
                valueFormat="MMM D, YYYY"
                clearable
                classNames={fieldClassNames}
                popoverProps={{ withinPortal: false }}
              />
              <Button
                disabled={!valid}
                onClick={() => {
                  onChange(draft);
                  setOpened(false);
                }}
              >
                Apply
              </Button>
            </>
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
