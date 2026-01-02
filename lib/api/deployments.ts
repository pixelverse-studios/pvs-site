import { getApiBaseUrl } from '@/lib/api-config';
import type {
  Deployment,
  DeploymentDetail,
  DeploymentsResponse,
  IndexingStatus,
} from '@/lib/types/deployment';

// Get single deployment by ID (includes website and client context)
export async function getDeployment(id: string): Promise<DeploymentDetail> {
  const res = await fetch(`${getApiBaseUrl()}/api/deployments/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 404 || res.status === 400) {
      throw new Error('Deployment not found');
    }
    throw new Error(`Failed to fetch deployment: ${res.status}`);
  }

  return res.json();
}

// Get deployments for a website with optional pagination
export async function getWebsiteDeployments(
  websiteId: string,
  params?: { limit?: number; offset?: number },
): Promise<DeploymentsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const queryString = searchParams.toString();
  const url = `${getApiBaseUrl()}/api/websites/${websiteId}/deployments${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Website not found');
    }
    throw new Error(`Failed to fetch deployments: ${res.status}`);
  }

  return res.json();
}

// Update a single URL's indexing status within a deployment
export async function updateDeploymentUrlStatus(
  deploymentId: string,
  url: string,
  status: IndexingStatus,
): Promise<Deployment> {
  const res = await fetch(`${getApiBaseUrl()}/api/deployments/${deploymentId}/urls/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, status }),
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Deployment not found');
    }
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to update URL status: ${res.status}`);
  }

  return res.json();
}

// Update all URLs' indexing status within a deployment
export async function updateAllDeploymentUrlsStatus(
  deploymentId: string,
  status: IndexingStatus,
): Promise<Deployment> {
  const res = await fetch(`${getApiBaseUrl()}/api/deployments/${deploymentId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Deployment not found');
    }
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to update deployment status: ${res.status}`);
  }

  return res.json();
}
