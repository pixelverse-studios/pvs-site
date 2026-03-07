/**
 * Type definitions for Email Campaign Dashboard
 * Supports compose, preview, send, and history views
 */

// Per-recipient result stored in campaign JSONB
export interface CampaignRecipient {
  email: string;
  name: string;
  success: boolean;
  error?: string;
}

// Campaign record from email_campaigns table
export interface Campaign {
  id: string;
  template_type: string;
  subject: string;
  html_content: string;
  recipient_count: number;
  successful: number;
  failed: number;
  recipients: CampaignRecipient[];
  sent_by: string;
  created_at: string;
}

// GET /api/domani/email-campaigns response
export interface CampaignListResponse {
  campaigns: Campaign[];
  total: number;
}

// POST /api/domani/email-campaigns/preview body
export interface PreviewPayload {
  subject: string;
  htmlContent: string;
}

// POST /api/domani/email-campaigns/preview response
export interface PreviewResponse {
  message: string;
  previewSentTo: string[];
}

// POST /api/domani/email-campaigns/send body
export interface SendPayload {
  subject: string;
  htmlContent: string;
  recipientIds: string[];
  sentBy: string;
  delayBetweenEmails?: number;
}

// POST /api/domani/email-campaigns/send response
export interface SendResponse {
  campaignId: string;
  total: number;
  successful: number;
  failed: number;
}

// Delivery status display configuration
export type DeliveryStatus = 'success' | 'failed';

export interface DeliveryStatusConfig {
  label: string;
  color: string;
  bgColor: string;
}

export const DELIVERY_STATUS_COLORS: Record<DeliveryStatus, DeliveryStatusConfig> = {
  success: {
    label: 'Sent',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  failed: {
    label: 'Failed',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
};

// Template type display configuration
export interface TemplateTypeConfig {
  label: string;
  color: string;
  bgColor: string;
}

export const TEMPLATE_TYPE_COLORS: Record<string, TemplateTypeConfig> = {
  version_release: {
    label: 'Version Release',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
};
