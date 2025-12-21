/**
 * Type definitions for Agenda Items feature
 * Three-state workflow: pending -> in_progress -> completed
 */

export type AgendaStatus = 'pending' | 'in_progress' | 'completed';

export interface AgendaItem {
  id: string;
  name: string;
  description: string | null;
  status: AgendaStatus;
  priority: number; // 0 = highest priority
  category: string | null;
  due_date: string | null; // ISO date "2025-12-25"
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface AgendaListResponse {
  items: AgendaItem[];
  total: number;
}

export interface AgendaReorderResponse {
  updated: number;
  items: AgendaItem[];
}

// Request types
export interface CreateAgendaItemRequest {
  name: string;
  description?: string;
  category?: string;
  due_date?: string;
  priority?: number;
}

export interface UpdateAgendaItemRequest {
  name?: string;
  description?: string | null;
  category?: string | null;
  due_date?: string | null;
}

export interface UpdateAgendaStatusRequest {
  status: AgendaStatus;
}

export interface UpdateAgendaPriorityRequest {
  priority: number;
}

export interface ReorderAgendaRequest {
  item_ids: string[];
}

// Query params type
export interface AgendaQueryParams {
  status?: AgendaStatus | 'active';
  category?: string;
  include_completed?: boolean;
  limit?: number;
  offset?: number;
}
