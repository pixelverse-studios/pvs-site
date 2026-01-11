/**
 * Type definitions for Domani Users Dashboard
 * Active app user profiles from the Domani app
 */

// User subscription tiers
export type UserTier = 'free' | 'premium' | 'lifetime';

// User signup cohorts
export type SignupCohort = 'friends_family' | 'early_adopter' | 'general';

// User profile from the profiles table
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  tier: UserTier;
  signup_cohort: SignupCohort;
  signup_method: string;
  timezone: string;
  created_at: string;
  deleted_at: string | null;
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
  tier?: UserTier;
  cohort?: SignupCohort;
  include_deleted?: boolean;
  limit?: number;
  offset?: number;
  start_date?: string;
  end_date?: string;
}

// Tier display configuration
export interface TierConfig {
  label: string;
  color: string;
  bgColor: string;
}

// Tier badge colors
export const TIER_COLORS: Record<UserTier, TierConfig> = {
  free: {
    label: 'Free',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800/50',
  },
  premium: {
    label: 'Premium',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  lifetime: {
    label: 'Lifetime',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
};

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
