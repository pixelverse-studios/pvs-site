import { getApiBaseUrl } from '@/lib/api-config';
import type {
  AgendaItem,
  AgendaListResponse,
  AgendaReorderResponse,
  AgendaQueryParams,
  CreateAgendaItemRequest,
  UpdateAgendaItemRequest,
  UpdateAgendaStatusRequest,
  UpdateAgendaPriorityRequest,
  ReorderAgendaRequest,
} from '@/lib/types/agenda';

const API_BASE = getApiBaseUrl();

// List agenda items
export async function getAgendaItems(params?: AgendaQueryParams): Promise<AgendaListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set('status', params.status);
  if (params?.category) searchParams.set('category', params.category);
  if (params?.include_completed) searchParams.set('include_completed', 'true');
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const url = `${API_BASE}/api/agenda?${searchParams}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch agenda items');
  return res.json();
}

// Get single item
export async function getAgendaItem(id: string): Promise<AgendaItem> {
  const res = await fetch(`${API_BASE}/api/agenda/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch agenda item');
  return res.json();
}

// Create item
export async function createAgendaItem(data: CreateAgendaItemRequest): Promise<AgendaItem> {
  const res = await fetch(`${API_BASE}/api/agenda/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create agenda item');
  }
  return res.json();
}

// Update item details
export async function updateAgendaItem(
  id: string,
  data: UpdateAgendaItemRequest,
): Promise<AgendaItem> {
  const res = await fetch(`${API_BASE}/api/agenda/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update agenda item');
  return res.json();
}

// Update status
export async function updateAgendaStatus(
  id: string,
  data: UpdateAgendaStatusRequest,
): Promise<AgendaItem> {
  const res = await fetch(`${API_BASE}/api/agenda/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update agenda status');
  return res.json();
}

// Update priority
export async function updateAgendaPriority(
  id: string,
  data: UpdateAgendaPriorityRequest,
): Promise<AgendaItem> {
  const res = await fetch(`${API_BASE}/api/agenda/${id}/priority`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update agenda priority');
  return res.json();
}

// Bulk reorder
export async function reorderAgendaItems(
  data: ReorderAgendaRequest,
): Promise<AgendaReorderResponse> {
  const res = await fetch(`${API_BASE}/api/agenda/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to reorder agenda items');
  return res.json();
}

// Delete item
export async function deleteAgendaItem(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/agenda/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete agenda item');
}

// Convenience: Get active items (pending + in_progress)
export async function getActiveAgendaItems(limit = 10): Promise<AgendaListResponse> {
  return getAgendaItems({ status: 'active', limit });
}

// Convenience: Get pending count for stat card
export async function getPendingAgendaCount(): Promise<number> {
  const { total } = await getAgendaItems({ status: 'pending', limit: 1 });
  return total;
}
