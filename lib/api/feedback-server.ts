import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { getApiBaseUrl } from '@/lib/api-config';
import { feedbackQuery } from './feedback';
import type {
  FeedbackListResponse,
  FeedbackQueryParams,
  FeedbackStats,
} from '@/lib/types/feedback';

export async function feedbackAccessToken(): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const { data: session } = await supabase.auth.getSession();
  return session.session?.user.id === data.user.id ? session.session.access_token : null;
}
async function read<T>(path: string): Promise<T> {
  const token = await feedbackAccessToken();
  if (!token) throw new Error('Your session has expired. Please sign in again.');
  const response = await fetch(new URL(`/api/domani/feedback${path}`, getApiBaseUrl()), {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!response.ok)
    throw new Error(
      response.status === 403
        ? 'You do not have staff access to feedback.'
        : 'Feedback service unavailable. Please try again.',
    );
  return response.json();
}
export const getServerFeedbackItems = (params: FeedbackQueryParams) =>
  read<FeedbackListResponse>(`?${feedbackQuery(params)}`);
export const getServerFeedbackStats = () => read<FeedbackStats>('/stats');
