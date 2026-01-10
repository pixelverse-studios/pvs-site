/**
 * Type definitions for Domani Feedback Dashboard
 * Combines beta_feedback and support_requests into unified view
 */

// Feedback categories from beta_feedback table
export type FeedbackCategory = 'bug' | 'feature' | 'love' | 'general';

// Support request category (treated as a special type)
export type SupportCategory = 'support';

// Combined category type for unified view
export type UnifiedCategory = FeedbackCategory | SupportCategory;

// Status values for feedback items
export type FeedbackStatus = 'new' | 'reviewed' | 'resolved';

// Platform values
export type Platform = 'ios' | 'android';

// Source type to distinguish between feedback and support requests
export type FeedbackSource = 'beta_feedback' | 'support_request';

// Base interface for shared fields
interface BaseFeedbackFields {
  id: string;
  user_id: string | null;
  email: string;
  status: FeedbackStatus;
  platform: Platform;
  app_version: string;
  app_build: string | null;
  device_brand: string | null;
  device_model: string | null;
  os_version: string | null;
  created_at: string;
}

// Beta feedback item from beta_feedback table
export interface BetaFeedback extends BaseFeedbackFields {
  category: FeedbackCategory;
  message: string;
}

// Support request from support_requests table
export interface SupportRequest extends BaseFeedbackFields {
  category: string; // Support category (more flexible)
  description: string;
}

// Unified feedback item for dashboard display
export interface UnifiedFeedbackItem {
  id: string;
  source: FeedbackSource;
  user_id: string | null;
  email: string;
  category: UnifiedCategory;
  message: string; // message for feedback, description for support
  status: FeedbackStatus;
  platform: Platform;
  app_version: string;
  app_build: string | null;
  device_brand: string | null;
  device_model: string | null;
  os_version: string | null;
  created_at: string;
}

// API response types
export interface FeedbackListResponse {
  items: UnifiedFeedbackItem[];
  total: number;
  feedback_count: number;
  support_count: number;
}

// Query params for filtering
export interface FeedbackQueryParams {
  category?: UnifiedCategory;
  status?: FeedbackStatus;
  platform?: Platform;
  source?: FeedbackSource;
  search?: string; // Search in email or message
  start_date?: string; // ISO date
  end_date?: string; // ISO date
  limit?: number;
  offset?: number;
  sort_by?: 'created_at' | 'status';
  sort_order?: 'asc' | 'desc';
}

// Request type for updating feedback status
export interface UpdateFeedbackStatusRequest {
  status: FeedbackStatus;
}

// Category display configuration
export interface CategoryConfig {
  label: string;
  color: string;
  bgColor: string;
  icon?: string;
}

// Status display configuration
export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
}

// Category colors mapping
export const CATEGORY_COLORS: Record<UnifiedCategory, CategoryConfig> = {
  bug: {
    label: 'Bug',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  feature: {
    label: 'Feature',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  love: {
    label: 'Love',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  general: {
    label: 'General',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800/50',
  },
  support: {
    label: 'Support',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
};

// Status colors mapping
export const STATUS_COLORS: Record<FeedbackStatus, StatusConfig> = {
  new: {
    label: 'New',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  reviewed: {
    label: 'Reviewed',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  resolved: {
    label: 'Resolved',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
};
