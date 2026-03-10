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
  last_sign_in_at: string | null;
}

// API response type
export interface UsersListResponse {
  items: UserProfile[];
  total: number;
  limit: number;
  offset: number;
}

// Query params for filtering
export interface UsersQueryParams {
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
