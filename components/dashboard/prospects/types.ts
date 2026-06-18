export type ProspectSource = 'details_form' | 'review_request' | 'calendly_call';
export type ProspectStatus = 'new' | 'contacted' | 'qualified' | 'closed';

export interface LeadSubmission {
  id: string;
  company_name?: string;
  current_website?: string;
  brief_summary?: string;
  interested_in?: string;
  phone?: string;
  phone_number?: string;
  budget?: string;
  timeline?: string;
  improvements?: string[] | string;
  promo_code?: string;
  submitted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuditRequest {
  id: string;
  website_url: string;
  specifics?: string[] | string;
  other_detail?: string;
  phone_number?: string;
  submitted_at?: string;
  created_at?: string;
  updated_at?: string;
  promo_code?: string | null;
}

export interface CalendlyBooking {
  id: string;
  event_uri?: string;
  invitee_uri?: string;
  calendly_event_uri?: string;
  calendly_invitee_uri?: string;
  event_name?: string;
  event_type_name?: string;
  start_time?: string;
  event_start_at?: string;
  cancel_url?: string;
  reschedule_url?: string;
  booked_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Prospect {
  id: string;
  name: string;
  email: string;
  source: ProspectSource;
  status: ProspectStatus;
  notes?: string;
  first_seen?: string;
  last_activity?: string;
  created_at?: string;
  updated_at?: string;
  lead_submission_count?: number;
  audit_request_count?: number;
  calendly_booking_count?: number;
  lead_submission?: LeadSubmission;
  audit_request?: AuditRequest;
  calendly_booking?: CalendlyBooking;
  lead_submissions?: LeadSubmission[];
  audit_requests?: AuditRequest[];
  calendly_bookings?: CalendlyBooking[];
}

export interface ProspectStats {
  total: number;
  by_source: {
    details_form: number;
    review_request: number;
    calendly_call: number;
  };
  by_status: {
    new: number;
    contacted: number;
    qualified: number;
    closed: number;
  };
}

export interface ProspectsListResponse {
  prospects: Prospect[];
  total: number;
  page?: number;
  offset?: number;
  limit: number;
}

export const SOURCE_LABELS: Record<ProspectSource, string> = {
  details_form: 'Details Form',
  review_request: 'Review Request',
  calendly_call: 'Calendly Call',
};

export const STATUS_LABELS: Record<ProspectStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  closed: 'Closed',
};

// Colors as Tailwind class fragments
export const SOURCE_COLORS: Record<ProspectSource, { bg: string; text: string; border: string }> = {
  details_form: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    border: 'border-blue-500/20',
  },
  review_request: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-500',
    border: 'border-purple-500/20',
  },
  calendly_call: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500',
    border: 'border-emerald-500/20',
  },
};

export const STATUS_COLORS: Record<ProspectStatus, { bg: string; text: string; border: string }> = {
  new: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
    border: 'border-amber-500/20',
  },
  contacted: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    border: 'border-blue-500/20',
  },
  qualified: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-500',
    border: 'border-purple-500/20',
  },
  closed: {
    bg: 'bg-gray-500/10',
    text: 'text-gray-400',
    border: 'border-gray-500/20',
  },
};
