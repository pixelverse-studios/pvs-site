'use client';
import React from 'react';
import { ActionIcon, Select } from '@mantine/core';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationProps } from '@/components/ui/pagination';
import { selectClassNames } from './domani-controls';
export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [25, 50, 100],
  className = '',
}: PaginationProps) {
  const pages = Math.max(1, Math.ceil(totalItems / pageSize));
  return (
    <div className={`flex flex-wrap items-center justify-between gap-2 ${className}`}>
      <div className="flex items-center gap-2 text-sm">
        <span>Rows per page:</span>
        <Select
          aria-label="Rows per page"
          w={80}
          size="xs"
          classNames={selectClassNames}
          allowDeselect={false}
          value={String(pageSize)}
          data={Array.from(new Set([...pageSizeOptions, pageSize]))
            .sort((a, b) => a - b)
            .map(String)}
          onChange={(value) => value && onPageSizeChange(Number(value))}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span>
          {totalItems
            ? `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalItems)} of ${totalItems}`
            : 'No results'}
        </span>
        <ActionIcon
          variant="default"
          aria-label="Previous page"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} />
        </ActionIcon>
        <span>
          Page {currentPage} of {pages}
        </span>
        <ActionIcon
          variant="default"
          aria-label="Next page"
          disabled={currentPage >= pages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={16} />
        </ActionIcon>
      </div>
    </div>
  );
}
