'use client';

import { Search, LayoutList, LayoutGrid, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Client } from '@/lib/types/client';

// Type exports for parent component usage
export type ViewMode = 'table' | 'board';
export type PhaseFilter = 'all' | 'sales' | 'project' | 'post-launch';
export type TypeFilter = 'all' | 'website' | 'app';

interface ClientsToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  phaseFilter: PhaseFilter;
  onPhaseFilterChange: (phase: PhaseFilter) => void;
  typeFilter: TypeFilter;
  onTypeFilterChange: (type: TypeFilter) => void;
  // New: Client filter
  clients?: Client[];
  selectedClientIds?: string[];
  onClientFilterChange?: (clientIds: string[]) => void;
}

export function ClientsToolbar({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  phaseFilter,
  onPhaseFilterChange,
  typeFilter,
  onTypeFilterChange,
  clients = [],
  selectedClientIds = [],
  onClientFilterChange,
}: ClientsToolbarProps) {
  // Helper to get client display name
  const getClientName = (client: Client) => {
    if (client.firstname && client.lastname) {
      return `${client.firstname} ${client.lastname}`;
    }
    if (client.firstname) return client.firstname;
    if (client.lastname) return client.lastname;
    return client.client || 'Unknown';
  };

  // Handle client selection
  const handleClientSelect = (clientId: string) => {
    if (!onClientFilterChange) return;

    if (clientId === 'all') {
      onClientFilterChange([]);
    } else {
      // Toggle selection
      const newSelection = selectedClientIds.includes(clientId)
        ? selectedClientIds.filter((id) => id !== clientId)
        : [...selectedClientIds, clientId];
      onClientFilterChange(newSelection);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--pv-text-muted)]" />
          <Input
            placeholder="Search clients or projects..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Client Filter (only show in board view with clients) */}
          {viewMode === 'board' && clients.length > 0 && onClientFilterChange && (
            <Select
              value={selectedClientIds.length === 0 ? 'all' : selectedClientIds[0]}
              onValueChange={handleClientSelect}
            >
              <SelectTrigger className="h-10 w-[160px]">
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {getClientName(client)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Phase Filter */}
          <Select
            value={phaseFilter}
            onValueChange={(value) => onPhaseFilterChange(value as PhaseFilter)}
          >
            <SelectTrigger className="h-10 w-[150px]">
              <SelectValue placeholder="All Phases" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Phases</SelectItem>
              <SelectItem value="sales">Sales Pipeline</SelectItem>
              <SelectItem value="project">Active Projects</SelectItem>
              <SelectItem value="post-launch">Post-Launch</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select
            value={typeFilter}
            onValueChange={(value) => onTypeFilterChange(value as TypeFilter)}
          >
            <SelectTrigger className="h-10 w-[130px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="website">Websites</SelectItem>
              <SelectItem value="app">Apps</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div
            className="flex items-center overflow-hidden rounded-md border"
            style={{ borderColor: 'var(--pv-border)' }}
          >
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('table')}
              className={cn(
                'h-9 rounded-none border-r px-3',
                viewMode !== 'table' && 'bg-transparent',
              )}
              style={{ borderColor: 'var(--pv-border)' }}
              aria-label="Table view"
              aria-pressed={viewMode === 'table'}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'board' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('board')}
              className={cn('h-9 rounded-none px-3', viewMode !== 'board' && 'bg-transparent')}
              aria-label="Board view"
              aria-pressed={viewMode === 'board'}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {selectedClientIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedClientIds.map((clientId) => {
            const client = clients.find((c) => c.id === clientId);
            if (!client) return null;
            return (
              <button
                key={clientId}
                onClick={() => handleClientSelect(clientId)}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm transition-colors hover:opacity-80"
                style={{
                  background: 'var(--pv-primary)',
                  color: 'white',
                }}
              >
                {getClientName(client)}
                <X className="h-3 w-3" />
              </button>
            );
          })}
          {selectedClientIds.length > 1 && (
            <button
              onClick={() => onClientFilterChange?.([])}
              className="text-sm text-[var(--pv-text-muted)] hover:text-[var(--pv-text)]"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// localStorage key for view mode persistence
export const VIEW_MODE_STORAGE_KEY = 'pvs-clients-view-mode';

// Helper to get saved view mode from localStorage
export function getSavedViewMode(): ViewMode {
  if (typeof window === 'undefined') return 'board'; // Default to board view
  const saved = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
  if (saved === 'table' || saved === 'board') {
    return saved;
  }
  return 'board'; // Default to board view
}

// Helper to save view mode to localStorage
export function saveViewMode(mode: ViewMode): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
}
