export function feedbackDelivery(status?: string | null) {
  switch (status) {
    case 'queued':
    case 'sending':
      return { label: 'Queued', detail: 'Your reply is waiting to be sent.' };
    case 'accepted':
      return {
        label: 'Sent',
        detail: 'Accepted by the email provider. Delivery is not confirmed yet.',
      };
    case 'delivered':
      return { label: 'Delivered', detail: 'Delivered to the recipient’s mail server.' };
    case 'delayed':
      return {
        label: 'Delayed',
        detail: 'The receiving server is temporarily unavailable. The provider will keep trying.',
      };
    case 'bounced':
      return {
        label: 'Failed',
        detail:
          'The recipient’s mail server rejected this reply. Check the email address before contacting them again.',
      };
    case 'complained':
      return {
        label: 'Failed',
        detail: 'The recipient marked this email as spam. Do not resend it.',
      };
    case 'failed':
      return {
        label: 'Failed',
        detail: 'This reply could not be delivered. Retry is available only when safe.',
      };
    case 'received':
      return { label: 'Received', detail: 'An incoming response.' };
    default:
      return { label: 'Delivery unconfirmed', detail: 'Check status before sending another copy.' };
  }
}
