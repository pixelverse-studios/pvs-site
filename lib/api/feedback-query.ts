import type { FeedbackQueryParams } from '@/lib/types/feedback';

export function feedbackQuery(params: FeedbackQueryParams = {}): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') query.set(key, String(value));
  }
  return query.toString();
}
