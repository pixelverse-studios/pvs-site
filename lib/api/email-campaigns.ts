import { getApiBaseUrl } from '@/lib/api-config';
import type {
  CampaignListResponse,
  PreviewPayload,
  PreviewResponse,
  SendPayload,
  SendResponse,
} from '@/lib/types/email-campaign';

const BLAST_SECRET = process.env.NEXT_PUBLIC_BLAST_SECRET ?? '';

function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-Blast-Secret': BLAST_SECRET,
  };
}

/**
 * Send a preview email to Phil & Sami for review
 */
export async function previewCampaign(payload: PreviewPayload): Promise<PreviewResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/domani/email-campaigns/preview`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to send preview');
  }

  return res.json();
}

/**
 * Send campaign to selected recipients
 */
export async function sendCampaign(payload: SendPayload): Promise<SendResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/domani/email-campaigns/send`, {
    method: 'POST',
    headers: getHeaders(),
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
 * Fetch campaign history with pagination
 */
export async function getCampaigns(
  params?: { limit?: number; offset?: number },
): Promise<CampaignListResponse> {
  const searchParams = new URLSearchParams();

  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));

  const res = await fetch(
    `${getApiBaseUrl()}/api/domani/email-campaigns?${searchParams}`,
    {
      cache: 'no-store',
      headers: { 'X-Blast-Secret': BLAST_SECRET },
    },
  );

  if (!res.ok) {
    throw new Error('Failed to fetch campaigns');
  }

  return res.json();
}
