import { describe, expect, it, vi } from 'vitest';
import { createCalendlyCompletionHandler } from './calendly-completion';

const booking = {
  event_uri: 'https://api.calendly.com/scheduled_events/event',
  invitee_uri: 'https://api.calendly.com/scheduled_events/event/invitees/invitee',
};
describe('Calendly completion acknowledgment', () => {
  it('counts and forwards duplicate supported callbacks only once', async () => {
    const onScheduled = vi.fn();
    const forward = vi.fn().mockResolvedValue({ ok: true });
    const onForwardError = vi.fn();
    const handler = createCalendlyCompletionHandler({ onScheduled, forward, onForwardError });
    await Promise.all([handler(booking), handler(booking)]);
    expect(onScheduled).toHaveBeenCalledTimes(1);
    expect(forward).toHaveBeenCalledTimes(1);
    expect(onForwardError).not.toHaveBeenCalled();
    await handler({ ...booking, invitee_uri: booking.invitee_uri + '2' });
    expect(onScheduled).toHaveBeenCalledTimes(2);
  });

  it.each(['http', 'network'])(
    'reports %s delivery failures without counting another booking or retrying',
    async (failure) => {
      const onScheduled = vi.fn();
      const onForwardError = vi.fn();
      const forward =
        failure === 'http'
          ? vi.fn().mockResolvedValue({ ok: false })
          : vi.fn().mockRejectedValue(new Error('offline'));
      const handler = createCalendlyCompletionHandler({ onScheduled, forward, onForwardError });
      await handler(booking);
      await handler(booking);
      expect(onScheduled).toHaveBeenCalledTimes(1);
      expect(forward).toHaveBeenCalledTimes(1);
      expect(onForwardError).toHaveBeenCalledTimes(1);
    },
  );

  it('ignores incomplete provider signals', async () => {
    const onScheduled = vi.fn();
    const forward = vi.fn();
    await createCalendlyCompletionHandler({ onScheduled, forward, onForwardError: vi.fn() })({
      ...booking,
      invitee_uri: '',
    });
    expect(onScheduled).not.toHaveBeenCalled();
    expect(forward).not.toHaveBeenCalled();
  });
});
