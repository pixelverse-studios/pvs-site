/**
 * Type definitions for Domani Users Dashboard
 * Active app user profiles from the Domani app
 */

// User signup cohorts
export type SignupCohort = 'friends_family' | 'early_adopter' | 'general';

// User profile from the profiles table
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  signup_cohort: SignupCohort;
  signup_method: string;
  timezone: string;
  created_at: string;
  deleted_at: string | null;
  last_active_at: string | null;
  joined_at?: string | null;
  profile_created_at?: string | null;
  last_sign_in_at?: string | null;
  activity_source?: string | null;
  login_providers?: string[];
  email_confirmed_at?: string | null;
  email_verification_status?: 'verified' | 'unverified' | 'unknown';
  account_status?: 'active' | 'deletion_pending' | 'deleted' | 'banned' | 'unknown';
  deletion_scheduled_for?: string | null;
  latest_device_observation?: DeviceObservation | null;
  feedback_count?: number;
}

export interface DeviceObservation {
  source: 'feedback' | 'support';
  source_id: string;
  observed_at: string | null;
  platform: string | null;
  device_brand: string | null;
  device_model: string | null;
  os_version: string | null;
  app_version: string | null;
  app_build: string | null;
}
export interface UserStats {
  total: number;
  non_deleted: number;
  deleted: number;
  active_30d: number;
  activity_unknown: number;
  activity_window_days: number;
  data_as_of?: string;
}
export type UserSort =
  | 'joined_at'
  | 'created_at'
  | 'last_active_at'
  | 'last_sign_in_at'
  | 'email'
  | 'full_name'
  | 'account_status';
// API response type
export interface UsersListResponse {
  items: UserProfile[];
  total: number;
  limit: number;
  offset: number;
  stats: UserStats;
  data_as_of: string;
}

// Query params for filtering
export interface UsersQueryParams {
  search?: string;
  provider?: string;
  platform?: string;
  account_status?: string;
  verification?: string;
  activity?: string;
  app_version?: string;
  sort_by?: UserSort;
  sort_order?: 'asc' | 'desc';
  cohort?: SignupCohort;
  include_deleted?: boolean;
  limit?: number;
  offset?: number;
  start_date?: string;
  end_date?: string;
}

// Cohort display configuration
export interface CohortConfig {
  label: string;
  color: string;
  bgColor: string;
}

// Cohort badge colors
export const COHORT_COLORS: Record<SignupCohort, CohortConfig> = {
  friends_family: {
    label: 'Friends & Family',
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
  },
  early_adopter: {
    label: 'Early Adopter',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  general: {
    label: 'General',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800/50',
  },
};

// Signup method display labels
export const SIGNUP_METHOD_LABELS: Record<string, string> = {
  email: 'Email',
  google: 'Google',
  apple: 'Apple',
  github: 'GitHub',
};
