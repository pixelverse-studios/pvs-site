import { getApiBaseUrl } from '@/lib/api-config';
import type {
  Client,
  ClientListItem,
  ClientCreatePayload,
  ClientUpdatePayload,
  ClientListResponse,
  ClientQueryParams,
} from '@/lib/types/client';

const API_BASE = getApiBaseUrl();

// List clients with pagination and filtering
export async function getClients(params?: ClientQueryParams): Promise<ClientListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));
  if (params?.active !== undefined) searchParams.set('active', String(params.active));
  if (params?.search) searchParams.set('search', params.search);

  const url = `${API_BASE}/api/clients?${searchParams}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch clients');
  return res.json();
}

// Get single client by ID (includes websites)
export async function getClient(id: string): Promise<Client> {
  const res = await fetch(`${API_BASE}/api/clients/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    if (res.status === 404) throw new Error('Client not found');
    throw new Error('Failed to fetch client');
  }
  return res.json();
}

// Create new client
export async function createClient(data: ClientCreatePayload): Promise<Client> {
  const res = await fetch(`${API_BASE}/api/clients/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create client');
  }
  return res.json();
}

// Update existing client
export async function updateClient(id: string, data: ClientUpdatePayload): Promise<Client> {
  const res = await fetch(`${API_BASE}/api/clients/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update client');
  }
  return res.json();
}

// Delete client (cascades to websites/apps)
export async function deleteClient(id: string): Promise<Client> {
  const res = await fetch(`${API_BASE}/api/clients/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to delete client');
  }
  return res.json();
}

// Convenience: Get active clients only
export async function getActiveClients(limit = 50): Promise<ClientListResponse> {
  return getClients({ active: true, limit });
}

// Convenience: Get client count for dashboard stats
export async function getClientCount(active?: boolean): Promise<number> {
  const { total } = await getClients({ active, limit: 1 });
  return total;
}
