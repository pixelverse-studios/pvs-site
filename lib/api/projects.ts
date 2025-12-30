import { getApiBaseUrl } from '@/lib/api-config';
import type { Project, ProjectStatus, ProjectType } from '@/lib/types/project';

const API_BASE = getApiBaseUrl();

// Update project status (website or app)
export async function updateProjectStatus(
  projectId: string,
  projectType: ProjectType,
  status: ProjectStatus
): Promise<Project> {
  const endpoint = projectType === 'website' ? 'websites' : 'apps';
  const res = await fetch(`${API_BASE}/api/${endpoint}/${projectId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update project status');
  }
  return res.json();
}

// Batch reorder projects (update priorities)
export interface ProjectPriorityUpdate {
  id: string;
  type: ProjectType;
  priority: number;
}

export async function reorderProjects(updates: ProjectPriorityUpdate[]): Promise<void> {
  // Group by type for separate API calls
  const websiteUpdates = updates.filter((u) => u.type === 'website');
  const appUpdates = updates.filter((u) => u.type === 'app');

  const promises: Promise<Response>[] = [];

  if (websiteUpdates.length > 0) {
    promises.push(
      fetch(`${API_BASE}/api/websites/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: websiteUpdates.map((u) => ({ id: u.id, priority: u.priority })),
        }),
      })
    );
  }

  if (appUpdates.length > 0) {
    promises.push(
      fetch(`${API_BASE}/api/apps/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: appUpdates.map((u) => ({ id: u.id, priority: u.priority })),
        }),
      })
    );
  }

  const results = await Promise.all(promises);
  const failed = results.find((r) => !r.ok);
  if (failed) {
    throw new Error('Failed to reorder projects');
  }
}
