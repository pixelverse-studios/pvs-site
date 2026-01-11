'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyState?: React.ReactNode;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  getRowClassName?: (row: TData) => string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyState,
  globalFilter,
  onGlobalFilterChange,
  getRowClassName,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onGlobalFilterChange,
  });

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <>
      {/* Desktop Table */}
      <div
        className="hidden max-h-[calc(100vh-580px)] overflow-auto rounded-xl border md:block"
        style={{ borderColor: 'var(--pv-border)' }}
      >
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr
              className="border-b"
              style={{ background: 'var(--pv-surface)', borderColor: 'var(--pv-border)' }}
            >
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--pv-text-muted)]',
                      header.column.getCanSort() && 'cursor-pointer select-none hover:text-[var(--pv-text)]'
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && (
                        <span className="ml-1">
                          {header.column.getIsSorted() === 'asc' ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  'border-t transition-colors hover:bg-[var(--pv-surface)]',
                  getRowClassName?.(row.original)
                )}
                style={{ borderColor: 'var(--pv-border)' }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm" style={{ color: 'var(--pv-text)' }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="max-h-[calc(100vh-540px)] space-y-3 overflow-auto md:hidden">
        {table.getRowModel().rows.map((row) => (
          <div
            key={row.id}
            className={cn('rounded-xl border p-4', getRowClassName?.(row.original))}
            style={{ borderColor: 'var(--pv-border)', background: 'var(--pv-surface)' }}
          >
            {row.getVisibleCells().map((cell, index) => {
              const header = cell.column.columnDef.header;
              const headerText = typeof header === 'string' ? header : '';

              return (
                <div key={cell.id} className={index === 0 ? 'mb-2' : 'mb-1'}>
                  {index > 0 && headerText && (
                    <span className="text-xs text-[var(--pv-text-muted)]">{headerText}: </span>
                  )}
                  <span className={index === 0 ? 'text-sm font-medium' : 'text-sm'}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
