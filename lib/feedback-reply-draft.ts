import type { FeedbackReplyState } from '@/lib/api/feedback';

export interface ReplyDraft {
  subject: string;
  text: string;
  key?: string;
  result?: FeedbackReplyState;
  phase: 'draft' | 'pending' | 'submitted' | 'unknown';
  error?: string;
  missingIntent?: boolean;
}
export const emptyReplyDraft = (): ReplyDraft => ({
  subject: 'Re: Your Domani feedback',
  text: '',
  phase: 'draft',
});
export const hasUnsentReply = (draft: ReplyDraft) =>
  !!draft.text &&
  !['accepted', 'delivered', 'bounced', 'complained'].includes(draft.result?.delivery_status || '');
