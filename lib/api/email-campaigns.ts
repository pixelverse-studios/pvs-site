import { getApiBaseUrl } from '@/lib/api-config';
import type {
  CampaignListResponse,
  PreviewPayload,
  PreviewResponse,
  SendPayload,
  SendResponse,
} from '@/lib/types/email-campaign';

/**
 * Send a preview email to Phil & Sami for review.
 * Proxied through /api/campaigns/preview to keep BLAST_SECRET server-side.
 */
export async function previewCampaign(payload: PreviewPayload): Promise<PreviewResponse> {
  const res = await fetch('/api/campaigns/preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to send preview');
  }

  return res.json();
}

/**
 * Send campaign to selected recipients.
 * Proxied through /api/campaigns/send to keep BLAST_SECRET server-side.
 */
export async function sendCampaign(payload: SendPayload): Promise<SendResponse> {
  const res = await fetch('/api/campaigns/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    if (res.status === 409) {
      throw new Error('A campaign send is already in progress. Please wait and try again.');
    }
    throw new Error(error.message || 'Failed to send campaign');
  }

  return res.json();
}

/**
 * Fetch campaign history from client-side.
 * Proxied through /api/campaigns to keep BLAST_SECRET server-side.
 */
export async function getCampaignsClient(
  params?: { limit?: number; offset?: number },
): Promise<CampaignListResponse> {
  const searchParams = new URLSearchParams();

  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit));
  if (params?.offset !== undefined) searchParams.set('offset', String(params.offset));

  const res = await fetch(`/api/campaigns?${searchParams}`);

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch campaigns');
  }

  return res.json();
}

/**
 * Fetch campaign history with pagination.
 * Called server-side only — uses BLAST_SECRET directly via env var.
 */
export async function getCampaigns(
  params?: { limit?: number; offset?: number },
): Promise<CampaignListResponse> {
  const BLAST_SECRET = process.env.BLAST_SECRET ?? '';
  const searchParams = new URLSearchParams();

  if (params?.limit !== undefined) searchParams.set('limit', String(params.limit));
  if (params?.offset !== undefined) searchParams.set('offset', String(params.offset));

  const res = await fetch(
    `${getApiBaseUrl()}/api/domani/email-campaigns?${searchParams}`,
    {
      cache: 'no-store',
      headers: { 'X-Blast-Secret': BLAST_SECRET },
    },
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Campaign API error (${res.status})`);
  }

  return res.json();
}
