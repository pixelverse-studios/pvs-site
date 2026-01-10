/**
 * Type definitions for Domani Waitlist Dashboard
 * Pre-launch waitlist signups from the Domani app
 */

// Waitlist entry from the waitlist table
export interface WaitlistEntry {
  id: string;
  email: string;
  referral_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// API response type
export interface WaitlistListResponse {
  items: WaitlistEntry[];
  total: number;
  limit: number;
  offset: number;
}

// Query params for filtering
export interface WaitlistQueryParams {
  limit?: number;
  offset?: number;
}

// Referral type display configuration
export interface ReferralTypeConfig {
  label: string;
  color: string;
  bgColor: string;
}

export const REFERRAL_TYPES: Record<string, ReferralTypeConfig> = {
  organic: {
    label: 'Organic',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800/50',
  },
  referral: {
    label: 'Referral',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  social: {
    label: 'Social',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  press: {
    label: 'Press',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
};
